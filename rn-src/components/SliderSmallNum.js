import React, { useState, useRef } from "react";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Platform, View, StyleSheet, Text } from "react-native";

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};


const SliderSmallNum = (props) => {
  const minValue = props.min || 1; // Default to 1 if not provided
  const maxValue = props.max || 50; // Default to 50 if not provided
  const [range, setRange] = useState([0, 1]); // Normalized range for logarithmic scaling
  const [selectedRange, setSelectedRange] = useState({
    min: minValue,
    max: maxValue,
  });

  const previousValues = useRef([minValue, maxValue]);

  // Format numbers (no need for "k" or "L" formatting for small numbers)
  const formatValue = (value) => {
    return value.toLocaleString(); // Default formatting for small numbers
  };

  const getLogScaledValue = (val) => {
    // Convert normalized value (0 to 1) to logarithmic scale
    const logMin = Math.log(minValue);
    const logMax = Math.log(maxValue);
    const scale = logMin + val * (logMax - logMin);
    return Math.round(Math.exp(scale)); // Convert back to normal scale
  };

  const getNormalizedValue = (val) => {
    // Convert a value to normalized scale (0 to 1) using logarithmic scaling
    const logMin = Math.log(minValue);
    const logMax = Math.log(maxValue);
    return (Math.log(val) - logMin) / (logMax - logMin);
  };

  // Debounced version of props.onSlide
  const debouncedOnSlide = useRef(
    debounce((values) => {
      props.onSlide(values);
    }, 300) // 300ms debounce delay
  ).current;

  const handleValuesChange = (values) => {
    const newMin = getLogScaledValue(values[0]);
    const newMax = getLogScaledValue(values[1]);

    if (newMin !== previousValues.current[0] || newMax !== previousValues.current[1]) {
      setRange(values);
      setSelectedRange({ min: newMin, max: newMax });
      previousValues.current = [newMin, newMax];
      props.onSlide([newMin, newMax]);
      debouncedOnSlide([newMin, newMax]); // Call the debounced callback
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelWrapper}>
        <Text style={styles.labelText}>{formatValue(selectedRange.min)}</Text>
        <Text style={styles.labelText}>
          {selectedRange.max >= maxValue ? `${formatValue(maxValue)}+` : formatValue(selectedRange.max)}
        </Text>
      </View>
      <MultiSlider
        markerStyle={{
          height: 30,
          width: 30,
          borderRadius: 50,
          backgroundColor: "#009688",
        }}
        selectedStyle={{
          backgroundColor: "#009688",
        }}
        trackStyle={{
          backgroundColor: "#CECECE",
        }}
        values={[getNormalizedValue(selectedRange.min), getNormalizedValue(selectedRange.max)]}
        sliderLength={300}
        onValuesChange={handleValuesChange}
        min={0} // Normalized minimum value
        max={1} // Normalized maximum value
        step={0.01} // Smaller step for finer adjustments
        allowOverlap={false}
      />
    </View>
  );
};

export default SliderSmallNum;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  labelWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
    marginBottom: 10,
  },
  labelText: {
    color: "#000",
    fontSize: 14,
  },
});