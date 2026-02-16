"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function FAQ() {
  const faqs = [
    {
      question: "¿Es difícil de implementar en mis obras?",
      answer: "No. Strop está diseñado para ser usado por residentes de obra sin capacitación técnica compleja. Si pueden usar WhatsApp, pueden usar Strop."
    },
    {
      question: "¿Mis datos están seguros?",
      answer: "Absolutamente. Usamos encriptación de nivel bancario y tus datos se respaldan automáticamente todos los días."
    },
    {
      question: "¿Puedo cancelar cuando quiera?",
      answer: "Sí. No hay contratos forzosos a largo plazo en nuestros planes estándar. Tu libertad es nuestra prioridad."
    },
    {
      question: "¿Ofrecen facturación para México?",
      answer: "Sí, todos nuestros precios incluyen IVA y emitimos facturas fiscales cumpliendo con todos los requisitos del SAT."
    }
  ]

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
        <div className="mx-auto max-w-3xl divide-y divide-gray-900/10 dark:divide-white/10">
            {faqs.map((faq, index) => (
                <AccordionItem key={index} question={faq.question} answer={faq.answer} />
            ))}
        </div>
      </div>
    </div>
  )
}

function AccordionItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="py-6">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-start justify-between text-left text-gray-900 dark:text-white"
            >
                <span className="text-lg font-semibold">{question}</span>
                <span className="ml-6 flex h-7 items-center">
                    <ChevronDown className={cn("h-6 w-6 transform transition-transform duration-200", isOpen && "rotate-180")} />
                </span>
            </button>
            <div className={cn("mt-2 pr-12 overflow-hidden transition-all duration-300", isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
                <p className="text-base leading-7 text-gray-600 dark:text-gray-300">{answer}</p>
            </div>
        </div>
    )
}
