"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import {
  BarChart3Icon,
  BellIcon,
  CalendarIcon,
  CreditCardIcon,
  DollarSignIcon,
  FileTextIcon,
  PieChartIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react"

const features = [
  {
    icon: <WalletIcon className="h-8 w-8" />,
    title: "Account Tracking",
    description:
      "Connect and monitor all your financial accounts in one place for a complete overview of your finances.",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    glowColor: "shadow-blue-500/25",
  },
  {
    icon: <BarChart3Icon className="h-8 w-8" />,
    title: "Expense Analytics",
    description:
      "Visualize your spending patterns with interactive charts and graphs to identify saving opportunities.",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-500/10 to-emerald-500/10",
    glowColor: "shadow-green-500/25",
  },
  {
    icon: <PieChartIcon className="h-8 w-8" />,
    title: "Budget Management",
    description: "Create custom budgets for different categories and track your progress to stay within your limits.",
    gradient: "from-purple-500 to-violet-500",
    bgGradient: "from-purple-500/10 to-violet-500/10",
    glowColor: "shadow-purple-500/25",
  },
  {
    icon: <TrendingUpIcon className="h-8 w-8" />,
    title: "Financial Goals",
    description: "Set and track progress towards your savings goals with visual progress indicators and projections.",
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-500/10 to-red-500/10",
    glowColor: "shadow-orange-500/25",
  },
  {
    icon: <BellIcon className="h-8 w-8" />,
    title: "Smart Notifications",
    description:
      "Receive timely alerts for unusual spending, upcoming bills, and when you're approaching budget limits.",
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-500/10 to-rose-500/10",
    glowColor: "shadow-pink-500/25",
  },
  {
    icon: <FileTextIcon className="h-8 w-8" />,
    title: "Financial Reports",
    description: "Generate detailed reports on your income, expenses, and net worth to track your financial health.",
    gradient: "from-indigo-500 to-blue-500",
    bgGradient: "from-indigo-500/10 to-blue-500/10",
    glowColor: "shadow-indigo-500/25",
  },
  {
    icon: <CreditCardIcon className="h-8 w-8" />,
    title: "Transaction Import",
    description: "Easily import transactions from your bank or credit card statements to keep your records up to date.",
    gradient: "from-red-500 to-pink-500",
    bgGradient: "from-red-500/10 to-pink-500/10",
    glowColor: "shadow-red-500/25",
  },
  {
    icon: <CalendarIcon className="h-8 w-8" />,
    title: "Recurring Transactions",
    description: "Set up and track recurring expenses and income to better plan your monthly cash flow.",
    gradient: "from-teal-500 to-cyan-500",
    bgGradient: "from-teal-500/10 to-cyan-500/10",
    glowColor: "shadow-teal-500/25",
  },
  {
    icon: <DollarSignIcon className="h-8 w-8" />,
    title: "Tax Preparation",
    description: "Categorize tax-related expenses throughout the year to simplify your tax preparation process.",
    gradient: "from-amber-500 to-yellow-500",
    bgGradient: "from-amber-500/10 to-yellow-500/10",
    glowColor: "shadow-amber-500/25",
  },
]

export function FeaturesSection() {
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
      id="features"
      className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 float"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 float-reverse"></div>
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
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <motion.div
            className="inline-block p-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 mb-6"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4">
              <BarChart3Icon className="h-8 w-8 text-purple-500" />
            </div>
          </motion.div>

          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Powerful features to{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              transform
            </span>{" "}
            your finances
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            FinTrack provides all the tools you need to take control of your financial life, from expense tracking to
            goal setting and beyond. Experience the future of personal finance management.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              initial="hidden"
              animate={controls}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
              className="group relative"
            >
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200`}
              ></div>

              <div className="relative h-full p-8 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-xl">
                <motion.div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.bgGradient} mb-6 shadow-lg ${feature.glowColor}`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className={`text-transparent bg-gradient-to-r ${feature.gradient} bg-clip-text`}>
                    {feature.icon}
                  </div>
                </motion.div>

                <h3 className="text-xl font-bold mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

                {/* Animated border */}
                <div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                  }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
