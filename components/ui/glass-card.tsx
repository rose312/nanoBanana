import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

export interface GlassCardProps extends React.ComponentProps<'div'> {
  intensity?: 'subtle' | 'medium' | 'strong'
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, intensity = 'medium', ...props }, ref) => {
    const glassClass = {
      subtle: 'glass-subtle',
      medium: 'glass',
      strong: 'glass-strong',
    }[intensity]

    return (
      <Card
        ref={ref}
        className={cn(
          glassClass,
          "shadow-xl shadow-black/5",
          "transition-all duration-300 ease-out",
          "hover:shadow-2xl hover:shadow-black/10",
          "hover:-translate-y-1",
          className
        )}
        {...props}
      />
    )
  }
)

GlassCard.displayName = "GlassCard"

export { GlassCard }
