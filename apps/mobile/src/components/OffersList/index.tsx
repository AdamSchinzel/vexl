import OffersListItem from './OffersListItem'
import {type FlatList} from 'react-native'
import {type OneOfferInState} from '../../state/marketplace/domain'
import {getTokens} from 'tamagui'
import React, {type ComponentProps, useMemo} from 'react'
import usePixelsFromBottomWhereTabsEnd from '../InsideRouter/utils'
import {FlashList} from '@shopify/flash-list'
import {type Atom} from 'jotai'
import atomKeyExtractor from '../../utils/atomUtils/atomKeyExtractor'

export interface Props {
  readonly offersAtoms: Array<Atom<OneOfferInState>>
  onRefresh?: () => void
  refreshing?: boolean
  ListHeaderComponent?: ComponentProps<typeof FlatList>['ListHeaderComponent']
}

function renderItem({item}: {item: Atom<OneOfferInState>}): JSX.Element {
  return <OffersListItem offerAtom={item} />
}

function OffersList({
  onRefresh,
  refreshing,
  offersAtoms,
  ListHeaderComponent,
}: Props): JSX.Element {
  const bottomOffset = usePixelsFromBottomWhereTabsEnd()

  const contentContainerStyle = useMemo(
    () => ({
      paddingHorizontal: getTokens().space[2].val,
      paddingBottom: bottomOffset + Number(getTokens().space[5].val),
    }),
    [bottomOffset]
  )

  return (
    <FlashList
      ListHeaderComponent={ListHeaderComponent}
      estimatedItemSize={151}
      contentContainerStyle={contentContainerStyle}
      data={offersAtoms}
      onRefresh={onRefresh}
      refreshing={refreshing}
      renderItem={renderItem}
      keyExtractor={atomKeyExtractor}
    />
  )
}

export default OffersList
