import {useTranslation} from '../../utils/localization/I18nProvider'
import Button from '../Button'
import {useNavigation} from '@react-navigation/native'
import {type OneOfferInState} from '../../state/marketplace/domain'
import {Stack} from 'tamagui'
import OfferWithBubbleTip from '../OfferWithBubbleTip'
import {useCallback, useMemo} from 'react'
import {type Atom, useAtomValue} from 'jotai'
import {useChatWithMessagesForOffer} from '../../state/chat/hooks/useChatForOffer'
import {
  canChatBeRequested,
  getRequestState,
} from '../../state/chat/utils/offerStates'
import {offerRerequestLimitDaysAtom} from '../../utils/remoteConfig/atoms'

interface Props {
  readonly offerAtom: Atom<OneOfferInState>
}

function OffersListItem({offerAtom}: Props): JSX.Element {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const offer = useAtomValue(offerAtom)
  const rerequestLimitDays = useAtomValue(offerRerequestLimitDaysAtom)

  const isMine = useMemo(
    () => !!offer.ownershipInfo?.adminId,
    [offer.ownershipInfo?.adminId]
  )

  // TODO make this more performant
  const chatForOffer = useChatWithMessagesForOffer({
    offerPublicKey: offer.offerInfo.publicPart.offerPublicKey,
  })

  const canBeRequested = useMemo(() => {
    if (!chatForOffer) return true
    return canChatBeRequested(chatForOffer, rerequestLimitDays).canBeRerequested
  }, [chatForOffer, rerequestLimitDays])

  const navigateToOffer = useCallback(() => {
    navigation.navigate(isMine ? 'EditOffer' : 'OfferDetail', {
      offerId: offer.offerInfo.offerId,
    })
  }, [isMine, navigation, offer.offerInfo.offerId])

  const navigateToChat = useCallback(() => {
    if (!chatForOffer?.chat) return

    navigation.navigate('ChatDetail', {
      chatId: chatForOffer.chat.id,
      inboxKey: chatForOffer.chat.inbox.privateKey.publicKeyPemBase64,
    })
  }, [chatForOffer, navigation])

  const content = useMemo((): {
    buttonText: string
    actionableUI: boolean
    onPress: () => void
  } => {
    if (isMine) {
      return {
        buttonText: t('myOffers.editOffer'),
        actionableUI: true,
        onPress: navigateToOffer,
      }
    }

    const state = getRequestState(chatForOffer)
    if (state === 'initial') {
      return {
        buttonText: t('common.request'),
        actionableUI: true,
        onPress: navigateToOffer,
      }
    }

    if (state === 'requested') {
      if (canBeRequested) {
        return {
          buttonText: t('common.requestAgain'),
          actionableUI: true,
          onPress: navigateToChat,
        }
      } else {
        return {
          buttonText: t('common.seeDetail'),
          actionableUI: false,
          onPress: navigateToChat,
        }
      }
    }

    if (state === 'cancelled') {
      if (canBeRequested) {
        return {
          actionableUI: true,
          buttonText: t('common.requestAgain'),
          onPress: navigateToOffer,
        }
      } else {
        return {
          actionableUI: false,
          buttonText: t('common.seeDetail'),
          onPress: navigateToOffer,
        }
      }
    }

    if (state === 'accepted') {
      return {
        buttonText: t('offer.goToChat'),
        actionableUI: false,
        onPress: navigateToChat,
      }
    }

    if (state === 'denied') {
      if (canBeRequested) {
        return {
          actionableUI: true,
          buttonText: t('common.requestAgain'),
          onPress: navigateToChat,
        }
      } else {
        return {
          actionableUI: false,
          buttonText: t('common.seeDetail'),
          onPress: navigateToChat,
        }
      }
    }

    if (state === 'deleted') {
      if (canBeRequested) {
        return {
          actionableUI: true,
          buttonText: t('common.requestAgain'),
          onPress: navigateToOffer,
        }
      } else {
        return {
          actionableUI: false,
          buttonText: t('common.seeDetail'),
          onPress: navigateToOffer,
        }
      }
    }

    if (state === 'otherSideLeft') {
      return {
        actionableUI: false,
        buttonText: t('offer.goToChat'),
        onPress: navigateToChat,
      }
    }

    return {
      buttonText: t('common.request'),
      actionableUI: true,
      onPress: navigateToOffer,
    }
  }, [canBeRequested, chatForOffer, isMine, navigateToChat, navigateToOffer, t])

  return (
    <Stack mt={'$6'}>
      <OfferWithBubbleTip
        onInfoRectPress={content.onPress}
        negative={!content.actionableUI}
        button={
          <Button
            size={'medium'}
            text={content.buttonText}
            variant={content.actionableUI ? 'secondary' : 'primary'}
            onPress={content.onPress}
          />
        }
        offer={offer}
      />
    </Stack>
  )
}

export default OffersListItem
