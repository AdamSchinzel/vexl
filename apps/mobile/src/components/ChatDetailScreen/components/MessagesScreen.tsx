import ChatHeader from './ChatHeader'
import {useAtom, useAtomValue} from 'jotai'
import {useMolecule} from 'jotai-molecules'
import {chatMolecule} from '../atoms'
import ChatTextInput from './ChatTextInput'
import {Stack} from 'tamagui'
import MessagesList from './MessagesList'
import QuickActionBanner from './QuickActionBanner'
import ImageZoomOverlay from './ImageZoomOverlay'

function MessagesScreen(): JSX.Element {
  const {showModalAtom, canSendMessagesAtom, identityRevealStatusAtom} =
    useMolecule(chatMolecule)
  const [showModal, setShowModal] = useAtom(showModalAtom)
  const canSendMessages = useAtomValue(canSendMessagesAtom)
  const identityRevealStatus = useAtomValue(identityRevealStatusAtom)

  return (
    <>
      <ChatHeader
        mode={showModal ? 'photoTop' : 'photoLeft'}
        leftButton={showModal ? 'closeModal' : 'back'}
        rightButton={
          showModal
            ? 'block'
            : !canSendMessages
            ? null
            : identityRevealStatus === 'shared'
            ? 'contactReveal'
            : 'identityReveal'
        }
        onPressMiddle={() => {
          setShowModal((v) => !v)
        }}
      />
      <Stack f={1}>
        <MessagesList />
      </Stack>
      <Stack mb={'$3'}>
        <QuickActionBanner />
      </Stack>
      {canSendMessages && (
        <Stack mx={'$4'} mb={'$2'}>
          <ChatTextInput />
        </Stack>
      )}
      <ImageZoomOverlay />
    </>
  )
}

export default MessagesScreen
