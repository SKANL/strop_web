import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { CTA } from "@/components/landing/cta"
import { Trust } from "@/components/landing/trust"
import { Pricing } from "@/components/landing/pricing"
import { FAQ } from "@/components/landing/faq"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
// Landing page uses standard server component pattern
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />

      <main className="flex-1 pt-16">
        <section className="animate-in fade-in zoom-in-95 duration-1000 slide-in-from-top-10">
            <Hero />
        </section>
        
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-forwards">
            <Trust />
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-forwards">
            <Features />
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-forwards">
            <Pricing />
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-forwards">
            <FAQ />
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-1000 fill-mode-forwards">
            <CTA />
        </section>
      </main>

      <Footer />
    </div>
  )
}
