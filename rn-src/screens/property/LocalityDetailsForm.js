import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Keyboard,
  AsyncStorage
} from "react-native";
import { TextInput, HelperText, useTheme } from "react-native-paper";
import Button from "./../../components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Snackbar from "./../../components/SnackbarComponent";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SERVER_URL, GOOGLE_PLACES_API_KEY } from "./../../utils/Constant";
import { connect } from "react-redux";
import { setPropertyType, setPropertyDetails } from "./../../reducers/Action";

const homePlace = { description: 'Mumbai', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };

const LocalityDetailsForm = props => {
  const ref = useRef();
  const { navigation } = props;
  const [city, setCity] = useState("");
  const [gLocation, setGLocation] = useState(null);
  const [flatNumber, setFlatNumber] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [landmark, setLandmark] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [address, setAddress] = useState(null);

  const dismissSnackBar = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    // console.log("useEffect");
    // const property = await AsyncStorage.getItem("property");
    // // console.log(property);
  }, []);

  const onSubmit = async () => {
    if (city.trim() === "") {
      setErrorMessage("City is missing");
      setIsVisible(true);
      return;
    } else if (gLocation === null) {
      setErrorMessage("Area is missing");
      setIsVisible(true);
      return;
    } else if (
      props.propertyDetails &&
      props.propertyDetails.property_type &&
      props.propertyDetails.property_type.toLowerCase() === "residential" &&
      flatNumber.trim() === ""
    ) {
      setErrorMessage("Flat Number is missing");
      setIsVisible(true);
      return;
    } else if (buildingName.trim() === "") {
      setErrorMessage("Building name is missing");
      setIsVisible(true);
      return;
    } else if (landmark.trim() === "") {
      setErrorMessage("Street/Landmark is missing");
      setIsVisible(true);
      return;
    }

    const property = props.propertyDetails || {}; // Default to an empty object
    const propertyType = property.property_type || ""; // Default to an empty string
    console.log("gLocation: ", gLocation);

    const property_address = {
      city: city.trim(),
      location_area: gLocation,
      flat_number: flatNumber.trim(),
      building_name: buildingName.trim(),
      landmark_or_street: landmark.trim(),
      pin: "123",
    };

    property["property_address"] = property_address;
    props.setPropertyDetails(property);

    if (propertyType.toLowerCase() === "residential") {
      navigation.navigate("ResidentialPropertyDetailsForm");
    } else {
      navigation.navigate("CommercialPropertyDetailsForm");
    }
  };

  const onSelectPlace = (data, details) => {
    console.log("details: ", JSON.stringify(details.geometry.location));
    console.log("details: ", JSON.stringify(details))
    console.log("Lat Long: ", JSON.stringify(details.geometry.location))
    console.log("data: ", JSON.stringify(data))
    // console.log("data: ", JSON.stringify(dataX))

    const gLocation = {
      location: {
        type: "Point",
        coordinates: [details.geometry.location.lng, details.geometry.location.lat]
      },
      main_text: data.structured_formatting.main_text,
      formatted_address: details.formatted_address,
    }

    setGLocation(gLocation);
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: "rgba(245,245,245, 0.2)" }}
    >
      <KeyboardAwareScrollView onPress={Keyboard.dismiss} keyboardShouldPersistTaps="handled">
        <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'} listViewDisplayed={false}>
          <Text style={{ color: "#696969", fontSize: 16, fontWeight: "500", marginBottom: 20 }}>Enter property address details</Text>
          <TextInput
            testID="cityInput"
            label="City*"
            value={city}
            onChangeText={text => setCity(text)}
            onFocus={() => setIsVisible(false)}
            style={{ backgroundColor: "rgba(245,245,245, 0.1)", marginTop: 0 }}
            theme={{
              colors: {
                // placeholder: "white",
                // text: "white",
                primary: "rgba(0,191,255, .9)",
                underlineColor: "transparent",
                background: "#ffffff"
              }
            }}
          />
          <View style={{ marginTop: 25 }} />
          <GooglePlacesAutocomplete
          
            ref={ref}
            placeholder="Add multiple locations within city"
            textInputProps={{
              testID:"GooglePlacesInput",
              placeholderTextColor: 'rgba(90, 90, 90,1)',
              returnKeyType: "search"
            }}
            keyboardShouldPersistTaps='handled'
            minLength={2}
            setAddressText={address}
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: 'en', // language of the results
              components: 'country:in',
              // types: '(cities)'
              // types: ["address","cities", "locality", "sublocality"],
              // types: ["establishment"],
              // fields: ["formatted_address", "geometry", "name"],
              // fields: ["address_components"],
              // types: ["cities", "locality", "sublocality",]
            }}
            // currentLocation={true}
            // predefinedPlaces={selectedLocationArray || []} // Ensure it's always an array
            shouldDisplayPredefinedPlaces={false}
            predefinedPlacesAlwaysVisible={false}
            predefinedPlaces={[homePlace]} // Ensure it's always an array
            isRowScrollable={true}
            fetchDetails={true}
            onPress={(data, details) => onSelectPlace(data, details)}
            onFail={(error) => console.error(error)}
            styles={{
              textInputContainer: {
                // backgroundColor: 'grey',
                color: '#000000',
                // backgroundColor: 'grey',
                // borderLeftWidth: 4,
                // borderRightWidth: 4,
                // height: 70
              },
              textInput: {
                height: 45,
                color: '#000000',
                fontSize: 16,
                borderColor: "#C0C0C0",
                backgroundColor: "rgba(245,245,245, 0.2)",
                // borderLeftWidth: 1,
                // borderRightWidth: 1,
                borderBottomWidth: 1,
                // borderTopWidth: 1
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
            }}
          // this in only required for use on the web. See https://git.io/JflFv more for details.
          />
          {/* <TextInput
            label="Area / Location*"
            value={area}
            onChangeText={text => setArea(text)}
            onFocus={() => setIsVisible(false)}
            style={{ backgroundColor: "rgba(245,245,245, 0.1)", marginTop: 8 }}
            theme={{
              colors: {
                // placeholder: "white",
                // text: "white",
                primary: "rgba(0,191,255, .9)",
                underlineColor: "transparent",
                background: "#ffffff"
              }
            }}
          /> */}
          {props.propertyDetails && props.propertyDetails.property_type && props.propertyDetails.property_type.toLowerCase() === "residential" ?
            <TextInput
              testID="flatNumberInput"
              label="Flat No and Wing*"
              value={flatNumber}
              onChangeText={text => setFlatNumber(text)}
              onFocus={() => setIsVisible(false)}
              style={{ backgroundColor: "rgba(245,245,245, 0.1)", marginTop: 8 }}
              theme={{
                colors: {
                  // placeholder: "white",
                  // text: "white",
                  primary: "rgba(0,191,255, .9)",
                  underlineColor: "transparent",
                  background: "#ffffff"
                }
              }}
            /> : null}

          <TextInput
            testID="buildingNameInput"
            label="Building Name / Society*"
            value={buildingName}
            onChangeText={text => setBuildingName(text)}
            onFocus={() => setIsVisible(false)}
            style={{ backgroundColor: "rgba(245,245,245, 0.1)", marginTop: 8 }}
            theme={{
              colors: {
                // placeholder: "white",
                // text: "white",
                primary: "rgba(0,191,255, .9)",
                underlineColor: "transparent",
                background: "#ffffff"
              }
            }}
          />

          <TextInput
            testID="landmarkInput"
            label="Street / Landmark*"
            value={landmark}
            onChangeText={text => setLandmark(text)}
            onFocus={() => setIsVisible(false)}
            style={{ backgroundColor: "rgba(245,245,245, 0.1)", marginTop: 8 }}
            theme={{
              colors: {
                // placeholder: "white",
                // text: "white",
                primary: "rgba(0,191,255, .9)",
                underlineColor: "transparent",
                backgroundColor: "rgba(245,245,245, 0.1)"
              }
            }}
          />
          <View style={{ marginTop: 20 }}>
            <Button title="NEXT" onPress={() => onSubmit()} />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
      <Snackbar
        visible={isVisible}
        textMessage={errorMessage}
        position={"top"}
        actionHandler={() => dismissSnackBar()}
        actionText="OK"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20
  }
});


const mapStateToProps = state => ({
  userDetails: state.AppReducer.userDetails,
  propertyDetails: state.AppReducer.propertyDetails,
});
const mapDispatchToProps = {
  setPropertyType,
  setPropertyDetails
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalityDetailsForm);

// export default LocalityDetailsForm;
