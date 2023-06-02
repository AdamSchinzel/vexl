import {type OneOfferInState} from '../../../state/marketplace/domain'
import {getTokens, Stack, YStack} from 'tamagui'
import OfferWithBubbleTip from '../../OfferWithBubbleTip'
import ScreenTitle from '../../ScreenTitle'
import useSafeGoBack from '../../../utils/useSafeGoBack'
import {useTranslation} from '../../../utils/localization/I18nProvider'
import {ScrollView} from 'react-native'
import TextInput from '../../Input'
import Button from '../../Button'
import IconButton from '../../IconButton'
import flagSvg from '../images/flagSvg'
import {useReportOfferHandleUI, useSubmitRequestHandleUI} from '../api'
import React, {useMemo, useState} from 'react'
import {useChatForOffer} from '../../../state/chat/hooks/useChatForOffer'
import {useNavigation} from '@react-navigation/native'
import InfoSquare from '../../InfoSquare'
import closeSvg from '../../images/closeSvg'
import identityIconSvg from '../../images/identityIconSvg'
import CommonFriends from '../../CommonFriends'
import {atom, useAtomValue} from 'jotai'
import createChatStatusAtom from '../../../state/chat/atoms/createChatStatusAtom'

function OfferInfo({offer}: {offer: OneOfferInState}): JSX.Element {
  const goBack = useSafeGoBack()
  const navigation = useNavigation()
  const {t} = useTranslation()
  const reportOffer = useReportOfferHandleUI()
  const submitRequest = useSubmitRequestHandleUI()
  const [text, setText] = useState('')
  const chatForOffer = useChatForOffer({
    offerPublicKey: offer.offerInfo.publicPart.offerPublicKey,
  })
  const requestStatus = useAtomValue(
    useMemo(() => {
      if (!chatForOffer) return atom(() => null)
      return createChatStatusAtom(
        chatForOffer.id,
        chatForOffer.inbox.privateKey.publicKeyPemBase64
      )
    }, [chatForOffer])
  )

  return (
    <Stack f={1} mx={'$2'} my={'$4'}>
      <ScreenTitle text={t('offer.title')}>
        <IconButton
          variant={'dark'}
          icon={flagSvg}
          onPress={() => {
            void reportOffer(offer.offerInfo.offerId)()
          }}
        />
        <IconButton variant="dark" icon={closeSvg} onPress={goBack} />
      </ScreenTitle>
      <ScrollView>
        <YStack space={'$4'}>
          <OfferWithBubbleTip negative={!!chatForOffer} offer={offer} />
          <CommonFriends
            variant={'dark'}
            contactsHashes={offer.offerInfo.privatePart.commonFriends}
          />
          {!chatForOffer ? (
            <TextInput
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={5}
              variant={'greyOnBlack'}
              placeholder={t('offer.inputPlaceholder')}
              placeholderTextColor={getTokens().color.greyOnBlack.val}
            />
          ) : (
            <InfoSquare>
              {t(`offer.requestStatus.${requestStatus ?? 'requested'}`)}
            </InfoSquare>
          )}
        </YStack>
      </ScrollView>
      {chatForOffer ? (
        <Button
          onPress={() => {
            if (!chatForOffer) return
            navigation.navigate('ChatDetail', {
              chatId: chatForOffer.id,
              inboxKey: chatForOffer.inbox.privateKey.publicKeyPemBase64,
            })
          }}
          variant={'primary'}
          text={t('offer.goToChat')}
        />
      ) : (
        <Button
          disabled={!text.trim()}
          onPress={() => {
            if (!text.trim()) return
            void submitRequest(text, offer.offerInfo)()
          }}
          variant={'secondary'}
          beforeIcon={identityIconSvg}
          text={t('offer.sendRequest')}
        />
      )}
    </Stack>
  )
}

export default OfferInfo
