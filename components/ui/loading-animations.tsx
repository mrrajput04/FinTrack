"use client"

import { motion } from "framer-motion"
import { Loader2Icon, WalletIcon } from "lucide-react"

export function SpinnerLoader({
  size = "default",
  className = "",
}: { size?: "sm" | "default" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <Loader2Icon className="h-full w-full text-primary" />
    </motion.div>
  )
}

export function PulseLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-primary rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}

export function WaveLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-end space-x-1 ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-2 bg-gradient-to-t from-primary to-primary/50 rounded-t"
          animate={{
            height: ["8px", "24px", "8px"],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export function SkeletonLoader({
  className = "",
  width = "w-full",
  height = "h-4",
}: {
  className?: string
  width?: string
  height?: string
}) {
  return (
    <motion.div
      className={`${width} ${height} bg-gradient-to-r from-muted via-muted/50 to-muted rounded ${className}`}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
      style={{
        backgroundSize: "200% 100%",
      }}
    />
  )
}

export function FloatingLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary/50 flex items-center justify-center"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <WalletIcon className="h-6 w-6 text-white" />
      </motion.div>
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <FloatingLoader />
        <motion.p
          className="text-lg font-medium text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          Loading FinTrack...
        </motion.p>
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonLoader width="w-32" height="h-4" />
        <SkeletonLoader width="w-8" height="h-8" className="rounded-full" />
      </div>
      <SkeletonLoader width="w-24" height="h-8" />
      <SkeletonLoader width="w-16" height="h-3" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <SkeletonLoader width="w-10" height="h-10" className="rounded-full" />
          <div className="flex-1 space-y-2">
            <SkeletonLoader width="w-3/4" height="h-4" />
            <SkeletonLoader width="w-1/2" height="h-3" />
          </div>
          <SkeletonLoader width="w-20" height="h-4" />
        </div>
      ))}
    </div>
  )
}
