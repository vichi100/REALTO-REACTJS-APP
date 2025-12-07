import React, { useState } from "react";

// import all the components we are going to use
import { SafeAreaView, StyleSheet, View, Text, Button } from "react-native";

//import basic react native components
import { BottomSheet } from "react-native-btr";

//import to show social icons
import { SocialIcon } from "@rneui/themed";

const Filter = props => {
  const [visible, setVisible] = useState(false);

  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 20,
            textAlign: "center"
          }}
        >
          Example of Bottom Sheet in React Native
        </Text>
        <Button
          onPress={toggleBottomNavigationView}
          //on Press of the button bottom sheet will be visible
          title="Show Bottom Sheet"
        />

        <BottomSheet
          visible={visible}
          //setting the visibility state of the bottom shee
          onBackButtonPress={toggleBottomNavigationView}
          //Toggling the visibility state on the click of the back botton
          onBackdropPress={toggleBottomNavigationView}
          //Toggling the visibility state on the clicking out side of the sheet
        >
          {/*Bottom Sheet inner View*/}
          <View style={styles.bottomNavigationView}>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  padding: 20,
                  fontSize: 20
                }}
              >
                Share Using
              </Text>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <SocialIcon
                  //Social Icon using @rneui/themed
                  type="twitter"
                  //Type of Social Icon
                  onPress={() => {
                    //Action to perform on press of Social Icon
                    toggleBottomNavigationView();
                    alert("twitter");
                  }}
                />
                <SocialIcon
                  type="gitlab"
                  onPress={() => {
                    toggleBottomNavigationView();
                    alert("gitlab");
                  }}
                />
                <SocialIcon
                  type="medium"
                  onPress={() => {
                    toggleBottomNavigationView();
                    alert("medium");
                  }}
                />
                <SocialIcon
                  type="facebook"
                  onPress={() => {
                    toggleBottomNavigationView();
                    alert("facebook");
                  }}
                />
                <SocialIcon
                  type="instagram"
                  onPress={() => {
                    toggleBottomNavigationView();
                    alert("instagram");
                  }}
                />
              </View>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <SocialIcon
                  type="facebook"
                  onPress={() => {
                    toggleBottomNavigationView();
                    alert("facebook");
                  }}
                />
                <SocialIcon
                  type="instagram"
                  onPress={() => {
                    toggleBottomNavigationView();
                    alert("instagram");
                  }}
                />
                <SocialIcon
                  type="gitlab"
                  onPress={() => {
                    toggleBottomNavigationView();
                    alert("gitlab");
                  }}
                />
                <SocialIcon
                  type="twitter"
                  onPress={() => {
                    toggleBottomNavigationView();
                    alert("twitter");
                  }}
                />
                <SocialIcon
                  type="medium"
                  onPress={() => {
                    toggleBottomNavigationView();
                    alert("medium");
                  }}
                />
              </View>
            </View>
          </View>
        </BottomSheet>
      </View>
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0F7FA"
  },
  bottomNavigationView: {
    backgroundColor: "#fff",
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center"
  }
});
