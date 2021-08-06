import React from "react";
import { TextProps } from "react-native";
import { mask } from "./utils/mask";
import type { MaskOptions } from "../@types/MaskOptions";

import Text from "../Text";

interface MaskedTextProps {
  children: string;
  mask?: string;
  type?: "custom" | "currency";
  options?: MaskOptions;
}

export function MaskedText({
  children: text,
  mask: pattern = "",
  type = "custom",
  options = {} as MaskOptions,
  ...rest
}: MaskedTextProps & TextProps): JSX.Element {
  return <Text {...rest}>{mask(text, pattern, type, options)}</Text>;
}
