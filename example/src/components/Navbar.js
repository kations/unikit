import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  isWeb,
  styled,
  useTheme,
  Flex,
  H3,
  H4,
  P,
  useSpring,
  AnimatedView,
  Button,
  Icon,
  Tabs,
} from 'unikit';

import Wrapper from './Wrapper';
import { useAppContext } from '../AppContext';

const getProgress = (a, b, v) => {
  return (v - a) / (b - a);
};

const Header = styled.View({
  width: '100%',
  height: 'auto',
  justifyContent: 'space-between',
  flexDirection: 'row',
  alignItems: 'flex-end',
});

export default ({
  title,
  desc,
  descIcon,
  leftAction,
  rightAction = true,
  goBack,
  maxWidth,
  top = 0,
  modal = false,
  navbarBg = false,
}) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { set, dark } = useAppContext();
  var progress = getProgress(0, 100, top);
  if (progress > 0.55) progress = 0.55;

  const y = useSpring({
    to: -(progress * 50 > 15 ? 15 : progress * 50),
  });

  const o = useSpring({
    to: 0 + progress * 1.75,
  });

  const s = useSpring({
    to: 1 - progress / 2,
  });

  const TitleComp = modal ? H4 : H3;

  return (
    <AnimatedView
      style={{
        position: 'absolute',
        left: 0,
        top: 10,
        zIndex: 100,
        right: 0,
        transform: [{ translateY: y }],
      }}
    >
      <Header px={modal ? 10 : 10} pt={modal ? 10 : insets.top}>
        <AnimatedView
          style={{
            opacity: o,
            zIndex: 10,
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Flex
            bg="surface"
            shadow={5}
            absoluteFill
            borderBottomLeftRadius={isWeb ? 0 : 15}
            borderBottomRightRadius={isWeb ? 0 : 15}
          />
        </AnimatedView>
        <Flex w="100%" zIndex={100}>
          <Wrapper
            pb={10}
            pt={15}
            style={maxWidth ? { maxWidth: maxWidth } : null}
            relative
            px={modal && isWeb ? 0 : 10}
          >
            <Flex
              row
              justifyContent="space-between"
              h={desc ? 50 : 40}
              alignItems="center"
            >
              <Flex row>
                {goBack ? (
                  <Button
                    onPress={() => {
                      goBack();
                    }}
                    bg={'transparent'}
                    rounded
                    mr={7}
                    size={30}
                    px={5}
                  >
                    <Icon
                      name={modal ? 'x' : 'arrowLeft'}
                      color="primary"
                      size={22}
                    />
                  </Button>
                ) : null}
                {goBack && theme.isMobile ? null : leftAction}
              </Flex>

              <AnimatedView
                style={{
                  transform: [{ scale: modal ? 1 : s }],
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  width: '100%',
                }}
                pointerEvents="box-none"
              >
                <Flex w="100%" maxWidth="50%">
                  {desc ? (
                    <Flex flexCenter row>
                      <P font="label" color="primary" numberOfLines={1}>
                        {desc}
                      </P>
                      {descIcon && (
                        <Icon name={descIcon} color="#FFF" ml={4} size={16} />
                      )}
                    </Flex>
                  ) : null}
                  <TitleComp
                    color="text"
                    bold
                    textAlign="center"
                    numberOfLines={1}
                  >
                    {title}
                  </TitleComp>
                </Flex>
              </AnimatedView>

              <Flex>
                {rightAction ? (
                  <Tabs
                    roundness={40}
                    size={40}
                    width={isWeb ? 120 : 90}
                    value={dark}
                    onChange={(v) => set({ dark: v })}
                    bg="transparent"
                    options={[
                      {
                        value: false,
                        label: ({ color, active }) => (
                          <Icon
                            name="sun"
                            size={20}
                            color={color}
                            animate={active}
                          />
                        ),
                      },
                      {
                        value: true,
                        label: ({ color, active }) => (
                          <Icon
                            name="moon"
                            size={20}
                            color={color}
                            animate={active}
                          />
                        ),
                      },
                    ]}
                  />
                ) : null}
              </Flex>
            </Flex>
          </Wrapper>
        </Flex>
      </Header>
    </AnimatedView>
  );
};
