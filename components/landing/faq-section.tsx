"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How secure is my financial data on FinTrack?",
    answer:
      "FinTrack uses bank-level 256-bit encryption to protect your data. We never store your bank credentials, and all connections to financial institutions are made through secure, tokenized connections. Your privacy and security are our top priorities.",
  },
  {
    question: "Can I connect my bank accounts automatically?",
    answer:
      "Yes, FinTrack supports automatic connections to over 10,000 financial institutions worldwide. You can securely connect your checking, savings, credit cards, loans, and investment accounts to get a complete picture of your finances.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "FinTrack offers mobile apps for both iOS and Android devices, allowing you to track your finances on the go. The mobile apps include all the core features of the web application with a mobile-optimized interface.",
  },
  {
    question: "How does the free trial work?",
    answer:
      "Our 14-day free trial gives you full access to all Premium features. No credit card is required to start, and you'll receive a reminder before the trial ends. If you choose not to subscribe, your account will automatically downgrade to the Free plan.",
  },
  {
    question: "Can I export my financial data?",
    answer:
      "Yes, FinTrack allows you to export your financial data in CSV and PDF formats. Premium and Business plans offer additional export options and automated reports that can be scheduled and delivered to your email.",
  },
  {
    question: "What if I need help setting up my account?",
    answer:
      "Our comprehensive help center includes guides and video tutorials to help you get started. Free users have access to email support, while Premium and Business users receive priority support with faster response times.",
  },
  {
    question: "Can I track cash transactions?",
    answer:
      "Yes, you can manually add cash transactions to FinTrack. This allows you to maintain a complete record of all your spending, even when you're not using a card or digital payment method.",
  },
  {
    question: "Is it possible to share access with my spouse or financial advisor?",
    answer:
      "The Business plan allows for multiple user access with customizable permissions. This is perfect for sharing financial information with your spouse, financial advisor, or business partners while maintaining appropriate access controls.",
  },
]

export function FaqSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          ref={ref}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Frequently asked questions</h2>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about FinTrack and how it can help you manage your finances.
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate={controls}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
