import {type ConnectionsInfoForOffer} from './fetchContactsForOffer'
import * as E from 'fp-ts/Either'
import {keys} from '../../utils/keys'
import {
  OfferPrivatePart,
  type SymmetricKey,
} from '@vexl-next/domain/dist/general/offers'
import {PublicKeyPemBase64} from '@vexl-next/cryptography/dist/KeyHolder'
import {z} from 'zod'
import {type BasicError, toError} from '@vexl-next/domain/dist/utility/errors'

export type ErrorConstructingPrivatePayloads =
  BasicError<'ErrorConstructingPrivatePayloads'>

export const OfferPrivatePayloadToEncrypt = z.object({
  toPublicKey: PublicKeyPemBase64,
  payloadPrivate: OfferPrivatePart,
})
export type OfferPrivatePayloadToEncrypt = z.TypeOf<
  typeof OfferPrivatePayloadToEncrypt
>

// TODO test this function
export default function constructPrivatePayloads({
  connectionsInfo: {
    firstDegreeConnections,
    secondDegreeConnections,
    commonFriends,
  },
  symmetricKey,
}: {
  connectionsInfo: ConnectionsInfoForOffer
  symmetricKey: SymmetricKey
}): E.Either<ErrorConstructingPrivatePayloads, OfferPrivatePayloadToEncrypt[]> {
  return E.tryCatch(() => {
    // First we need to find out friend levels for each connection.
    // We can do that by iterating over firstDegreeFriends and secondDegreeFriends
    const friendLevel: Record<
      PublicKeyPemBase64,
      Set<'FIRST_DEGREE' | 'SECOND_DEGREE'>
    > = {}
    for (const firstDegreeFriendPublicKey of firstDegreeConnections) {
      friendLevel[firstDegreeFriendPublicKey] = new Set(['FIRST_DEGREE'])
    }

    // There are duplicities. That is why all these shinanigans with Set
    for (const secondDegreeFriendPublicKey of secondDegreeConnections) {
      if (!friendLevel[secondDegreeFriendPublicKey])
        friendLevel[secondDegreeFriendPublicKey] = new Set(['SECOND_DEGREE'])
      else friendLevel[secondDegreeFriendPublicKey].add('SECOND_DEGREE')
    }

    return keys(friendLevel).map((key) => ({
      toPublicKey: key,
      payloadPrivate: {
        commonFriends:
          commonFriends.commonContacts.find((one) => one.publicKey === key)
            ?.common?.hashes ?? [],
        friendLevel: friendLevel[key] ? Array.from(friendLevel[key]) : [],
        symmetricKey,
      },
    }))
  }, toError('ErrorConstructingPrivatePayloads', 'Failed to construct private parts'))
}
