import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <div className="bg-white dark:bg-black">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Tu rentabilidad no puede esperar.
            <br />
            Empieza a optimizar hoy mismo.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300">
            Únete a las empresas que han dejado de perder el 15% de sus materiales en "mermas" misteriosas.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 h-12 text-lg">
              <Link href="/login">Comenzar Prueba Gratis</Link>
            </Button>
            <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:underline">
              Hablar con Ventas <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
