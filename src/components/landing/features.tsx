import { Wallet, LineChart, Zap, Search } from "lucide-react"

export function Features() {
  const features = [
    {
      name: 'Finanzas Blindadas',
      description:
        'Cada peso gastado está rastreado. Detecta desviaciones presupuestales en el momento exacto en que ocurren, no cuando se acaba el dinero.',
      icon: Wallet,
    },
    {
      name: 'Reportes Automáticos',
      description:
        'Olvídate de perseguir a los residentes por fotos y reportes. Strop centraliza la información de campo automáticamente.',
      icon: Zap,
    },
    {
      name: 'Auditoría en Tiempo Real',
      description:
        'Tu "Panic Room" personal. Un tablero que te alerta solo de lo que requiere tu atención inmediata. Gestión por excepción.',
      icon: Search,
    },
    {
      name: 'Proyecciones Financieras',
      description:
        'Anticípate al flujo de caja. Conoce cuánto necesitarás la próxima semana con base en el avance real de la obra.',
      icon: LineChart,
    },
  ]

  return (
    <div className="bg-zinc-50 py-24 sm:py-32 dark:bg-zinc-900" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-orange-600">Más Rápido. Más Claro.</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Todo lo que necesitas para dominar tu obra
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            No es otro Excel complicado. Es una plataforma diseñada para darte paz mental y control financiero absoluto.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
