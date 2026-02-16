import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Inicia sesión en Strop para gestionar tus proyectos de construcción',
  robots: {
    index: true,
    follow: true,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
