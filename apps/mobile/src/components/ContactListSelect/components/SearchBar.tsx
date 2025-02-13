import magnifyingGlass from '../../images/magnifyingGlass'
import Button from '../../Button'
import TextInput from '../../Input'
import {useTranslation} from '../../../utils/localization/I18nProvider'
import {Stack, XStack} from 'tamagui'
import {useMolecule} from 'jotai-molecules'
import {contactSelectMolecule} from '../atom'
import {useAtom} from 'jotai'

function SearchBar(): JSX.Element {
  const {t} = useTranslation()

  const {selectAllAtom, searchTextAtom} = useMolecule(contactSelectMolecule)
  const [searchText, setSearchText] = useAtom(searchTextAtom)
  const [allSelected, setAllSelected] = useAtom(selectAllAtom)

  return (
    <XStack mt="$4">
      <Stack f={5} pr="$2">
        <TextInput
          placeholder={t('postLoginFlow.contactsList.inputPlaceholder')}
          value={searchText}
          onChangeText={setSearchText}
          icon={magnifyingGlass}
          size={'small'}
        />
      </Stack>
      <Stack f={3}>
        <Button
          onPress={() => {
            setAllSelected((prev) => !prev)
          }}
          disabled={false}
          variant="black"
          size={'small'}
          adjustTextToFitOneLine
          fullSize
          text={t(allSelected ? 'common.deselectAll' : 'common.selectAll')}
        />
      </Stack>
    </XStack>
  )
}

export default SearchBar
