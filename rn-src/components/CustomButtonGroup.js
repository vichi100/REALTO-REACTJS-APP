import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const CustomButtonGroup = ({
  buttons, // Array of button data (text, image, etc.)
  accessibilityLabelId, // Accessibility label for the button group
  selectedIndices = [], // Controlled selected indices from the parent
  isMultiSelect = false, // Multi-select mode
  buttonStyle, // Custom button styles
  selectedButtonStyle, // Custom selected button styles
  buttonTextStyle, // Custom button text styles
  selectedButtonTextStyle, // Custom selected button text styles
  buttonImageStyle, // Custom button image styles
  containerStyle, // Custom container styles
  onButtonPress, // Callback to handle button press
  width = 105, // Default width for buttons
  height = 40, // Default height for buttons
  buttonBorderColor = '#ffffff', // Default border color
  buttonBorderWidth = .5, // New prop for border width
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
      newSelectedIndices = [index]; // Only allow one selection in single-select mode
    }

    // Call the parent callback to update the state
    if (onButtonPress) {
      onButtonPress(index, buttons[index], newSelectedIndices);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.buttonGroup, { flexWrap: 'wrap' }]}>
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            accessible={true}
            accessibilityLabel={`${accessibilityLabelId}_${button.text}`.toLowerCase().replace(/ /g, '_')}
            style={[
              styles.button,
              {
                width: width,
                height: height,
                borderColor: buttonBorderColor,
                borderWidth: buttonBorderWidth, // Use custom border width
              },
              buttonStyle,
              selectedIndices.includes(index) && [styles.selectedButton, selectedButtonStyle],
            ]}
            onPress={() => handlePress(index)}
          >
            {button.image && (
              <Image source={button.image} style={[styles.buttonImage, buttonImageStyle]} />
            )}
            <Text
              style={[
                styles.buttonText,
                buttonTextStyle,
                selectedIndices.includes(index) && selectedButtonTextStyle,
              ]}
            >
              {button.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 15,
    // alignItems: 'center',
    // padding: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignContent: 'flex-start',
    gap: 19,

    // borderWidth: 1,
    // borderColor: '#ccc',
  },
  button: {
    flexDirection: 'column',
    // alignItems: 'flex-start',
    justifyContent: 'center',
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: 'rgba( 254, 254, 250, .9);',
    marginBottom: 1, // Add margin between rows
  },
  selectedButton: {
    backgroundColor: 'rgba(0, 163, 108, .2)',
  },
  buttonImage: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
    // flexShrink: 1,
    textAlign: 'center',
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default CustomButtonGroup;