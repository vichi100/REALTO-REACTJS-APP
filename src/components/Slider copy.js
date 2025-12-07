import React, { useState, useEffect } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const SliderCopy = props => {
    const [multiSliderValue, setMultiSliderValue] = useState([
        props.min,
        props.max
    ]);

    useEffect(() => {
        // console.log("multiSliderValue", multiSliderValue);
    }, [multiSliderValue]);

    const multiSliderValuesChange = values => {
        setMultiSliderValue(values);
        props.onSlide(values);
    };

    const expValue = props.min * Math.pow(props.max / props.min, 0);

    return (
        <div className="flex flex-col justify-between ml-[50px] flex-1">
            <div className="flex flex-row justify-between mt-2.5 px-5">
                <span className="text-black text-sm">{multiSliderValue[0]} </span>
                <span className="text-black text-sm">{multiSliderValue[1]}</span>
            </div>
            <div className="ml-5 w-[280px] h-[300px] flex justify-center">
                <Slider
                    range
                    min={props.min}
                    max={props.max}
                    step={Math.round(expValue / 1000) * 1000 || 1} // Fallback step if expValue is 0 or NaN
                    defaultValue={[props.min, props.max]}
                    value={multiSliderValue}
                    onChange={multiSliderValuesChange}
                    trackStyle={{ backgroundColor: "#009688" }}
                    handleStyle={[
                        { borderColor: "#009688", backgroundColor: "#009688", opacity: 1, height: 30, width: 30, marginTop: -13 },
                        { borderColor: "#009688", backgroundColor: "#009688", opacity: 1, height: 30, width: 30, marginTop: -13 }
                    ]}
                    railStyle={{ backgroundColor: "#009688" }} // Original had trackStyle same color as rail? No, track is usually active. Original had trackStyle #009688.
                // Original MultiSlider has trackStyle (active) and selectedStyle (active).
                // rc-slider has trackStyle (active) and railStyle (inactive).
                // Original code: selectedStyle: #009688, trackStyle: #009688. Wait, trackStyle in MultiSlider is usually the inactive part?
                // "trackStyle: Custom style for the track."
                // "selectedStyle: Custom style for the selected part of the track."
                // In RN MultiSlider: selectedStyle is the active part. trackStyle is the inactive part.
                // In code: selectedStyle bg #009688. trackStyle bg #009688.
                // So both are green? That's weird. Maybe it means the whole line is green?
                // Let's stick to standard: active green, inactive gray/default.
                // But if I follow code literally:
                // selectedStyle (active) = #009688
                // trackStyle (inactive) = #009688
                // So it's all green?
                // I'll use #009688 for active and a lighter color for inactive or just default.
                // Actually, looking at `Slider.js` (original), it had trackStyle #CECECE.
                // `Slider copy.js` has trackStyle #009688.
                // I'll follow `Slider copy.js` but it might look weird if everything is green.
                // I'll use #009688 for active (track) and #e9e9e9 for inactive (rail) to be safe, or follow the code if it really wants all green.
                // I'll use #009688 for active.
                />
            </div>
        </div>
    );
};

export default SliderCopy;
