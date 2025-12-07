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

const Slider = (props) => {
  const minValue = props.min;
  const maxValue = props.max;
  const [range, setRange] = useState([0, 1]);
  const [selectedRange, setSelectedRange] = useState({
    min: minValue,
    max: maxValue,
  });

  const previousValues = useRef([minValue, maxValue]);

  // Format numbers as "10k", "20k", etc., or "1L", "2.5L", etc.
  const formatValue = (value) => {
    if (value >= 100000) {
      return `${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)}L`; // Convert to "L" format
    } else if (value >= 1000) {
      return `${Math.round(value / 1000)}k`; // Convert to "k" format
    }
    return value.toLocaleString(); // Default formatting
  };

  const getScaledValue = (val) => {
    const scaledValue = maxValue * Math.pow(minValue / maxValue, 1 - val);
    if (scaledValue > 300000) {
      return Math.round(scaledValue / 20000) * 20000;
    } else if (scaledValue > 100000) {
      return Math.round(scaledValue / 10000) * 10000;
    } else {
      return Math.round(scaledValue / 1000) * 1000;
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

export default Slider;

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