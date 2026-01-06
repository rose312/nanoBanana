"use client"

import { CreemPortal } from "@creem_io/nextjs"
import { Button } from "@/components/ui/button"

export function ManageSubscriptionButton({ customerId }: { customerId: string }) {
  return (
    <CreemPortal customerId={customerId}>
      <Button variant="outline" size="sm">
        Manage subscription
      </Button>
    </CreemPortal>
  )
}

