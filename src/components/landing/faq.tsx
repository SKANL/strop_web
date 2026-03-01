import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQS = [
  {
    id: "q1",
    question: "¿Es difícil de implementar en mis obras?",
    answer: "No. Strop está diseñado para ser usado por residentes de obra sin capacitación técnica compleja. Si pueden usar WhatsApp, pueden usar Strop.",
  },
  {
    id: "q2",
    question: "¿Mis datos están seguros?",
    answer: "Absolutamente. Usamos encriptación de nivel bancario y tus datos se respaldan automáticamente todos los días.",
  },
  {
    id: "q3",
    question: "¿Puedo cancelar cuando quiera?",
    answer: "Sí. No hay contratos forzosos a largo plazo en nuestros planes estándar. Tu libertad es nuestra prioridad.",
  },
  {
    id: "q4",
    question: "¿Ofrecen facturación para México?",
    answer: "Sí, todos nuestros precios incluyen IVA y emitimos facturas fiscales cumpliendo con todos los requisitos del SAT.",
  },
]

export function FAQ() {
  return (
    <div className="bg-white dark:bg-black py-24 sm:py-32" id="faq">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Preguntas Frecuentes
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Resolvemos tus dudas para que tomes la mejor decisión.
          </p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="mx-auto max-w-3xl"
          aria-label="Preguntas frecuentes"
        >
          {FAQS.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left text-base font-semibold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-7 text-gray-600 dark:text-gray-300 pr-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
