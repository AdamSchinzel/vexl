import {parsePhoneNumber} from 'awesome-phonenumber'
import {CountryPrefix} from '@vexl-next/domain/dist/general/CountryPrefix.brand'
import {type E164PhoneNumber} from '@vexl-next/domain/dist/general/E164PhoneNumber.brand'
import reportError from './reportError'

const INVALID_COUNTRY_CODE = CountryPrefix.parse(-1)
export default function getCountryCode(number: E164PhoneNumber): CountryPrefix {
  const countryCode = CountryPrefix.safeParse(
    parsePhoneNumber(number).countryCode
  )
  if (countryCode.success) {
    return countryCode.data
  }

  reportError(
    'warn',
    'Can not get country code from number',
    number.slice(0, 3)
  )
  return INVALID_COUNTRY_CODE
}
