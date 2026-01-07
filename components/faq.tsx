'use client'

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { siteConfig } from "@/lib/site-config"

export function FAQ() {
  const prefersReducedMotion = useReducedMotion()

  const faqs = [
    {
      question: "What is this site?",
      answer:
        "This is an independent web app that lets you upload an image, write a prompt, and generate an edited result. Requests are routed to third-party image models via OpenRouter.",
    },
    {
      question: "How does it work?",
      answer:
        "Upload an image, write what you want changed, then click Generate. The model returns one or more images which we display in the output gallery.",
    },
    {
      question: "What plans unlock which models?",
      answer:
        "Plans are tiered. Pro unlocks Standard; Team unlocks Standard + Pro; Plus unlocks Standard + Pro + Plus. See the Pricing page for details.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes. You can cancel through the Customer Portal from the Pricing page. Your plan stays active until the end of the billing period.",
    },
    {
      question: "Do you store my images?",
      answer:
        "We do not intentionally store uploaded images. Images and prompts are sent to generation providers to produce outputs. See the Privacy Policy for details.",
    },
    {
      question: "How do I contact support?",
      answer: `Email ${siteConfig.supportEmail}.`,
    },
  ]

  return (
    <section id="faq" className="px-4 py-16 sm:px-6 sm:py-24" aria-label="Frequently asked questions">
      <div className="mx-auto max-w-3xl">
        <motion.div
          className="mb-12 text-center sm:mb-16"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-3 sm:mb-4">FAQs</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Frequently Asked Questions</p>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-sm sm:text-base">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}

