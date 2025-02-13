import {type OneOfferInState} from '../domain'
import {type Sort} from '@vexl-next/domain/dist/general/offers'

export default function sortOffers(
  offers: OneOfferInState[],
  sort: Sort
): OneOfferInState[] {
  const toReturn = [...offers]

  toReturn.sort((a, b) => {
    if (sort === 'LOWEST_FEE_FIRST')
      return a.offerInfo.publicPart.feeAmount - b.offerInfo.publicPart.feeAmount
    if (sort === 'HIGHEST_FEE')
      return b.offerInfo.publicPart.feeAmount - a.offerInfo.publicPart.feeAmount
    if (sort === 'NEWEST_OFFER') return b.offerInfo.id - a.offerInfo.id
    if (sort === 'OLDEST_OFFER') return a.offerInfo.id - b.offerInfo.id
    if (sort === 'LOWEST_AMOUNT')
      return (
        a.offerInfo.publicPart.amountTopLimit -
        b.offerInfo.publicPart.amountTopLimit
      )
    if (sort === 'HIGHEST_AMOUNT')
      return (
        b.offerInfo.publicPart.amountTopLimit -
        a.offerInfo.publicPart.amountTopLimit
      )
    // default ordering: NEWEST_OFFER
    return b.offerInfo.id - a.offerInfo.id
  })
  return toReturn // fallback. Let's return original array in case of invalid sort
}
