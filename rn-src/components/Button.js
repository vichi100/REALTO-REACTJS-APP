import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

const Button = ({ onPress, title, testID, accessibilityLabel }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.appButtonContainer}
    testID={testID}
    accessibilityLabel={accessibilityLabel || title}  // ✅ Ensure it's always set
    accessible={true}  // ✅ Makes the full view accessible
    accessibilityRole="button"
  >
    <Text
      style={styles.appButtonText}
      accessibilityLabel={title}  // ✅ Expose text directly
    >
      {title}
    </Text>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 100,
    marginTop: 10,
    marginBottom: 15
  },
  appButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    alignSelf: "center",
    textTransform: "uppercase"
  }
});

export default Button;
