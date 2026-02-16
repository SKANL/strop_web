import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl supports-backdrop-filter:bg-black/20">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tighter text-white">
            STROP<span className="text-orange-500">.</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="#features" className="hover:text-white transition-colors">Características</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Precios</Link>
          <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
            Iniciar Sesión
          </Link>
          <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white border-0">
            <Link href="/login">Prueba Gratis</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
