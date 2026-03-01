import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const tiers = [
  {
    name: "Starter",
    id: "tier-starter",
    href: "/signup",
    priceMonthly: "$49 MXN",
    description: "Perfecto para remodelaciones y pequeñas obras.",
    features: ["1 Proyecto activo", "2 Usuarios", "Control de Gastos", "Reportes básicos"],
    mostPopular: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "/signup",
    priceMonthly: "$199 MXN",
    description: "Para constructoras en crecimiento y desarrolladores.",
    features: [
      "5 Proyectos activos",
      "Usuarios ilimitados",
      "Panic Room",
      "Validación de costos",
      "Soporte prioritario",
    ],
    mostPopular: true,
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "/signup",
    priceMonthly: "Personalizado",
    description: "Control total para grandes corporativos.",
    features: [
      "Proyectos ilimitados",
      "API Access",
      "Single Sign-On (SSO)",
      "Dashboard personalizado",
      "Gerente de cuenta dedicado",
    ],
    mostPopular: false,
  },
]

export function Pricing() {
  return (
    <div className="bg-zinc-50 py-24 sm:py-32 dark:bg-zinc-900" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Precios simples, ROI inmediato</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Paga una fracción de lo que te ahorramos en mermas y desvíos desde el primer mes. Precios en MXN + IVA.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
             <div
               key={tier.id}
               className={`flex flex-col justify-between rounded-3xl p-8 ring-1 xl:p-10 ${
                 tier.mostPopular
                   ? "bg-zinc-900 ring-zinc-900 lg:z-10 lg:scale-105 shadow-xl"
                   : "bg-white ring-gray-200 dark:bg-zinc-900 dark:ring-gray-700"
               }`}
             >
               <div>
                   <div className="flex items-center justify-between gap-x-4">
                     <h3 className={`text-lg font-semibold leading-8 ${tier.mostPopular ? "text-white" : "text-gray-900 dark:text-white"}`}>{tier.name}</h3>
                     {tier.mostPopular ? (
                       <p className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold leading-5 text-orange-600">Más Popular</p>
                     ) : null}
                   </div>
                   <p className={`mt-4 text-sm leading-6 ${tier.mostPopular ? "text-gray-300" : "text-gray-600 dark:text-gray-300"}`}>{tier.description}</p>
                   <p className="mt-6 flex items-baseline gap-x-1">
                     <span className={`text-4xl font-bold tracking-tight ${tier.mostPopular ? "text-white" : "text-gray-900 dark:text-white"}`}>
                       {tier.priceMonthly}
                     </span>
                     {tier.priceMonthly !== "Personalizado" && (
                       <span className={`text-sm font-semibold leading-6 ${tier.mostPopular ? "text-gray-300" : "text-gray-600 dark:text-gray-400"}`}>/mes</span>
                     )}
                   </p>
                   <ul role="list" className={`mt-8 space-y-3 text-sm leading-6 ${tier.mostPopular ? "text-gray-300" : "text-gray-600 dark:text-gray-300"}`}>
                     {tier.features.map((feature) => (
                       <li key={feature} className="flex gap-x-3">
                         <Check className={`h-6 w-5 flex-none ${tier.mostPopular ? "text-orange-500" : "text-orange-600"}`} aria-hidden="true" />
                         {feature}
                       </li>
                     ))}
                   </ul>
               </div>
               <Button
                 asChild
                 className={`mt-8 w-full ${
                   tier.mostPopular
                     ? "bg-orange-600 hover:bg-orange-500 text-white focus-visible:ring-orange-600"
                     : "bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                 }`}
                 variant={tier.mostPopular ? "default" : "secondary"}
               >
                 <Link href={tier.id === "tier-enterprise" ? "#" : tier.href}>
                   {tier.id === "tier-enterprise" ? "Hablar con Ventas" : "Empezar Gratis"}
                 </Link>
               </Button>
             </div>
          ))}
        </div>
      </div>
    </div>
  )
}
