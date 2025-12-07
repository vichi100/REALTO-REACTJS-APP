import React, { Component } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

export default function RadioButtons({ options, selectedOption, onSelect }) {
  return (
    <View style={styles.buttonWrapper}>
      {options.map(item => {
        return (
          <View key={item.key} style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.circle}
              onPress={() => {
                onSelect(item);
              }}
            >
              {selectedOption && selectedOption.key === item.key && (
                <View style={styles.checkedCircle} />
              )}
            </TouchableOpacity>
            <Text style={styles.buttonLabel}>{item.text}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 30,
    paddingLeft: 20
  },

  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ACACAC",
    alignItems: "center",
    justifyContent: "center"
  },

  checkedCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(102,205,170, .8)"
  },
  buttonLabel: {
    fontSize: 14,
    paddingLeft: 5
  }
});
