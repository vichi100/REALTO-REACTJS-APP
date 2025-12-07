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

const CustomSlider = (props) => {
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
                    defaultValue={range}
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

export default CustomSlider;
