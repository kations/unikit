import React, { forwardRef } from "react";
import { Linking, Platform } from "react-native";

import Box from "../Box";
import Text from "../Text";
import Headline from "../Headline";
import { rem, em } from "../util";

function create(nativeProps) {
  return forwardRef((props, ref) => {
    return <Box {...Platform.select(nativeProps)} {...props} ref={ref} />;
  });
}

function createHeadline(level) {
  return forwardRef((props, ref) => {
    return <Headline {...props} level={level} ref={ref} />;
  });
}

function createText(style = {}) {
  return forwardRef((props, ref) => {
    return <Text {...props} style={{ ...props.style, ...style }} ref={ref} />;
  });
}

//Basics
export const Header = create({
  web: {
    accessibilityRole: "banner"
  },
  default: {
    accessibilityRole: "header"
  }
});

export const Footer = create({
  web: {
    accessibilityRole: "contentinfo"
  }
});

export const Nav = create({
  web: {
    accessibilityRole: "navigation"
  }
});

export const Main = create({
  web: {
    accessibilityRole: "main"
  }
});

export const Article = create({
  web: {
    accessibilityRole: "article"
  }
});

export const Section = create({
  default: { accessibilityRole: "summary" }
});

//Headings
export const H1 = createHeadline(1);
export const H2 = createHeadline(2);
export const H3 = createHeadline(3);
export const H4 = createHeadline(4);
export const H5 = createHeadline(5);

//Text

export const P = createText();
export const B = createText({ fontWeight: "bold" });
export const I = createText({ fontStyle: "italic" });
export const BlockQuote = createText({ marginVertical: em(1) });
export const BR = createText({ width: "100%", height: em(1) });
export const Code = createText({
  fontFamily: Platform.OS !== "web" ? "System" : "Courier",
  fontWeight: "500"
});

export const A = forwardRef(({ href, target, ...props }, ref) => {
  return (
    <Text
      {...Platform.select({
        web: {
          href,
          target
        },
        default: {
          onPress: event => {
            props.onPress && props.onPress(event);
            if (Platform.OS !== "web" && href !== undefined) {
              Linking.openURL(href);
            }
          }
        }
      })}
      {...props}
      ref={ref}
    />
  );
});
