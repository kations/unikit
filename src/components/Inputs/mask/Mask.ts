import { applyMask } from './applyMask'
import { removeMask } from './removeMask'
import { OTWMaskValidators } from './types';

export interface InterfaceOTWMaskConstructor {
  mask: string;
  validators: OTWMaskValidators;
}
export class Mask {
  private mask: string;
  private validators: OTWMaskValidators;
  constructor ({ mask, validators }: InterfaceOTWMaskConstructor) {
    this.mask = mask
    this.validators = validators
    this.apply.bind(this)
    this.remove.bind(this)
  }

  apply (value: string) {
    return applyMask({ value, mask: this.mask, validators: this.validators })
  }

  remove (value: string) {
    return removeMask({ value, mask: this.mask, validators: this.validators })
  }
}