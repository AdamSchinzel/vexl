import {PrivateKey} from '../crypto/KeyHolder'

export const HEADER_PUBLIC_KEY = 'public-key'
export const HEADER_HASH = 'hash'
export const HEADER_SIGNATURE = 'signature'
export const HEADER_CRYPTO_VERSION = 'crypto-version'
export const HEADER_PLATFORM = 'X-Platform'

export interface SecurityData {
  privateKey: PrivateKey
  hash: string
  signature: string
}
