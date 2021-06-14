import * as React from 'react';
import { withThemeProps, Touchable } from '../../style';

import Icon from '../Icon';
import Flex from '../Flex';
import Avatar from '../Avatar';

const File = ({
  theme,
  value,
  imageKey,
  onChange,
  onPick,
  onDelete,
  roundness,
  imageActions = [],
  imageSize = 100,
  camera = true,
  picker = true,
  pickerIcon = 'image', //"fileText"
  multi = false,
  ...rest
}) => {
  if (typeof value !== 'object') value = [value];

  const boxSize = imageSize + theme.globals.gap;

  const selectProps = {
    bg: 'input',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'primary:setAlpha:0.1',
    borderRadius: theme.globals.roundness,
    flexCenter: true,
    h: boxSize,
    w: camera ? boxSize * 2 : boxSize,
  };

  return (
    <Flex width="100%" row {...rest}>
      {value.map((item, i) => {
        return (
          <Flex
            key={`file-${i}`}
            bg="input"
            p={theme.globals.gap / 2}
            borderRadius={roundness || theme.globals.roundness}
            mr={theme.globals.gap / 2}
          >
            <Avatar
              size={imageSize}
              source={{ uri: imageKey ? item[imageKey] : item }}
              roundness={roundness || theme.globals.roundness}
            />
            <Touchable
              bg="input"
              borderRadius={roundness || theme.globals.roundness}
              absolute
              t={0}
              r={0}
              p={theme.globals.gap / 2}
              onPress={() =>
                theme.alert({
                  position: 'bottom',
                  actionSheet: true,
                  backdrop: true,
                  actions: [
                    ...imageActions,
                    {
                      icon: 'trash',
                      label: 'Delete',
                      onPress: () => {
                        if (onDelete) onDelete(item);
                      },
                    },
                  ],
                })
              }
            >
              <Icon name="moreVertical" size={20} />
            </Touchable>
          </Flex>
        );
      })}
      {multi || !value ? (
        <Flex row {...selectProps}>
          {camera ? (
            <Touchable
              flex={1}
              h="100%"
              flexCenter
              borderRightWidth={1}
              borderColor="primary:setAlpha:0.05"
              onPress={() => {
                if (onPick) onPick({ type: 'camera' });
              }}
            >
              <Icon name="camera" size={20} />
            </Touchable>
          ) : null}
          {picker ? (
            <Touchable
              onPress={() => {
                if (onPick) onPick({ type: 'picker' });
              }}
              h="100%"
              flexCenter
              flex={1}
            >
              <Icon name={pickerIcon} size={20} />
            </Touchable>
          ) : null}
        </Flex>
      ) : null}
    </Flex>
  );
};

export default withThemeProps(File, 'File');
