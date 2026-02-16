import { Building2, Landmark, Briefcase } from "lucide-react"

export function Trust() {
  const stats = [
    { label: "Capital Gestionado", value: "$50M+" },
    { label: "Obras Activas", value: "120+" },
    { label: "Empresas", value: "45+" },
  ]

  const companies = [
    { name: "Desarrollos verticales", icon: Building2 },
    { name: "Grupo Constructor", icon: Landmark },
    { name: "Inmobiliaria Norte", icon: Briefcase },
    { name: "Constructora Eje", icon: Building2 },
    { name: "Capital Real Estate", icon: Landmark },
  ]

  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-black border-y border-zinc-100 dark:border-zinc-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Con la confianza de constructoras líderes
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Desde desarrolladores residenciales hasta grandes constructoras de infraestructura.
          </p>
        </div>

        {/* Stats Section */}
        <div className="mx-auto max-w-4xl rounded-2xl bg-zinc-50 dark:bg-zinc-900 p-8 sm:p-10 mb-16 ring-1 ring-inset ring-gray-900/5 dark:ring-white/10">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-8 text-center sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="mx-auto flex max-w-xs flex-col gap-y-2">
                  <dt className="text-base leading-7 text-gray-600 dark:text-gray-400">{stat.label}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{stat.value}</dd>
                </div>
              ))}
            </dl>
        </div>

        {/* Logos Section */}
        <div className="mx-auto grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            {companies.map((company, index) => (
               <div key={company.name} className="flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity duration-300 group cursor-default">
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/30 transition-colors">
                      <company.icon className="h-8 w-8 text-gray-600 dark:text-gray-400 group-hover:text-orange-600 transition-colors" />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{company.name}</span>
               </div>
            ))}
        </div>

      </div>
    </div>
  )
}
