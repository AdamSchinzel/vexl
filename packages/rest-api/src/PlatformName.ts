import {z} from 'zod'

export const PlatformName = z
  .enum(['CLI', 'ANDROID', 'IOS'])
  .brand<'PlatformName'>()

export type PlatformName = z.TypeOf<typeof PlatformName>
