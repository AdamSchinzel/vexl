import ScreenTitle from '../ScreenTitle'
import React from 'react'
import {useTranslation} from '../../utils/localization/I18nProvider'
import {Stack} from 'tamagui'
import {type CurrencyCode} from '@vexl-next/domain/dist/general/currency.brand'
import IconButton from '../IconButton'
import closeSvg from '../images/closeSvg'
import {type Atom, type WritableAtom, useAtomValue} from 'jotai'
import {Modal} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import SearchBar from './components/SearchBar'
import {currenciesToDisplayAtomsAtom} from './atom'
import CurrenciesList from './components/CurrenciesList'
import NothingFound from './components/NothingFound'

interface Props {
  selectedCurrencyCodeAtom: Atom<CurrencyCode | undefined>
  onClose: () => void
  updateCurrencyLimitsAtom: WritableAtom<
    null,
    [
      {
        currency: CurrencyCode
      }
    ],
    boolean
  >
  visible: boolean
}

function CurrencySelect({
  selectedCurrencyCodeAtom,
  onClose,
  updateCurrencyLimitsAtom,
  visible,
}: Props): JSX.Element {
  const {t} = useTranslation()
  const toDisplay = useAtomValue(currenciesToDisplayAtomsAtom)
  const {bottom, top} = useSafeAreaInsets()

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <Stack f={1} bc={'$grey'} px={'$4'} pb={bottom} pt={top}>
        <Stack pb={'$2'}>
          <ScreenTitle
            text={t('offerForm.selectCurrency')}
            textColor={'$greyAccent5'}
          >
            <IconButton variant={'dark'} icon={closeSvg} onPress={onClose} />
          </ScreenTitle>
          <SearchBar />
        </Stack>
        {toDisplay.length > 0 && (
          <CurrenciesList
            currencies={toDisplay}
            selectedCurrencyCodeAtom={selectedCurrencyCodeAtom}
            onItemPress={onClose}
            updateCurrencyLimitsAtom={updateCurrencyLimitsAtom}
          />
        )}
        {toDisplay.length === 0 && <NothingFound />}
      </Stack>
    </Modal>
  )
}

export default CurrencySelect
