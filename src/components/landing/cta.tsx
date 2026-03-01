import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <div className="bg-zinc-950 border-t border-zinc-800">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tu rentabilidad no puede esperar.
            <br />
            <span className="text-orange-400">Empieza a optimizar hoy mismo.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-400">
            Únete a las empresas que han dejado de perder el 15% de sus materiales en "mermas" misteriosas.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 h-12 text-base w-full sm:w-auto">
              <Link href="/signup">Comenzar Prueba Gratis</Link>
            </Button>
            <Link
              href="/login"
              className="text-sm font-semibold leading-6 text-zinc-300 hover:text-white hover:underline underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
            >
              Ya tengo cuenta →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
