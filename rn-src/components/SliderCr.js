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

const SliderCr = (props) => {
  const minValue = props.min || 1000000; // Default to 1,000,000 if undefined
  const maxValue = props.max || 50000000; // Default to 50,000,000 if undefined
  const [range, setRange] = useState([0, 1]);
  const [selectedRange, setSelectedRange] = useState({
    min: minValue,
    max: maxValue,
  });

  const previousValues = useRef([minValue, maxValue]);

  // Format numbers as "10L", "20L", etc., or "1Cr", "2.5Cr", etc.
  const formatValue = (value) => {
    if (value === undefined) return "N/A"; // Handle undefined values gracefully
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(value % 10000000 === 0 ? 0 : 1)}Cr`; // Convert to "Cr" format
    } else if (value >= 100000) {
      return `${Math.round(value / 100000)}L`; // Convert to "L" format
    }
    return value.toLocaleString(); // Default formatting
  };

  const getScaledValue = (val) => {
    const scaledValue = maxValue * Math.pow(minValue / maxValue, 1 - val);
    if (scaledValue > 30000000) {
      return Math.round(scaledValue / 2000000) * 2000000;
    } else if (scaledValue > 10000000) {
      return Math.round(scaledValue / 1000000) * 1000000;
    } else {
      return Math.round(scaledValue / 100000) * 100000;
    }
  };

  // Debounced version of props.onSlide
  const debouncedOnSlide = useRef(
    debounce((values) => {
      props.onSlide(values);
    }, 300) // 300ms debounce delay
  ).current;

  const handleValuesChange = (values) => {
    const newMin = getScaledValue(values[0]);
    const newMax = getScaledValue(values[1]);

    // Only update state and call props.onSlide if values have changed
    if (newMin !== previousValues.current[0] || newMax !== previousValues.current[1]) {
      setRange(values); // Update the slider range
      setSelectedRange({ min: newMin, max: newMax }); // Update the selected range
      previousValues.current = [newMin, newMax]; // Update previous values
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
        values={range}
        sliderLength={300}
        onValuesChange={handleValuesChange}
        min={0}
        max={1}
        step={0.01}
        allowOverlap={false}
      />
    </View>
  );
};

export default SliderCr;

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