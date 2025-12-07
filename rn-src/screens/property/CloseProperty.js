import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput
} from "react-native";
import { ButtonGroup } from "@rneui/themed";
import RadioButton from "./../../components/RadioButtons";

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
  const [selectedOption, setSelectedOption] = React.useState(null);

  const onSelect = item => {
    if (selectedOption && selectedOption.key === item.key) {
      setSelectedOption(null);
    } else {
      setSelectedOption(item);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView>
        <View>
          <Text>Did you close this deal successfully</Text>
          <ButtonGroup
            selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
            onPress={updateIndex}
            selectedIndex={index}
            buttons={["Yes", "No"]}
            // containerStyle={{ height: 30 }}
            textStyle={{ textAlign: "center" }}
            selectedTextStyle={{ color: "#fff" }}
            containerStyle={{ borderRadius: 10, width: 300 }}
            containerBorderRadius={10}
          />
        </View>
        <View>
          <Text>
            If you take below query our AI engine will be able to help you fill
            gaps
          </Text>

          <Text>Do you know, who close this property</Text>
          <RadioButton
            selectedOption={selectedOption}
            onSelect={onSelect}
            options={options}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CloseProperty;
