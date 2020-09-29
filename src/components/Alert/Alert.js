import * as React from 'react';

import { withThemeProps } from '../../restyle';
import Icon from '../Icon';
import Button from '../Button';
import Flex from '../Flex';
import Group from '../Group';
import Text from '../Text';
import Progress from '../Progress';

const Alert = ({
  counter,
  textColor,
  theme,
  close,
  type,
  timeout,
  title,
  message,
  component,
  icon,
  loading,
  interval,
  confirm,
  actionSheet,
}) => {
  if (!title && !message) return null;
  return (
    <Flex width="100%" alignItems="center" p={theme.globals.gap} row>
      {loading || icon ? (
        <Flex w={30} h="100%" maxHeight={35} justifyContent="center">
          {loading && (
            <Progress
              trackColor="transparent"
              size={25}
              progressWidth={1.5}
              loading
            />
          )}
          {icon && <Icon name={icon} color={textColor} size={23} animate />}
        </Flex>
      ) : null}
      <Flex flex={1}>
        {title && (
          <Text font="h4" color={textColor}>
            {title}
          </Text>
        )}

        {message && <Text color={textColor}>{message}</Text>}
        {component || null}
      </Flex>
      <Flex
        position="absolute"
        top={0}
        right={theme.globals.gap}
        bottom={0}
        flexCenter
      >
        <Group>
          {timeout && (
            <Button
              bg={`${type || 'surface'}:darken:5`}
              size={30}
              roundness={theme.globals.roundness}
            >
              {timeout > 0 && (
                <Progress
                  min={0}
                  progressColor={textColor}
                  trackColor={`${type || 'surface'}`}
                  max={timeout}
                  value={counter}
                  animate={false}
                  size={18}
                  duration={interval}
                  trackWidth={3}
                  progressWidth={2}
                  animate={false}
                />
              )}
            </Button>
          )}
          {confirm || actionSheet ? null : (
            <Button
              onPress={(e) => {
                e.stopPropagation();
                close();
              }}
              bg={`${type || 'surface'}:darken:5`}
              size={30}
              roundness={theme.globals.roundness}
            >
              <Icon name="x" color={textColor} size={22} strokeWidth={2} />
            </Button>
          )}
        </Group>
      </Flex>
    </Flex>
  );
};

export default withThemeProps(Alert, 'Alert');
