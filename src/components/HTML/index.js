import * as React from "react";
import { Linking, Platform } from "react-native";

import Text from "../Text";
import Flex from "../Flex";
import { em } from "../../utils";

function create(nativeProps) {
  return React.forwardRef((props, ref) => {
    return <Flex {...Platform.select(nativeProps)} {...props} ref={ref} />;
  });
}

function createHeadline(level) {
  return React.forwardRef((props, ref) => {
    return <Text {...props} level={level} ref={ref} />;
  });
}

function createText(style = {}, font) {
  return React.forwardRef((props, ref) => {
    return (
      <Text
        {...props}
        font={font}
        style={{ ...props.style, ...style }}
        ref={ref}
      />
    );
  });
}

//Basics
export const Header = create({
  web: {
    accessibilityRole: "banner",
  },
  default: {
    accessibilityRole: "header",
  },
});

export const Footer = create({
  web: {
    accessibilityRole: "contentinfo",
  },
});

export const Nav = create({
  web: {
    accessibilityRole: "navigation",
  },
});

export const Main = create({
  web: {
    accessibilityRole: "main",
  },
});

export const Article = create({
  web: {
    accessibilityRole: "article",
  },
});

export const Section = create({
  default: { accessibilityRole: "summary" },
});

//Headings
export const H1 = createHeadline(1);
export const H2 = createHeadline(2);
export const H3 = createHeadline(3);
export const H4 = createHeadline(4);
export const H5 = createHeadline(5);

//Text

export const P = createText({}, "p");
export const Label = createText({}, "label");
export const Caption = createText({}, "caption");
export const B = createText({ fontWeight: "bold" });
export const I = createText({ fontStyle: "italic" });
export const BlockQuote = createText({ marginVertical: em(1) });
export const BR = createText({
  width: "100%",
  height: em(1),
  ...Platform.select({
    web: { display: "block" },
  }),
});
export const Code = createText({
  fontFamily: Platform.OS !== "web" ? "System" : "Courier",
  fontWeight: "500",
});

export const A = React.forwardRef(({ href, target, ...props }, ref) => {
  return (
    <Text
      {...Platform.select({
        web: {
          href,
          target,
        },
        default: {
          onPress: (event) => {
            props.onPress && props.onPress(event);
            if (Platform.OS !== "web" && href !== undefined) {
              Linking.openURL(href);
            }
          },
        },
      })}
      {...props}
      ref={ref}
    />
  );
});
