import {atom} from 'jotai'
import {
  generateChatId,
  type Inbox,
} from '@vexl-next/domain/dist/general/messaging'
import {
  type ChatMessageWithState,
  type ChatWithMessages,
  type MessagingState,
} from '../domain'
import {type OfferInfo} from '@vexl-next/domain/dist/general/offers'
import focusChatForTheirOfferAtom from './focusChatForTheirOfferAtom'
import messagingStateAtom from './messagingStateAtom'
import * as O from 'optics-ts'
import {type PublicKeyPemBase64} from '@vexl-next/cryptography/dist/KeyHolder'

function createNewChat({
  inbox,
  initialMessage,
  offerInfo,
}: {
  inbox: Inbox
  initialMessage: ChatMessageWithState
  offerInfo: OfferInfo
}): ChatWithMessages {
  return {
    chat: {
      id: generateChatId(),
      inbox,
      origin: {type: 'theirOffer', offerId: offerInfo.offerId},
      otherSide: {
        publicKey: offerInfo.publicPart.offerPublicKey,
      },
      isUnread: false,
    },
    messages: [initialMessage],
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function focusPrependChatToInbox(publicKey: PublicKeyPemBase64) {
  return O.optic<MessagingState>()
    .find((o) => o.inbox.privateKey.publicKeyPemBase64 === publicKey)
    .prop('chats')
    .prependTo()
}

const upsertChatForTheirOfferActionAtom = atom(
  null,
  (
    get,
    set,
    {
      inbox,
      initialMessage,
      offerInfo,
    }: {
      inbox: Inbox
      initialMessage: ChatMessageWithState
      offerInfo: OfferInfo
    }
  ) => {
    const existingChatAtom = focusChatForTheirOfferAtom({inbox, offerInfo})
    const existingChat = get(existingChatAtom)
    if (existingChat) {
      set(existingChatAtom, (prev) => ({
        ...prev,
        messages: [...prev.messages, initialMessage],
      }))
      return existingChat.chat
    } else {
      const newChat = createNewChat({inbox, initialMessage, offerInfo})
      set(messagingStateAtom, (old) =>
        O.set(
          focusPrependChatToInbox(
            newChat.chat.inbox.privateKey.publicKeyPemBase64
          )
        )(newChat)(old)
      )
      return newChat.chat
    }
  }
)

export default upsertChatForTheirOfferActionAtom
