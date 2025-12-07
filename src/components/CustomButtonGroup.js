import React from 'react';

const CustomButtonGroup = ({
    buttons,
    selectedIndices = [],
    isMultiSelect = false,
    onButtonPress,
    containerStyle,
    buttonStyle,
    selectedButtonStyle,
    buttonTextStyle,
    selectedButtonTextStyle,
    vertical = false
}) => {
    const handlePress = (index) => {
        let newSelectedIndices;
        if (isMultiSelect) {
            newSelectedIndices = [...selectedIndices];
            if (newSelectedIndices.includes(index)) {
                newSelectedIndices.splice(newSelectedIndices.indexOf(index), 1);
            } else {
                newSelectedIndices.push(index);
            }
        } else {
            newSelectedIndices = [index];
        }

        if (onButtonPress) {
            onButtonPress(index, buttons[index], newSelectedIndices);
        }
    };

    return (
        <div className={`flex ${vertical ? 'flex-col' : 'flex-row flex-wrap'} gap-2`} style={containerStyle}>
            {buttons.map((button, index) => {
                const isSelected = selectedIndices.includes(index);
                return (
                    <button
                        key={index}
                        onClick={() => handlePress(index)}
                        className={`
              px-4 py-2 rounded border transition-colors duration-200
              ${isSelected
                                ? 'bg-green-100 border-green-500 text-black'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}
            `}
                        style={{
                            ...buttonStyle,
                            ...(isSelected ? selectedButtonStyle : {}),
                            ...buttonTextStyle,
                            ...(isSelected ? selectedButtonTextStyle : {})
                        }}
                    >
                        {button.text}
                    </button>
                );
            })}
        </div>
    );
};

export default CustomButtonGroup;
