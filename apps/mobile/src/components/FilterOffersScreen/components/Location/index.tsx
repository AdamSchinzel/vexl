import useContent from './useContent'
import Tabs from '../../../Tabs'
import {useState} from 'react'
import {getTokens, Stack, Text, XStack, YStack} from 'tamagui'
import SvgImage from '../../../Image'
import {useTranslation} from '../../../../utils/localization/I18nProvider'
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import closeSvg from '../../../images/closeSvg'
import magnifyingGlass from '../../../images/magnifyingGlass'
import {
  type PrimitiveAtom,
  useAtom,
  useAtomValue,
  useSetAtom,
  type WritableAtom,
} from 'jotai'
import {
  type Location,
  type LocationState,
} from '@vexl-next/domain/dist/general/offers'
import LocationSearch from '../LocationSearch'

interface Props {
  locationAtom: PrimitiveAtom<Location[] | undefined>
  locationStateAtom: PrimitiveAtom<LocationState | undefined>
  updateLocationStatePaymentMethodAtom: WritableAtom<
    null,
    [
      {
        locationState: LocationState
      }
    ],
    boolean
  >
}

function LocationComponent({
  locationAtom,
  locationStateAtom,
  updateLocationStatePaymentMethodAtom,
}: Props): JSX.Element {
  const {t} = useTranslation()
  const tokens = getTokens()
  const content = useContent()

  const [location, setLocation] = useAtom(locationAtom)
  const locationState = useAtomValue(locationStateAtom)
  const updateLocationStatePaymentMethod = useSetAtom(
    updateLocationStatePaymentMethodAtom
  )
  const [locationSearchVisible, setLocationSearchVisible] =
    useState<boolean>(false)

  const onLocationStateChange = (locationState: LocationState): void => {
    updateLocationStatePaymentMethod({locationState})
  }

  const onLocationRemove = (city: string): void => {
    const filteredLocation = location?.filter((loc) => loc.city !== city)
    if (filteredLocation) setLocation(filteredLocation)
  }

  return (
    <YStack space="$2">
      <Tabs
        activeTab={locationState}
        onTabPress={onLocationStateChange}
        tabs={content}
      />
      {locationState === 'IN_PERSON' && (
        <YStack space="$2">
          {(!location || (location && location.length < 1)) && (
            <TouchableWithoutFeedback
              onPress={() => {
                setLocationSearchVisible(true)
              }}
            >
              <XStack ai="center" p="$5" bc="$grey" br="$5">
                <Stack h={24} w={24}>
                  <SvgImage
                    stroke={tokens.color.white.val}
                    source={magnifyingGlass}
                  />
                </Stack>
                <Text ml="$4" ff="$body600" fos={18} col="$greyOnBlack">
                  {t('offerForm.location.addCityOrDistrict')}
                </Text>
              </XStack>
            </TouchableWithoutFeedback>
          )}
          {location?.map((loc) => (
            <XStack
              key={loc.latitude}
              br="$5"
              bc="$darkBrown"
              p="$4"
              ai="center"
              jc="space-between"
            >
              <Text fos={18} color="$main">
                {loc.city}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  onLocationRemove(loc.city)
                }}
              >
                <SvgImage stroke={tokens.color.main.val} source={closeSvg} />
              </TouchableOpacity>
            </XStack>
          ))}
        </YStack>
      )}
      {locationSearchVisible && (
        <LocationSearch
          locationAtom={locationAtom}
          onClosePress={() => {
            setLocationSearchVisible(false)
          }}
          visible={locationSearchVisible}
        />
      )}
    </YStack>
  )
}

export default LocationComponent
