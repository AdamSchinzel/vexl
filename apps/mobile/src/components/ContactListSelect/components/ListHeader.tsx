import {useTranslation} from '../../../utils/localization/I18nProvider'
import {Stack, Text} from 'tamagui'

function ListHeader(): JSX.Element {
  const {t} = useTranslation()

  return (
    <Stack mt="$2" mb="$4">
      <Text fos={14} ta="center" col="$greyOnWhite">
        {t('postLoginFlow.contactsList.toAddCustomContact')}
      </Text>
    </Stack>
  )
}

export default ListHeader
