import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Easing
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const AccordionListItem = ({ title, children, open = false, testID }) => {
  const [isOpen, setIsOpen] = useState(open);
  const animatedController = useRef(new Animated.Value(open ? 1 : 0)).current;
  const [bodySectionHeight, setBodySectionHeight] = useState();

  const bodyHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, bodySectionHeight]
  });

  const arrowAngle = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: ["0rad", `${Math.PI}rad`]
  });

  const toggleListItem = () => {
    if (isOpen) {
      Animated.timing(animatedController, {
        duration: 300,
        toValue: 0,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false
      }).start();
    } else {
      Animated.timing(animatedController, {
        duration: 300,
        toValue: 1,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false
      }).start();
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (open) {
      Animated.timing(animatedController, {
        duration: 300,
        toValue: 1,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false
      }).start();
    }
  }, [open]);

  return (
    <>
      <TouchableWithoutFeedback onPress={() => toggleListItem()} testID={testID}>
        <View style={styles.titleContainer}>
          <Text>{title}</Text>
          <Animated.View style={{ transform: [{ rotateZ: arrowAngle }] }}>
            <MaterialIcons name="keyboard-arrow-down" size={30} color="black" />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.bodyBackground, { height: bodyHeight }]}>
        <View
          style={styles.bodyContainer}
          onLayout={event =>
            setBodySectionHeight(event.nativeEvent.layout.height)
          }
        >
          {children}
        </View>
      </Animated.View>
    </>
  );
};
export default AccordionListItem;

const styles = StyleSheet.create({
  bodyBackground: {
    backgroundColor: "#EFEFEF",
    overflow: "hidden"
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    paddingLeft: "1.5rem",
    borderTopWidth: 1,
    borderBottomWidth: 5,
    borderColor: "#EFEFEF",
    padding: 10,
  },
  bodyContainer: {
    padding: "1rem",
    paddingLeft: "1.5rem",
    position: "absolute",
    bottom: 0,
    width: "100%",
  }
});
