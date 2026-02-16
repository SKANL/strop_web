import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-32 lg:pb-32 xl:pb-36">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-2xl lg:max-w-4xl lg:text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="rounded-full bg-orange-500/10 px-3 py-1 text-sm font-semibold leading-6 text-orange-500 ring-1 ring-inset ring-orange-500/20">
              Nueva Versión 2.0
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl font-sans">
            Deja de Perder Dinero en <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-red-600">
              Obras Fuera de Control
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
            Strop elimina el caos operativo y financiero. Obtén visibilidad total en tiempo real, detecta fugas de dinero antes de que ocurran y toma decisiones basadas en datos, no en suposiciones.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button asChild size="lg" className="h-14 px-8 text-lg bg-orange-600 hover:bg-orange-700 text-white border-0 shadow-lg shadow-orange-900/20">
              <Link href="/login">
                Tomar el Control Ahora <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Link href="#features" className="text-sm font-semibold leading-6 text-white hover:text-orange-400 transition-colors">
              Ver cómo funciona <span aria-hidden="true">→</span>
            </Link>
          </div>
          
          <div className="mt-12 flex justify-center items-center gap-8 text-gray-500 text-sm font-medium">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span>Datos Encriptados</span>
             </div>
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span>Cancelación en cualquier momento</span>
             </div>
          </div>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl opacity-20 pointer-events-none" aria-hidden="true">
           <div className="aspect-1155/678 w-288.75 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
      </div>
    </section>
  )
}
