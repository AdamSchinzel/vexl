import * as FileSystem from 'expo-file-system'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import {
  type BasicError,
  toBasicError,
} from '@vexl-next/domain/dist/utility/errors'
import {type ChatMessage} from '@vexl-next/domain/dist/general/messaging'
import {pipe} from 'fp-ts/function'
import {UriString} from '@vexl-next/domain/dist/utility/UriString.brand'
import ImageResizer from '@bam.tech/react-native-image-resizer'
import joinUrl from 'url-join'
import {Platform} from 'react-native'
import reportError from '../../../utils/reportError'
import resolveLocalUri from '../../../utils/resolveLocalUri'

export type ReadingFileError = BasicError<'ReadingFileError'>

function readAsBase64({
  path,
  imageWidthOrHeightLimit,
}: {
  imageWidthOrHeightLimit: number
  path: UriString
}): TE.TaskEither<ReadingFileError, UriString> {
  return TE.tryCatch(async () => {
    const cacheDir = FileSystem.cacheDirectory
    if (!cacheDir) throw new Error('No cacheDir')

    const fromPath = (() => {
      if (Platform.OS === 'ios') return resolveLocalUri(path)
      else return path.replace('file://', '')
    })()

    const toPath = (() => {
      if (Platform.OS === 'ios') return joinUrl(cacheDir)
      else return joinUrl(cacheDir).replace('file://', '')
    })()

    const resizeResponse = await ImageResizer.createResizedImage(
      fromPath,
      imageWidthOrHeightLimit,
      imageWidthOrHeightLimit,
      'JPEG',
      85,
      0,
      toPath,
      false,
      {
        onlyScaleDown: true,
        mode: 'contain',
      }
    )

    const bytes = await FileSystem.readAsStringAsync(
      `file://${resizeResponse.path}`,
      {
        encoding: FileSystem.EncodingType.Base64,
      }
    )

    return UriString.parse(`data:image/jpeg;base64,${bytes}`)
  }, toBasicError('ReadingFileError'))
}

function setImage(
  source: ChatMessage
): (args: {
  image: UriString | undefined
  replyToImage: UriString | undefined
}) => ChatMessage {
  return ({image, replyToImage}) => ({
    ...source,
    image,
    repliedTo: source.repliedTo
      ? {
          ...source.repliedTo,
          image: replyToImage,
        }
      : undefined,
  })
}

export default function replaceImageFileUrisWithBase64(
  message: ChatMessage
): T.Task<ChatMessage> {
  const image = message.image
  const replyImage = message.repliedTo?.image

  return pipe(
    T.Do,
    T.bind('image', () => {
      if (!image) return T.of(undefined)

      return pipe(
        readAsBase64({path: image, imageWidthOrHeightLimit: 512}),
        TE.match(
          (e) => {
            reportError(
              'error',
              'Error while reading image as file as base64',
              e
            )
            return undefined
          },
          (v) => v
        )
      )
    }),
    T.bind('replyToImage', () => {
      if (!replyImage) return T.of(undefined)

      return pipe(
        readAsBase64({path: replyImage, imageWidthOrHeightLimit: 256}),
        TE.match(
          (e) => {
            reportError(
              'error',
              'Error while reading replyToImage as file as base64',
              e
            )
            return undefined
          },
          (v) => v
        )
      )
    }),
    T.map(setImage(message))
  )
}
