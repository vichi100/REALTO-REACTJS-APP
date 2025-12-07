import React from "react";
import PropTypes from "prop-types";
import {
  View,
  TouchableOpacity,
  TouchableNativeFeedback
} from "react-native";
import { Platform } from "react-native";

const { Version, OS } = Platform;

export const IS_ANDROID = OS === "android";
export const IS_LT_LOLLIPOP = Version < 21;
export const noop = () => {};

const Touchable = ({ onPress, style, children }) => {
  if (IS_ANDROID && !IS_LT_LOLLIPOP) {
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        onPress={onPress}
      >
        <View style={style}>{children}</View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={style}>
      {children}
    </TouchableOpacity>
  );
};

Touchable.propTypes = {
  onPress: PropTypes.func,
  // style: ViewPropTypes.style,
  children: PropTypes.node.isRequired
};

Touchable.defaultProps = {
  onPress: noop,
  style: {}
};

export default Touchable;
