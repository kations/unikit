import { OTWMaskValidators } from './types'

export interface InterfaceRemoveMaskParams {
  value: string;
  mask: string;
  validators: OTWMaskValidators;
}
export function removeMask ({ value, mask, validators }: InterfaceRemoveMaskParams): string {
  const maskChars = Array.from(new Set(mask.split('')))
  const charsToRemove = maskChars.filter((maskChar) => !validators[maskChar])
  const regex = new RegExp(`(${charsToRemove.map((v) => `\\${v}`).join('|')})`, 'g')
  const maxLength = mask.replace(regex, '').length
  return value.replace(regex, '').slice(0, maxLength)
}
