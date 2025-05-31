"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useAnimation, useInView, useScroll, useTransform } from "framer-motion"
import { ArrowRightIcon, CheckCircleIcon, SparklesIcon, TrendingUpIcon, ZapIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingParticles, BubbleEffect, SparkleEffect } from "@/components/ui/particle-effects"

export function HeroSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const mainControls = useAnimation()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible")
    }
  }, [isInView, mainControls])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <motion.section
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
      style={{ y, opacity }}
    >
      {/* Particle Effects */}
      <FloatingParticles count={80} className="opacity-60" />
      <BubbleEffect />
      <SparkleEffect count={30} />

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-yellow-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-8 left-40 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 40, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Interactive cursor effect */}
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            ref={ref}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={mainControls}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <motion.div
              className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-6 py-2 text-sm font-medium text-white shadow-lg"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(236, 72, 153, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(236, 72, 153, 0.3)",
                  "0 0 40px rgba(236, 72, 153, 0.6)",
                  "0 0 20px rgba(236, 72, 153, 0.3)",
                ],
              }}
              transition={{
                boxShadow: {
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                },
              }}
            >
              <SparklesIcon className="mr-2 h-4 w-4" />
              <span>Financial management reimagined</span>
              <ZapIcon className="ml-2 h-4 w-4" />
            </motion.div>

            <motion.h1
              className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-white"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Take control of your{" "}
              <motion.span
                className="gradient-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 100%",
                }}
              >
                finances
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-200 leading-relaxed"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              FinTrack helps you track expenses, set budgets, and achieve your financial goals with powerful analytics
              and beautiful visualizations. Experience the future of personal finance.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-4"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white shadow-lg transform transition-all duration-300"
                  asChild
                >
                  <Link href="/signup">
                    <motion.span
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      Get Started Free
                    </motion.span>
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                  asChild
                >
                  <Link href="#features">
                    <TrendingUpIcon className="mr-2 h-5 w-5" />
                    See Features
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-6"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              {["Free 14-day trial", "No credit card required", "Cancel anytime"].map((text, index) => (
                <motion.div
                  key={text}
                  className="flex items-center text-gray-200"
                  whileHover={{
                    scale: 1.05,
                    color: "#ffffff",
                  }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.5,
                    }}
                  >
                    <CheckCircleIcon className="mr-2 h-5 w-5 text-green-400" />
                  </motion.div>
                  <span className="text-sm font-medium">{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.8, rotateY: -30 },
              visible: { opacity: 1, scale: 1, rotateY: 0 },
            }}
            initial="hidden"
            animate={mainControls}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative mx-auto lg:mr-0 w-full max-w-[600px] aspect-[4/3]"
          >
            {/* Floating elements around the main image */}
            <motion.div
              className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-lg"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                scale: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }}
            />
            <motion.div
              className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-lg"
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl shadow-lg"
              animate={{
                borderRadius: [
                  "30% 70% 70% 30% / 30% 30% 70% 70%",
                  "70% 30% 50% 50% / 30% 30% 70% 70%",
                  "100% 60% 60% 100% / 100% 100% 60% 60%",
                  "30% 70% 70% 30% / 30% 30% 70% 70%",
                ],
                y: [0, 20, 0],
              }}
              transition={{
                borderRadius: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                y: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }}
            />

            {/* Main dashboard preview */}
            <motion.div
              className="relative rounded-3xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden"
              whileHover={{
                scale: 1.02,
                rotateY: 5,
                rotateX: 5,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-purple-400/20 to-pink-400/20"></div>

              {/* Mock dashboard content */}
              <div className="relative p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <motion.div
                    className="w-32 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <motion.div
                    className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10"
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                      }}
                      transition={{ duration: 0.2 }}
                      animate={{
                        y: [0, -2, 0],
                      }}
                      style={{
                        animationDelay: `${i * 0.2}s`,
                      }}
                    >
                      <motion.div
                        className="w-full h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded mb-2"
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.5,
                        }}
                        style={{ backgroundSize: "200% 100%" }}
                      />
                      <div className="w-3/4 h-2 bg-white/30 rounded"></div>
                    </motion.div>
                  ))}
                </div>

                <div className="h-32 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 p-4">
                  <div className="w-1/2 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded mb-3"></div>
                  <div className="flex items-end justify-between space-x-1 sm:space-x-2 h-16">
                    {[40, 60, 30, 80, 50, 70, 45].map((height, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{
                          duration: 1,
                          delay: 1.2 + i * 0.1,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                          repeatDelay: 3,
                        }}
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "#22d3ee",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating stats */}
            <motion.div
              className="absolute top-4 lg:top-8 -right-8 lg:-right-12 p-4 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg"
              animate={{
                y: [0, -10, 0],
                boxShadow: [
                  "0 10px 30px rgba(16, 185, 129, 0.3)",
                  "0 20px 40px rgba(16, 185, 129, 0.5)",
                  "0 10px 30px rgba(16, 185, 129, 0.3)",
                ],
              }}
              transition={{
                y: { duration: 3, repeat: Number.POSITIVE_INFINITY },
                boxShadow: { duration: 2, repeat: Number.POSITIVE_INFINITY },
              }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="text-2xl font-bold"
                animate={{ color: ["#ffffff", "#f0f9ff", "#ffffff"] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                $12,580
              </motion.div>
              <div className="text-sm opacity-90">Total Balance</div>
            </motion.div>

            <motion.div
              className="absolute bottom-4 lg:bottom-8 -left-8 lg:-left-12 p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
              animate={{
                y: [0, 10, 0],
                boxShadow: [
                  "0 10px 30px rgba(168, 85, 247, 0.3)",
                  "0 20px 40px rgba(168, 85, 247, 0.5)",
                  "0 10px 30px rgba(168, 85, 247, 0.3)",
                ],
              }}
              transition={{
                y: { duration: 4, repeat: Number.POSITIVE_INFINITY },
                boxShadow: { duration: 2.5, repeat: Number.POSITIVE_INFINITY },
              }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="text-2xl font-bold"
                animate={{ color: ["#ffffff", "#fdf2f8", "#ffffff"] }}
                transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
              >
                34.8%
              </motion.div>
              <div className="text-sm opacity-90">Savings Rate</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </motion.section>
  )
}
