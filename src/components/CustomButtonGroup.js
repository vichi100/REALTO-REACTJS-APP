import React from 'react';

const CustomButtonGroup = ({
    buttons,
    selectedIndices = [],
    isMultiSelect = false,
    onButtonPress,
    containerStyle,
    buttonStyle = { backgroundColor: 'var(--background)', borderWidth: '1px', borderColor: 'var(--border)', borderRadius: '9999px' },
    selectedButtonStyle = { backgroundColor: 'rgba(0, 163, 108, 0.3)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
    buttonTextStyle = { color: 'var(--foreground)', fontSize: '14px' },
    selectedButtonTextStyle = { color: 'var(--foreground)', fontWeight: '600' },
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
        if (!isSegmented) return 'rounded-full';
        if (total === 1) return 'rounded-full';
        if (index === 0) return 'rounded-l-full rounded-r-none';
        if (index === total - 1) return 'rounded-r-full rounded-l-none';
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
              px-4 py-2 transition-all duration-200
              ${getButtonRoundedClass(index, buttons.length)}
              ${isSegmented && index > 0 ? '-ml-px' : ''}
              ${isSelected
                                ? 'z-10 scale-105'
                                : 'hover:bg-neutral-800 z-0 opacity-80 hover:opacity-100'}
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
