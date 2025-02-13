import {deleteAsync, documentDirectory} from 'expo-file-system'
import urlJoin from 'url-join'
import {type PublicKeyPemBase64} from '@vexl-next/cryptography/dist/KeyHolder'
import {hashMD5} from '@vexl-next/resources-utils/dist/utils/crypto'
import {pipe} from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import reportError from './reportError'

export const IMAGES_DIRECTORY = 'chat-images'
export const PROFILE_PICTURE_DIRECTORY = 'profilePicture'

export async function deleteAllFiles(): Promise<void> {
  if (!documentDirectory) return

  await deleteAsync(urlJoin(documentDirectory, IMAGES_DIRECTORY), {
    idempotent: true,
  })
  await deleteAsync(urlJoin(documentDirectory, PROFILE_PICTURE_DIRECTORY), {
    idempotent: true,
  })
}

export async function deleteChatFiles(
  myPublicKey: PublicKeyPemBase64,
  otherSidePublicKey: PublicKeyPemBase64
): Promise<void> {
  if (!documentDirectory) return

  const chatImagesDir = pipe(
    hashMD5(`${myPublicKey}${otherSidePublicKey}`),
    E.mapLeft((e) => {
      reportError(
        'warn',
        'Error getting MD5 of public key while deleting chat files',
        e
      )
    }),
    E.getOrElse(() => '')
  )

  if (!chatImagesDir) return

  await deleteAsync(
    urlJoin(documentDirectory, IMAGES_DIRECTORY, chatImagesDir),
    {
      idempotent: true,
    }
  )
}
