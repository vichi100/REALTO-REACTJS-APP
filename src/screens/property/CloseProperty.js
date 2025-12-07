import React, { useState } from "react";
import CustomButtonGroup from "./../../components/CustomButtonGroup";

const options1 = [
    {
        key: "It is closed by owner",
        text: "It is closed by owner"
    },
    {
        key: "It is closed by other dealer",
        text: "It is closed by other dealer"
    },
    {
        key: "Owner is not intrested any more to rent/sell this property",
        text: "Owner is not intrested any more to rent/sell this property"
    },
    {
        key: "I dont care",
        text: "I dont care"
    }
];

const CloseProperty = props => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [index, setIndex] = useState(null);

    const onSelect = item => {
        if (selectedOption && selectedOption.key === item.key) {
            setSelectedOption(null);
        } else {
            setSelectedOption(item);
        }
    };

    const updateIndex = (selectedIndex) => {
        setIndex(selectedIndex);
    }

    return (
        <div className="flex flex-col h-full bg-white overflow-y-auto p-5">
            <div className="mb-5">
                <p className="mb-2 font-semibold">Did you close this deal successfully</p>
                <CustomButtonGroup
                    buttons={[{ text: "Yes" }, { text: "No" }]}
                    selectedIndices={[index]}
                    isMultiSelect={false}
                    onButtonPress={(idx) => updateIndex(idx)}
                />
            </div>
            <div>
                <p className="mb-2 text-sm text-gray-600">
                    If you take below query our AI engine will be able to help you fill
                    gaps
                </p>

                <p className="mb-2 font-semibold">Do you know, who close this property</p>
                <div className="flex flex-col space-y-2">
                    {options1.map((option) => (
                        <div
                            key={option.key}
                            className="flex items-center cursor-pointer"
                            onClick={() => onSelect(option)}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${selectedOption?.key === option.key ? 'border-blue-500' : 'border-gray-400'}`}>
                                {selectedOption?.key === option.key && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                )}
                            </div>
                            <span>{option.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CloseProperty;
