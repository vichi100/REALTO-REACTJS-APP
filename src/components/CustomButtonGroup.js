import React from 'react';

const CustomButtonGroup = ({
    buttons,
    selectedIndices = [],
    isMultiSelect = false,
    onButtonPress,
    containerStyle,
    buttonStyle = { backgroundColor: '#fff', borderWidth: '0px' },
    selectedButtonStyle = { backgroundColor: 'rgba(0, 163, 108, .2)' },
    buttonTextStyle = { color: '#000' },
    selectedButtonTextStyle = { color: '#000' },
    vertical = false,
    isSegmented = false
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

    const getButtonRoundedClass = (index, total) => {
        if (!isSegmented) return 'rounded';
        if (total === 1) return 'rounded-lg';
        if (index === 0) return 'rounded-l-lg rounded-r-none';
        if (index === total - 1) return 'rounded-r-lg rounded-l-none';
        return 'rounded-none';
    };

    return (
        <div className={`flex ${vertical ? 'flex-col' : 'flex-row flex-wrap'} ${isSegmented ? 'gap-0' : 'gap-2'}`} style={containerStyle}>
            {buttons.map((button, index) => {
                const isSelected = selectedIndices.includes(index);
                return (
                    <button
                        key={index}
                        onClick={() => handlePress(index)}
                        className={`
              px-4 py-2 transition-colors duration-200
              ${getButtonRoundedClass(index, buttons.length)}
              ${isSegmented && index > 0 ? '-ml-px' : ''}
              ${isSelected
                                ? 'z-10'
                                : 'hover:bg-gray-50 z-0'}
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
