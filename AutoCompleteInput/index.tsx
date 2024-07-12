import { usePrevious } from '@src/hooks/usePrevious';
import React, { forwardRef, ReactElement, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Animated, Easing, NativeSyntheticEvent, TextInputFocusEventData, View } from 'react-native';
import { CustomFlatList, CustomFlatListProps } from '../CustomFlatList';
import CustomInput, { CustomInputProps } from '../CustomInput';
import { styles } from './styles';
import { isIOS } from '@utils';
import { responsiveDistance } from '@constants/responsiveDistance';

interface AutoCompleteInputProps<T> {
  listProps: CustomFlatListProps<T>;
  inputProps: CustomInputProps;
  renderFooter?: JSX.Element;
}

export interface AutoCompleteInputRef {
  hide: () => void;
  getText: () => string;
}

export const AutoCompleteInput = <T,>(props: AutoCompleteInputProps<T>, ref: Ref<AutoCompleteInputRef>) => {
  const { inputProps, listProps, renderFooter } = props;
  const [height, setHeight] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const animation = useRef<Animated.Value>(new Animated.Value(0));
  const prevVisible = usePrevious(visible);
  const [text, setText] = useState<string>(inputProps.value || '');

  const hideAutocomplete = () => {
    Animated.timing(animation.current, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const showAutocomplete = () => {
    Animated.timing(animation.current, {
      toValue: 1,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const onChange = (text: string) => {
    if (!!text) {
      !visible && setVisible(true);
    } else {
      visible && setVisible(false);
    }
    setText(text);
    inputProps.onChangeText && inputProps.onChangeText(text);
  };

  const onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    inputProps.onFocus && inputProps.onFocus(e);
    if (!!text || !!e.nativeEvent.text) {
      if (!text && e.nativeEvent.text) setText(e.nativeEvent.text);
      setVisible(true);
    }
  };

  useEffect(() => {
    if (prevVisible != visible) {
      if (visible) {
        showAutocomplete();
      } else {
        hideAutocomplete();
      }
    }
  }, [visible]);

  useImperativeHandle(ref, () => ({
    hide() {
      setVisible(false);
    },
    getText() {
      return text;
    },
  }));

  return (
    <View style={[styles.container, isIOS && { zIndex: 1 }]}>
      <View onLayout={e => e.nativeEvent.layout.height !== height && setHeight(e.nativeEvent.layout.height)}>
        <CustomInput {...inputProps} onChangeText={onChange} errorValue={undefined} onFocus={onFocus} />
      </View>
      <Animated.View
        style={[
          styles.dropdown,
          {
            opacity: animation.current,
            top: height + responsiveDistance.hp_4,
            borderWidth: visible ? responsiveDistance.hp_1 : 0,
          },
        ]}
      >
        {visible ? (
          <View style={styles.containerList}>
            <CustomFlatList {...listProps} nestedScrollEnabled={true} style={[listProps.style, styles.maxHeight]} />
            {renderFooter}
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
};

type ForwardRefFn<R> = <P = {}>(p: P) => ReactElement | null;

export default React.memo(forwardRef(AutoCompleteInput)) as ForwardRefFn<React.Component>;
