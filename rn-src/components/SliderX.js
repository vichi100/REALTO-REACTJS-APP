import React, { useState, useEffect } from "react";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Platform, View, StyleSheet, Text } from "react-native";

// const SliderWrapper = styled.View`
//   margin: 20px;
//   width: 280px;
//   height: 300px;
//   justify-content: center;
// `;

// const ViewContainer = styled.View`
//   align-self: center;
//   justify-content: center;
// `;
// const LabelWrapper = styled.View`
//   flex-direction: row;
//   justify-content: space-between;
//   padding: 20px 0;
// `;

// const LabelText = styled.Text`
//   font-size: 20px;
// `;

const Slider = props => {
  // // console.log("multiSliderValue", multiSliderValue);
  const [multiSliderValue, setMultiSliderValue] = useState([
    props.min,
    props.max
  ]);

  useEffect(() => {
    // console.log("multiSliderValue", multiSliderValue);
  }, [multiSliderValue]);

  const multiSliderValuesChange = values => {
    // console.log(values);
    setMultiSliderValue(values);
    props.onSlide(values);
  };

  return (
    <View style={styles.container}>
      <View style={styles.LabelWrapper}>
        <Text style={styles.LabelText}>{multiSliderValue[0]} </Text>
        <Text style={styles.LabelText}>{multiSliderValue[1]}</Text>
      </View>
      <MultiSlider
        markerStyle={{
          ...Platform.select({
            ios: {
              height: 30,
              width: 30,
              shadowColor: "#000000",
              shadowOffset: {
                width: 0,
                height: 3
              },
              shadowRadius: 1,
              shadowOpacity: 0.1
            },
            android: {
              height: 30,
              width: 30,
              borderRadius: 50,
              backgroundColor: "#1792E8"
            }
          })
        }}
        pressedMarkerStyle={{
          ...Platform.select({
            android: {
              height: 30,
              width: 30,
              borderRadius: 20,
              backgroundColor: "#148ADC"
            }
          })
        }}
        selectedStyle={{
          backgroundColor: "#1792E8"
        }}
        trackStyle={{
          backgroundColor: "#CECECE"
        }}
        touchDimensions={{
          height: 40,
          width: 40,
          borderRadius: 20,
          slipDisplacement: 40
        }}
        values={[multiSliderValue[0], multiSliderValue[1]]}
        sliderLength={280}
        onValuesChange={multiSliderValuesChange}
        min={props.min}
        max={props.max}
        step={props.step}
        allowOverlap={false}
        showSteps={true}
        minMarkerOverlapDistance={1}
        minMarkerOverlapStepDistance={1}
      />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 50,
    justifyContent: "space-between"
    // alignItems: "center",
    // backgroundColor: "#E0F7FA"
  },
  SliderWrapper: {
    marginLeft: 20,
    width: 280,
    height: 300,
    justifyContent: "center"
  },
  LabelWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: (20, 0),
    marginTop: 10
  }
});
