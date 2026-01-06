/**
 * Super VIP Configuration
 * 
 * Users in this list automatically receive the highest tier (Plus) access
 * without requiring a subscription.
 */

export const SUPER_VIP_EMAILS = [
  "irosebelief@gmail.com1",
  // Add more super VIP emails here 
]

/**
 * Check if a user email is a Super VIP
 */
export function isSuperVIP(email: string | null | undefined): boolean {
  if (!email) return false
  return SUPER_VIP_EMAILS.includes(email.toLowerCase())
}
