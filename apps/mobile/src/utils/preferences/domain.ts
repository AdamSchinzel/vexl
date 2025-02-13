import {z} from 'zod'

const NotificationPreferences = z.object({
  offer: z.boolean(),
  chat: z.boolean(),
  marketplace: z.boolean(),
  newOfferInMarketplace: z.boolean(),
  newPhoneContacts: z.boolean(),
  inactivityWarnings: z.boolean(),
  marketing: z.boolean(),
})

export const Preferences = z.object({
  showDebugNotifications: z.boolean().default(false),
  disableOfferRerequestLimit: z.boolean().default(false),
  allowSendingImages: z.boolean().default(false),
  notificationPreferences: NotificationPreferences,
})

export type Preferences = z.infer<typeof Preferences>
