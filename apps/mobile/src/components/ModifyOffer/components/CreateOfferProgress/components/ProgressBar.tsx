import {getTokens, XStack} from 'tamagui'
import {useEffect, useState} from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface Props {
  percentDone: number
}

function ProgressBar({percentDone}: Props): JSX.Element {
  const tokens = getTokens()
  const [progressContainerWidth, setProgressContainerWidth] =
    useState<number>(0)
  const progress = useSharedValue(percentDone)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      backgroundColor: tokens.color.black.val,
      width: progress.value * (progressContainerWidth / 100),
    }
  })

  useEffect(() => {
    progress.value = withTiming(percentDone)
  }, [percentDone, progress])

  return (
    <XStack
      pos={'relative'}
      w={'100%'}
      h={4}
      br={'$11'}
      bc={'$greyAccent3'}
      onLayout={(e) => {
        setProgressContainerWidth(e.nativeEvent.layout.width)
      }}
    >
      <Animated.View style={animatedStyle} />
    </XStack>
  )
}

export default ProgressBar
