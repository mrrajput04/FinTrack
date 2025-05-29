"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { StarIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    content:
      "FinTrack has completely transformed how I manage both my personal and business finances. The visual reports make it easy to see where my money is going and identify areas to cut costs.",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    content:
      "As someone who loves data, I appreciate how FinTrack presents my financial information in clean, interactive charts. Setting up automatic transaction imports saved me hours of manual entry.",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Freelance Designer",
    content:
      "The budgeting tools in FinTrack helped me finally get my irregular freelance income under control. I can now confidently plan for taxes and save for the future.",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4,
  },
  {
    name: "David Wilson",
    role: "Recent Graduate",
    content:
      "Starting my financial journey was intimidating until I found FinTrack. The goal-setting feature helped me create a plan to pay off my student loans 3 years ahead of schedule!",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    role: "Marketing Director",
    content:
      "I've tried many financial apps, but FinTrack stands out with its intuitive interface and comprehensive features. The custom reports help me present our family finances to my husband clearly.",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
  },
  {
    name: "James Parker",
    role: "Retired Teacher",
    content:
      "Even at my age, I found FinTrack easy to use. It's helped me manage my retirement accounts and track my fixed income to ensure I'm living comfortably within my means.",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4,
  },
]

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <section id="testimonials" className="py-20 bg-muted/30">
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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Loved by thousands of users</h2>
          <p className="text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our users have to say about how FinTrack has helped them take
            control of their finances.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              animate={controls}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{testimonial.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
