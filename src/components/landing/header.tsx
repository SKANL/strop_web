"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useEffect, useState } from "react"

const NAV_LINKS = [
  { href: "#features", label: "Características" },
  { href: "#pricing",  label: "Precios" },
  { href: "#faq",      label: "FAQ" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-black/80 backdrop-blur-xl shadow-lg shadow-black/20"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Ir al inicio">
          <span className="text-xl font-bold tracking-tighter text-white">
            STROP<span className="text-orange-500">.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
          >
            Iniciar Sesión
          </Link>
          <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white border-0">
            <Link href="/signup">Prueba Gratis</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <div className="flex sm:hidden items-center gap-2">
          <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white border-0 text-xs px-3">
            <Link href="/signup">Gratis</Link>
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-zinc-950 border-zinc-800 w-72">
              <SheetTitle className="text-white text-lg font-bold tracking-tighter mb-6">
                STROP<span className="text-orange-500">.</span>
              </SheetTitle>
              <nav className="flex flex-col gap-1" aria-label="Menú móvil">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-3 py-3 rounded-md text-zinc-300 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t border-zinc-800 flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-3 py-3 rounded-md text-zinc-300 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
                  >
                    Iniciar Sesión
                  </Link>
                  <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white border-0">
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>Empezar Gratis</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
