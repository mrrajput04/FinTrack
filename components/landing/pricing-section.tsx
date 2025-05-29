"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useAnimation, useInView } from "framer-motion"
import { CheckIcon, SparklesIcon, CrownIcon, RocketIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const plans = [
  {
    name: "Free",
    description: "Perfect for individuals just starting their financial journey",
    price: { monthly: 0, annually: 0 },
    features: [
      "Track up to 3 accounts",
      "Basic expense categorization",
      "Monthly budget setting",
      "30-day transaction history",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
    gradient: "from-gray-500 to-slate-600",
    bgGradient: "from-gray-50 to-slate-50",
    icon: <RocketIcon className="h-6 w-6" />,
  },
  {
    name: "Premium",
    description: "Ideal for individuals and families with multiple financial goals",
    price: { monthly: 9.99, annually: 99.99 },
    features: [
      "Unlimited accounts",
      "Advanced expense analytics",
      "Custom budget categories",
      "Unlimited transaction history",
      "Goal tracking and projections",
      "Bill reminders and alerts",
      "CSV import/export",
      "Priority email support",
    ],
    cta: "Start Free Trial",
    popular: true,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    icon: <SparklesIcon className="h-6 w-6" />,
  },
  {
    name: "Business",
    description: "For small businesses and freelancers managing business finances",
    price: { monthly: 19.99, annually: 199.99 },
    features: [
      "Everything in Premium",
      "Business account categorization",
      "Tax category labeling",
      "Multiple user access",
      "Quarterly financial reports",
      "Invoice tracking",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    popular: false,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    icon: <CrownIcon className="h-6 w-6" />,
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-40 left-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 float"></div>
        <div className="absolute bottom-40 right-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 float-reverse"></div>
      </div>

      <div className="container relative z-10">
        <motion.div
          ref={ref}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <motion.div
            className="inline-block p-2 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 mb-6"
            whileHover={{ scale: 1.05, rotate: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4">
              <CrownIcon className="h-8 w-8 text-green-500" />
            </div>
          </motion.div>

          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Simple,{" "}
            <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              transparent
            </span>{" "}
            pricing
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Choose the plan that's right for you and start taking control of your finances today.
          </p>

          <motion.div
            className="flex items-center justify-center gap-4 mb-8 p-2 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700 w-fit mx-auto"
            whileHover={{ scale: 1.02 }}
          >
            <Label
              htmlFor="billing-toggle"
              className={`font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </Label>
            <Switch id="billing-toggle" checked={annual} onCheckedChange={setAnnual} />
            <div className="flex items-center gap-2">
              <Label
                htmlFor="billing-toggle"
                className={`font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}
              >
                Annually
              </Label>
              <motion.span
                className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                Save 20%
              </motion.span>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              initial="hidden"
              animate={controls}
              transition={{ duration: 0.6, delay: 0.2 * index }}
              whileHover={{
                y: plan.popular ? -20 : -10,
                scale: plan.popular ? 1.05 : 1.02,
                transition: { duration: 0.3 },
              }}
              className="relative group"
            >
              {plan.popular && (
                <motion.div
                  className="absolute -top-6 left-0 right-0 flex justify-center z-10"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 text-sm font-bold text-white shadow-lg glow-pink">
                    <SparklesIcon className="inline h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </motion.div>
              )}

              <div
                className={`absolute -inset-1 bg-gradient-to-r ${plan.gradient} rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${plan.popular ? "opacity-50" : ""}`}
              ></div>

              <Card
                className={`relative h-full border-2 ${plan.popular ? "border-purple-200 dark:border-purple-700" : "border-gray-200 dark:border-slate-700"} shadow-xl bg-gradient-to-br ${plan.bgGradient} dark:from-slate-800 dark:to-slate-900`}
              >
                <CardHeader className="text-center pb-8 pt-8">
                  <motion.div
                    className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${plan.gradient} mb-4 mx-auto shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="text-white">{plan.icon}</div>
                  </motion.div>

                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>

                  <div className="mt-6 flex items-baseline justify-center">
                    <motion.span
                      className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                      key={annual ? "annual" : "monthly"}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      ${annual ? plan.price.annually : plan.price.monthly}
                    </motion.span>
                    {plan.price.monthly > 0 && (
                      <span className="ml-2 text-xl font-normal text-muted-foreground">
                        /{annual ? "year" : "month"}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="px-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * i }}
                      >
                        <CheckIcon className={`mr-3 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5`} />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="px-6 pb-8">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg glow-pink"
                        : "bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white"
                    } transform transition-all duration-300 hover:scale-105`}
                    asChild
                  >
                    <Link href="/signup">{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
