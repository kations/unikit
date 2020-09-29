import { OTWMaskValidators } from './types'

const defaultValidators: OTWMaskValidators = {
  '.': /[.]/,
}
export interface InterfaceApplyMaskParams {
  value: string;
  mask: string;
  validators?: OTWMaskValidators;
}
export function applyMask ({ value, mask, validators = defaultValidators }: InterfaceApplyMaskParams): string {
  let acc = ''
  const arrValue: string[] = value.split('')
  for (const maskChar of mask) {
    if (arrValue.length === 0) break
    if (validators[maskChar]) {
      const validator = new RegExp(validators[maskChar], 'g')
      const valueChar = arrValue[0]
      if (!valueChar || !validator.test(valueChar)) continue
      acc += arrValue.shift()
    } else {
      acc += maskChar
    }
  }
  return acc.trim()
}
