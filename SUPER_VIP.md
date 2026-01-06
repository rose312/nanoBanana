# Super VIP Configuration

## Overview

The Super VIP system allows specific users to automatically receive the highest tier (Plus) access without requiring a paid subscription.

## How It Works

1. **Email Whitelist**: Super VIP users are identified by their email addresses
2. **Automatic Access**: When a Super VIP user signs in, they automatically receive:
   - Plus tier access (highest tier)
   - Access to all AI models (nano_banana, nano_banana_pro, nano_banana_plus)
   - No subscription required
   - No billing checks

## Configuration

Super VIP emails are managed in `lib/super-vip.ts`:

```typescript
export const SUPER_VIP_EMAILS = [
  "irosebelief@gmail.com",
  // Add more super VIP emails here
]
```

## Current Super VIP Users

- `irosebelief@gmail.com` - Owner/Admin

## Adding New Super VIP Users

1. Open `lib/super-vip.ts`
2. Add the email address to the `SUPER_VIP_EMAILS` array
3. Save the file
4. The changes take effect immediately (no restart required)

## Implementation Details

### Files Modified

1. **`lib/super-vip.ts`** - Central configuration file
   - Contains the whitelist of Super VIP emails
   - Provides `isSuperVIP()` helper function

2. **`app/api/billing/status/route.ts`** - Billing status API
   - Checks if user is Super VIP before checking subscriptions
   - Returns Plus tier for Super VIP users

3. **`app/api/vision/route.ts`** - Image generation API
   - Checks if user is Super VIP before checking subscriptions
   - Grants access to all models for Super VIP users

### API Response for Super VIP

When a Super VIP user checks their billing status, they receive:

```json
{
  "authed": true,
  "entitled": true,
  "planKey": "plus_yearly",
  "tier": "plus",
  "superVIP": true
}
```

## Security Considerations

- Email addresses are case-insensitive (automatically converted to lowercase)
- Super VIP status is checked on every API request
- No database modifications required
- Changes to the whitelist take effect immediately

## Testing

To test Super VIP functionality:

1. Sign in with a Super VIP email address
2. Navigate to the Generator page
3. Verify that:
   - Access shows as "Active"
   - All AI models are available in the dropdown
   - Image generation works without subscription

## Removing Super VIP Access

To remove Super VIP access from a user:

1. Open `lib/super-vip.ts`
2. Remove their email from the `SUPER_VIP_EMAILS` array
3. Save the file
4. The user will need a regular subscription on their next request

---

**Last Updated**: 2026-01-04
**Maintainer**: Development Team
