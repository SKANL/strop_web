import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
               <span className="text-2xl font-bold tracking-tighter text-white">
                STROP<span className="text-orange-500">.</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-zinc-400">
              La plataforma de control financiero para constructoras que no quieren perder dinero.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Producto</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link href="#features" className="hover:text-white transition-colors">Características</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Precios</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Roadmap</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Compañía</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link href="#" className="hover:text-white transition-colors">Nosotros</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Carreras</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Legal</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link href="#" className="hover:text-white transition-colors">Privacidad</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Términos</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-zinc-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Strop SaaS. Todos los derechos reservados.</p>
          <div className="flex gap-4">
             {/* Social links (icons) could go here */}
          </div>
        </div>
      </div>
    </footer>
  )
}
