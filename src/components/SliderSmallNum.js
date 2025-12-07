import React, { useState, useRef } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

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
    // eslint-disable-next-line no-unused-vars
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
        // values comes as array [min, max] from rc-slider Range
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
        <div className="flex flex-col justify-center items-center w-full">
            <div className="flex flex-row justify-between w-[300px] mb-2.5">
                <span className="text-black text-sm">{formatValue(selectedRange.min)}</span>
                <span className="text-black text-sm">
                    {selectedRange.max >= maxValue ? `${formatValue(maxValue)}+` : formatValue(selectedRange.max)}
                </span>
            </div>
            <div className="w-[300px]">
                <Slider
                    range
                    min={0}
                    max={1}
                    step={0.01}
                    defaultValue={[getNormalizedValue(selectedRange.min), getNormalizedValue(selectedRange.max)]}
                    onChange={handleValuesChange}
                    trackStyle={{ backgroundColor: "#009688" }}
                    handleStyle={[
                        { borderColor: "#009688", backgroundColor: "#009688", opacity: 1 },
                        { borderColor: "#009688", backgroundColor: "#009688", opacity: 1 }
                    ]}
                    railStyle={{ backgroundColor: "#CECECE" }}
                />
            </div>
        </div>
    );
};

export default SliderSmallNum;
