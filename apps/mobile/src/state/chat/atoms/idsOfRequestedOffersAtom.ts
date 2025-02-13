import allChatsAtom from './allChatsAtom'
import {selectAtom} from 'jotai/utils'
import notEmpty from '../../../utils/notEmpty'
import {type OfferId} from '@vexl-next/domain/dist/general/offers'

const idsOfRequestedOffersAtom = selectAtom(
  allChatsAtom,
  (allChats): OfferId[] =>
    allChats
      .flat()
      .map((chat) =>
        chat.chat.origin.type === 'theirOffer' ? chat.chat.origin.offerId : null
      )
      .filter(notEmpty),
  (a, b) => b.join(',') === a.join(',')
)

export default idsOfRequestedOffersAtom
