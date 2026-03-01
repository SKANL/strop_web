import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/signup/verify',
    '/forgot-password',
    '/reset-password',
    '/auth',
    '/suspended',
  ]

  // Public link routes (no auth required)
  const isPublicLink = request.nextUrl.pathname.startsWith('/r/')
  const isSuspendedPage = request.nextUrl.pathname === '/suspended'
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route =>
    route === '/'
      ? request.nextUrl.pathname === '/'
      : request.nextUrl.pathname.startsWith(route)
  )

  // Redirect to login if not authenticated and not on public route
  if (!user && !isPublicRoute && !isPublicLink) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if authenticated and on auth pages
  if (user && isPublicRoute && !request.nextUrl.pathname.startsWith('/auth/callback') && !isSuspendedPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // ─── Subscription Gate ────────────────────────────────────────────────────
  // Only check subscription for authenticated users accessing dashboard routes.
  // The /suspended page itself is always accessible (no redirect loop).
  //
  // STRIPE INTEGRATION NOTE:
  // This block reads `subscription_status` from the organizations table.
  // To enable Stripe, simply create a webhook that updates that field.
  // No changes needed here.
  if (user && isDashboardRoute) {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('organization_id')
        .eq('id', user.id)
        .single()

      if (userData?.organization_id) {
        const { data: org } = await supabase
          .from('organizations')
          .select('subscription_status, trial_ends_at')
          .eq('id', userData.organization_id)
          .single()

        if (org) {
          const isSuspended = org.subscription_status === 'suspended'
          const isTrialExpired =
            org.subscription_status === 'trial' &&
            org.trial_ends_at !== null &&
            new Date() > new Date(org.trial_ends_at)

          if (isSuspended || isTrialExpired) {
            const url = request.nextUrl.clone()
            url.pathname = '/suspended'
            return NextResponse.redirect(url)
          }
        }
      }
    } catch {
      // If subscription columns don't exist yet (pre-migration), allow access.
      // This prevents the app from breaking before the migration is run.
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
