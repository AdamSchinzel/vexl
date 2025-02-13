import Animated, {
  type BaseAnimationBuilder,
  type EntryExitAnimationFunction,
  type Keyframe,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated'
import {type ReactNode} from 'react'
import {Stack} from 'tamagui'
import {StyleSheet} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

interface Props {
  topMargin: number
  shown?: boolean
  children: ReactNode
  entering?:
             | BaseAnimationBuilder
    | typeof BaseAnimationBuilder
    | EntryExitAnimationFunction
    | Keyframe
  exiting?:
            | BaseAnimationBuilder
    | typeof BaseAnimationBuilder
    | EntryExitAnimationFunction
    | Keyframe
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
  },
})

function AnimatedModal({
  topMargin,
  children,
  exiting,
  entering,
  shown,
}: Props): JSX.Element | null {
  const {bottom: bottomInset} = useSafeAreaInsets()

  if (shown === false) return null
  return (
    <Animated.View
      entering={entering ?? SlideInDown}
      exiting={exiting ?? SlideOutDown}
      style={[styles.root, {top: topMargin}]}
    >
      <Stack pb={bottomInset} f={1}>
        {children}
      </Stack>
    </Animated.View>
  )
}

export default AnimatedModal
