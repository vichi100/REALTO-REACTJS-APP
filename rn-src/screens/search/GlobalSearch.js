import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Modal,
  TouchableHighlight,
  FlatList,
  Image
} from "react-native";
import { TextInput, HelperText, useTheme } from "react-native-paper";
import Button from "./../../components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Snackbar from "./../../components/SnackbarComponent";
import CustomButtonGroup from "./../../components/CustomButtonGroup";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SERVER_URL, GOOGLE_PLACES_API_KEY } from "./../../utils/Constant";
import Slider from "./../../components/Slider";
import { connect } from "react-redux";
import {
  setPropertyType, setPropertyDetails, setCustomerDetails, setResidentialPropertyList,
  setAnyItemDetails, setGlobalSearchResult
} from "./../../reducers/Action";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AppConstant from "./../../utils/AppConstant";

import axios from "axios";
import SliderCr from "./../../components/SliderCr";
import ModalActivityIndicator from 'react-native-modal-activityindicator';

const homePlace = { description: 'Mumbai', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };

const propertyTypeArray = ["Residential", "Commercial"];
const assetTypeArray = ["Property", "Customer"];
const whatTypeOptions = [
  { text: 'Residential' },
  { text: 'Commercial' },
];

const lookingForOptions = [
  { text: 'Property' },
  { text: 'Customer' },
];

const porposeForOptions = [
  { text: 'Rent' },
  { text: 'Buy' },
];

const bhkOption = [
  { text: '1RK' },
  { text: '1BHK' },
  { text: '2BHK' },
  { text: '3BHK' },
  { text: '4+BHK' },
];
const reqWithinOptions = [
  { text: '7 Days' },
  { text: '15 Days' },
  { text: '30 Days' },
  { text: '60 Days' },
  { text: '60+ Days' },
];

const tenantOptions = [
  { text: 'Any' },
  { text: 'Family' },
  { text: 'Bachelors' },
];

const buildingTypeOption = [
  { text: 'Mall' },
  { text: 'Businesses Park' },
  { text: 'StandAlone' },
  { text: 'Industrial' },
  { text: 'Shopping Complex' },
  { text: 'Commersial Complex' },
];

const requiredForOption = [
  { text: 'Shop' },
  { text: 'Office' },
  { text: 'Showroom' },
  { text: ' Restaurant/Cafe' },
  { text: 'Pub/Night Club' },
  { text: 'Clinic' },
  { text: 'Godown' },
];

const GlobalSearch = props => {
  const ref = useRef();
  const { navigation } = props;

  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState(null);
  const [gLocation, setGLocation] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [propertyForIndex, setPropertyForIndex] = useState(-1);
  const [selectedPropType, setSelectedPropType] = useState(null);
  const [data, setData] = useState([]);

  const [selectedLocationArray, setSelectedLocationArray] = useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState([]);
  const [lookingFor, setLookingFor] = useState("Property");
  const [whatType, setWhatType] = useState("Residential");
  const [purpose, setPurpose] = useState("Rent");
  const [selectedBHK, setSelectedBHK] = useState(["1RK"]);
  const [selectedRequiredFor, setSelectedRequiredFor] = useState(["Shop"]);
  const [selectedBuildingType, setSelectedBuildingType] = useState(["Mall"]);
  const [priceRange, setPriceRange] = useState([]);
  const [priceRangeCr, setPriceRangeCr] = useState([1000000, 50000000]);
  const [reqWithin, setReqWithin] = useState("7 Days");
  const [tenant, setTenant] = useState("Any");
  const [query, setQuery] = useState("I am looking for a Property for a Residential property to Rent");

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const updateQuery = useCallback(() => {
    // let newQuery = `I am looking for a ${lookingFor.toLowerCase()} for a ${whatType.toLowerCase()} purpose`;
    let newQuery = `I am looking for a ${lookingFor.toLowerCase()} `;

    if (purpose && lookingFor.toLowerCase() === "customer") {
      console.log("purpose: ", purpose);
      newQuery += `to ${purpose.toLowerCase()} a ${whatType.toLowerCase()} property for`;
    } else if (purpose && lookingFor.toLowerCase() === "property") {
      newQuery += `to ${purpose.toLowerCase()}`;
    }

    if (whatType.toLowerCase() === "residential") {
      if (selectedBHK.length > 0) {
        newQuery += ` ${selectedBHK.join(', ')}`;
      }
      if (tenant) {
        // newQuery += ` for ${tenant} tenants`;
      }
    } else if (whatType.toLowerCase() === "commercial") {
      if (selectedRequiredFor.length > 0) {
        newQuery += `  ${selectedRequiredFor.join(', ')}`;
      }
      if (selectedBuildingType.length > 0) {
        newQuery += ` in building type ${selectedBuildingType.join(', ')}`;
      }
    }

    if (reqWithin) {
      newQuery += ` within ${reqWithin}`;
    }

    setQuery(newQuery);
  }, [lookingFor, whatType, purpose, selectedBHK, selectedRequiredFor, selectedBuildingType, reqWithin, tenant]);

  useEffect(() => {
    updateQuery();
  }, [lookingFor, whatType, purpose, selectedBHK, selectedRequiredFor, selectedBuildingType, reqWithin, tenant, updateQuery]);

  const onSelectPropType = item => {
    console.log(1);
    if (selectedPropType && selectedPropType.key === item.key) {
      setSelectedPropType(null);
    } else {
      setSelectedPropType(item);
    }
    // The logic below seems redundant given the updateQuery useEffect
    // if (index === 0) {
    //   setQuery("I want a residential property ");
    // } else if (index === 1) {
    //   setQuery("I am looking for a customer for residential property ");
    // }
    setIsVisible(false);
  };

  const selectPropertyForIndex = index => {
    setPropertyForIndex(index);
    setIsVisible(false);
    // The logic below seems redundant given the updateQuery useEffect
    // if (index === 0) {
    //   setQuery(`I am looking for a ${lookingFor.toLowerCase()} `);
    // } else if (index === 1) {
    //   setQuery(`I am looking for a ${lookingFor.toLowerCase()} `);
    // }
  };

  const dismissSnackBar = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    // console.log("useEffect");
  }, []);

  const login = async () => {
    navigation.navigate("Login");
    setModalVisible(false);
  }

  const onSubmit = () => {
    if (city.trim() === "") {
      setErrorMessage("City is missing");
      setIsVisible(true);
      return;
    }

    if (selectedLocationArray.length === 0) {
      setErrorMessage("Please add a location of your city");
      setIsVisible(true);
      return;
    }

    if (props.userDetails === null) {
      console.log("You are not logged in, please login");
      setModalVisible(true);
      return;
    }

    const match = reqWithin.match(/\d+/); // Find the number in the string
    const daysFromReqWithin = match ? parseInt(match[0], 10) : null; // Convert to integer and return
    console.log("daysFromReqWithin: ", daysFromReqWithin);
    const today = new Date(); // Get today's date
    today.setDate(today.getDate() + daysFromReqWithin);

    // setLoading(true); // Uncomment to enable loading indicator

    const queryObject = {
      req_user_id: props.userDetails?.works_for,
      city: city.trim(),
      selectedLocationArray: selectedLocationArray,
      lookingFor: lookingFor,
      whatType: whatType,
      purpose: purpose,
      selectedBHK: selectedBHK,
      selectedRequiredFor: selectedRequiredFor,
      selectedBuildingType: selectedBuildingType,
      priceRange: priceRange,
      priceRangeCr: priceRangeCr,
      reqWithin: today,
      tenant: tenant
    };
    axios(SERVER_URL + "/getGlobalSearchResult", {
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: queryObject
    }).then(
      response => {
        console.log("response.data:      ", response.data);
        response.data.forEach(item => {
          if (Array.isArray(item.image_urls)) { // Ensure image_urls is an array
            item.image_urls.forEach(image => {
              image.url = SERVER_URL + image.url;
            });
          } else {
            console.warn("image_urls is not an array for item:", item);
          }
        });
        setData(response.data);
        props.setGlobalSearchResult(response.data);
        if (lookingFor.toLowerCase() === "Property".toLowerCase()) {
          if (whatType.toLowerCase() === "Residential".toLowerCase()) {
            navigation.navigate("GlobalResidentialPropertySearchResult", {
              searchGlobalResult: searchGlobalResult
            });
          } else if (whatType.toLowerCase() === "Commercial".toLowerCase()) {
            navigation.navigate("GlobalCommercialPropertySearchResult", {
              searchGlobalResult: searchGlobalResult
            });
          }
        } else if (lookingFor.toLowerCase() == "Customer".toLowerCase()) {
          if (whatType.toLowerCase() === "Residential".toLowerCase()) {
            navigation.navigate("GlobalResidentialContactsSearchResult", {
              searchGlobalResult: searchGlobalResult
            });
          } else if (whatType.toLowerCase() === "Commercial".toLowerCase()) {
            navigation.navigate("GlobalCommercialCustomersSearchResult", {
              searchGlobalResult: searchGlobalResult
            });
          }
        }
      },
      error => {
        console.log(error);
        // setLoading(false); // Uncomment to hide loading indicator on error
      }
    );
  };


  const searchGlobalResult = () => {
    if (city.trim() === "") {
      setErrorMessage("City is missing");
      setIsVisible(true);
      return;
    }

    if (selectedLocationArray.length === 0) {
      setErrorMessage("Please add a location of your city");
      setIsVisible(true);
      return;
    }

    if (props.userDetails === null) {
      console.log("You are not logged in, please login");
      setModalVisible(true);
      return;
    }

    const match = reqWithin.match(/\d+/); // Find the number in the string
    const daysFromReqWithin = match ? parseInt(match[0], 10) : null; // Convert to integer and return
    console.log("daysFromReqWithin: ", daysFromReqWithin);
    const today = new Date(); // Get today's date
    today.setDate(today.getDate() + daysFromReqWithin);

    // setLoading(true); // Uncomment to enable loading indicator

    const queryObject = {
      req_user_id: props.userDetails?.works_for,
      city: city.trim(),
      selectedLocationArray: selectedLocationArray,
      lookingFor: lookingFor,
      whatType: whatType,
      purpose: purpose,
      selectedBHK: selectedBHK,
      selectedRequiredFor: selectedRequiredFor,
      selectedBuildingType: selectedBuildingType,
      priceRange: priceRange,
      priceRangeCr: priceRangeCr,
      reqWithin: today,
      tenant: tenant
    };
    axios(SERVER_URL + "/getGlobalSearchResult", {
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: queryObject
    }).then(
      response => {
        console.log("response.data:      ", response.data);
        response.data.forEach(item => {
          if (Array.isArray(item.image_urls)) { // Ensure image_urls is an array
            item.image_urls.forEach(image => {
              image.url = SERVER_URL + image.url;
            });
          } else {
            console.warn("image_urls is not an array for item:", item);
          }
        });
        setData(response.data);
        props.setGlobalSearchResult(response.data);
        // if (lookingFor.toLowerCase() === "Property".toLowerCase()) {
        //   if (whatType.toLowerCase() === "Residential".toLowerCase()) {
        //     navigation.navigate("GlobalResidentialPropertySearchResult");
        //   } else if (whatType.toLowerCase() === "Commercial".toLowerCase()) {
        //     navigation.navigate("GlobalCommercialPropertySearchResult");
        //   }
        // } else if (lookingFor.toLowerCase() == "Customer".toLowerCase()) {
        //   if (whatType.toLowerCase() === "Residential".toLowerCase()) {
        //     navigation.navigate("GlobalResidentialContactsSearchResult");
        //   } else if (whatType.toLowerCase() === "Commercial".toLowerCase()) {
        //     navigation.navigate("GlobalCommercialCustomersSearchResult");
        //   }
        // }
      },
      error => {
        console.log(error);
        // setLoading(false); // Uncomment to hide loading indicator on error
      }
    );
  };


  const onSelectPlace = (data, details) => {
    console.log("details: ", JSON.stringify(details))
    console.log("Lat Long: ", JSON.stringify(details.geometry.location))
    console.log("data: ", JSON.stringify(data))
    const gLocation = {
      location: {
        type: "Point",
        coordinates: [details.geometry.location.lng, details.geometry.location.lat]
      },
      main_text: data.structured_formatting.main_text
    }
    setSelectedLocationArray([...selectedLocationArray, gLocation])
    setGLocation(gLocation);
    ref.current?.setAddressText('');
  }

  const removeLocation = loc => {
    console.log("remove", JSON.stringify(loc));
    const arr = (selectedLocationArray || []).filter(item => item.main_text !== loc.main_text);
    setSelectedLocationArray(arr);
  };

  const selectBHK = (index, button) => {
    let newSelectedIndicesBHK;
    newSelectedIndicesBHK = [...selectedBHK];
    if (newSelectedIndicesBHK.includes(button.text)) {
      newSelectedIndicesBHK.splice(newSelectedIndicesBHK.indexOf(button.text), 1);
    } else {
      newSelectedIndicesBHK.push(button.text);
    }
    setSelectedBHK(newSelectedIndicesBHK);
    console.log(`newSelectedIndices: ${newSelectedIndicesBHK}`);
    // Query update is handled by useEffect after state change
  }

  const selectWhatYouLookingFor = (index, button) => {
    console.log(`Button pressed: ${button.text} (Index: ${index})`);
    setLookingFor(button.text);
    // Query update is handled by useEffect after state change
  }

  const selectWhatType = (index, button) => {
    console.log(`Button pressed: ${button.text} (Index: ${index})`);
    setWhatType(button.text);
    // Query update is handled by useEffect after state change
  }

  const handlePriceRangeChange = useCallback((values) => {
    setPriceRange(values);
  }, []);

  const handlePriceRangeChangeCr = useCallback((values) => {
    setPriceRangeCr(values);
  }, []);

  const renderSelectedLocation = ({ item }) => {
    console.log(JSON.stringify(item));
    return (
      <TouchableOpacity onPress={() => removeLocation(item)} style={{ backgroundColor: "#66CDAA", width: 100, borderRadius: 20, marginLeft: 10 }}>
        <Text numberOfLines={1} style={{ margin: 10, width: 70, overflow: "hidden" }}>{item.main_text}</Text>
        <Text style={{ color: "red", position: "absolute", right: 10, top: 8, marginLeft: 10, fontSize: 16 }}>x</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: "rgba(245,245,245, 0.2)" }}
    >
      {/* <View style={{ margin: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'centerßßßß' }}>
        <Image
          source={require('../../../assets/images/home.png')} // Path to your image
          style={{
            width: 45, height: 45, position: "absolute",
            left: "2%",
          }}
        />
        <Text style={{ padding: 10, textAlign: 'center', fontSize: 24, fontWeight: '500' }}>GLocal Search</Text>
        <View style={{ position: "absolute", right: "2%" }}>
          <MaterialCommunityIcons name="heart-outline" color={"rgb(137, 135, 135)"} size={30} />
        </View>
      </View> */}
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <View style={{ margin: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={require('../../../assets/images/home.png')} // Path to your image
            style={{
              width: 45, height: 45, position: "absolute",
              left: "2%",
            }}
          />
          <Text style={{ padding: 10, textAlign: 'center', fontSize: 24, fontWeight: '500' }}>GLocal Search</Text>
          <View style={{ position: "absolute", right: "2%" }}>
            <MaterialCommunityIcons name="heart-outline" color={"rgb(137, 135, 135)"} size={30} />
          </View>
        </View>
        <View style={{
          flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
          backgroundColor: 'rgba(63, 195, 128, .2)',
        }}>
          <Text style={{ marginTop: 15, marginBottom: 15, marginLeft: 10, marginRight: 10, fontSize: 16 }}>Hi, {query}</Text>
        </View>
      </View>

      <KeyboardAwareScrollView onPress={Keyboard.dismiss} keyboardShouldPersistTaps="handled">

        <TextInput
          label="City where you want to search*"
          placeholder="Enter city where customer wants property"
          value={city}
          onChangeText={text => setCity(text)}
          onFocus={() => setIsVisible(false)}
          style={{ backgroundColor: "rgba(245,245,245, 0.1)", marginTop: 0 }}
          theme={{
            colors: {
              primary: "rgba(0,191,255, .9)",
              underlineColor: "transparent",
              background: "#ffffff"
            }
          }}
        />
        <View style={{ marginTop: 20 }} />
        <GooglePlacesAutocomplete
          ref={ref}
          placeholder="Add multiple locations within city"
          textInputProps={{
            placeholderTextColor: 'rgba(90, 90, 90,1)',
            returnKeyType: "search"
          }}
          keyboardShouldPersistTaps='handled'
          minLength={2}
          setAddressText={address}
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: 'en',
            components: 'country:in',
          }}
          shouldDisplayPredefinedPlaces={false}
          predefinedPlacesAlwaysVisible={false}
          predefinedPlaces={[homePlace]}
          isRowScrollable={true}
          fetchDetails={true}
          onPress={(data, details) => onSelectPlace(data, details)}
          onFail={(error) => console.error(error)}
          styles={{
            textInputContainer: {
              color: '#000000',
            },
            textInput: {
              height: 45,
              color: '#000000',
              fontSize: 16,
              borderColor: "#C0C0C0",
              backgroundColor: "rgba(245,245,245, 0.2)",
              borderBottomWidth: 1,
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
        />
        <View style={{ marginTop: 5 }} />
        <FlatList
          horizontal
          style={{ flex: 1 }}
          data={selectedLocationArray || []}
          renderItem={(item) => renderSelectedLocation(item)}
          keyExtractor={(item, index) => index.toString()}
        />



        <View style={{ marginTop: 15, alignContent: "flex-start" }}>
          <Text style={{ padding: 10, backgroundColor: "rgba(229, 228, 226, .6)" }}>What you are looking for</Text>
        </View>
        <View style={[{ marginBottom: 10, marginTop: 15 }]}>
          <CustomButtonGroup
            buttons={lookingForOptions}
            accessibilityLabelId="looking_for"
            selectedIndices={[lookingForOptions.findIndex(option => option.text === lookingFor)]}
            isMultiSelect={false}
            buttonStyle={{ backgroundColor: '#fff' }}
            selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
            buttonTextStyle={{ color: '#000' }}
            selectedButtonTextStyle={{ color: '#000' }}
            onButtonPress={(index, button) => {
              selectWhatYouLookingFor(index, button);
            }}
          />
        </View>

        <View style={styles.header}>
          <Text style={{ padding: 10, backgroundColor: "rgba(229, 228, 226, .6)" }}>What type</Text>
        </View>
        <View style={[{ marginBottom: 10, marginTop: 15 }]}>
          <CustomButtonGroup
            buttons={whatTypeOptions}
            accessibilityLabelId="what_type"
            selectedIndices={[whatTypeOptions.findIndex(option => option.text === whatType)]}
            isMultiSelect={false}
            buttonStyle={{ backgroundColor: '#fff' }}
            selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
            buttonTextStyle={{ color: '#000' }}
            selectedButtonTextStyle={{ color: '#000' }}
            onButtonPress={(index, button) => {
              selectWhatType(index, button);
            }}
          />
        </View>

        <View style={styles.header}>
          <Text style={{ padding: 10, backgroundColor: "rgba(229, 228, 226, .6)" }}>What is purpose</Text>
        </View>
        <View style={[styles.propSubSection, { marginBottom: 10, marginTop: 15 }]}>
          <CustomButtonGroup
            buttons={porposeForOptions}
            accessibilityLabelId="porpose_for"
            selectedIndices={[porposeForOptions.findIndex(option => option.text === purpose)]}
            isMultiSelect={false}
            buttonStyle={{ backgroundColor: '#fff' }}
            selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
            buttonTextStyle={{ color: '#000' }}
            selectedButtonTextStyle={{ color: '#000' }}
            onButtonPress={(index, button) => {
              console.log(`Button pressed: ${button.text} (Index: ${index})`);
              setPurpose(button.text);
              // Query update is handled by useEffect after state change
            }}
          />
        </View>

        {whatType.toLocaleLowerCase() === "Residential".toLocaleLowerCase() ? (<View>
          <View style={styles.header}>
            <Text style={{ padding: 10, backgroundColor: "rgba(229, 228, 226, .6)" }}>BHK Size</Text>
          </View>
          <View style={[{ marginBottom: 10, marginTop: 15 }]}>
            <CustomButtonGroup
              buttons={bhkOption}
              accessibilityLabelId="bhk_type"
              isMultiSelect={true}
              buttonStyle={{ backgroundColor: '#fff' }}
              selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
              buttonTextStyle={{ color: '#000' }}
              selectedButtonTextStyle={{ color: '#000' }}
              selectedIndices={selectedBHK.map((item) =>
                bhkOption.findIndex((option) => option.text === item)
              )}
              onButtonPress={(index, button) => {
                selectBHK(index, button);
              }}
            />
          </View>
        </View>) : (<View>
          <View style={styles.header}>
            <Text style={{ padding: 10, backgroundColor: "rgba(229, 228, 226, .6)" }}>Required For</Text>
          </View>
          <View style={[{ marginBottom: 10, marginTop: 15 }]}>
            <CustomButtonGroup
              buttons={requiredForOption}
              accessibilityLabelId="required_for"
              isMultiSelect={true}
              buttonStyle={{ backgroundColor: '#fff' }}
              selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
              buttonTextStyle={{ color: '#000' }}
              selectedButtonTextStyle={{ color: '#000' }}
              selectedIndices={selectedRequiredFor.map((item) =>
                requiredForOption.findIndex((option) => option.text === item)
              )}
              onButtonPress={(index, button) => {
                let newSelectedIndicesRequiredFor = [];
                newSelectedIndicesRequiredFor = [...selectedRequiredFor];
                if (newSelectedIndicesRequiredFor.includes(button.text)) {
                  newSelectedIndicesRequiredFor.splice(newSelectedIndicesRequiredFor.indexOf(button.text), 1);
                } else {
                  newSelectedIndicesRequiredFor.push(button.text);
                }
                setSelectedRequiredFor(newSelectedIndicesRequiredFor);
                console.log(`newSelectedIndices: ${newSelectedIndicesRequiredFor}`);
                // Query update is handled by useEffect after state change
              }}
            />
          </View>

          <View style={styles.header}>
            <Text style={{ padding: 10, backgroundColor: "rgba(229, 228, 226, .6)" }}>Building type</Text>
          </View>
          <View style={[{ marginBottom: 10, marginTop: 15 }]}>
            <CustomButtonGroup
              buttons={buildingTypeOption}
              accessibilityLabelId="building_type"
              isMultiSelect={true}
              buttonStyle={{ backgroundColor: '#fff' }}
              selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
              buttonTextStyle={{ color: '#000' }}
              selectedButtonTextStyle={{ color: '#000' }}
              selectedIndices={selectedBuildingType.map((item) =>
                buildingTypeOption.findIndex((option) => option.text === item)
              )}
              onButtonPress={(index, button) => {
                let newSelectedIndicesBuildingType = [];
                newSelectedIndicesBuildingType = [...selectedBuildingType];
                if (newSelectedIndicesBuildingType.includes(button.text)) {
                  newSelectedIndicesBuildingType.splice(newSelectedIndicesBuildingType.indexOf(button.text), 1);
                } else {
                  newSelectedIndicesBuildingType.push(button.text);
                }
                setSelectedBuildingType(newSelectedIndicesBuildingType);
                console.log(`newSelectedIndices: ${newSelectedIndicesBuildingType}`);
                // Query update is handled by useEffect after state change
              }}
            />
          </View>
        </View>)}

        <View style={[styles.header, { marginBottom: 20 }]}>
          <Text style={{ padding: 10, backgroundColor: "rgba(229, 228, 226, .6)" }}>Price Range</Text>
        </View>
        {purpose === "Rent" ? <Slider
          min={10000}
          max={400000}
          onSlide={handlePriceRangeChange}
        /> :
          <SliderCr
            min={1000000}
            max={50000000}
            onSlide={handlePriceRangeChangeCr}
          />
        }

        <View style={styles.header}>
          <Text style={{ padding: 10, backgroundColor: "rgba(229, 228, 226, .6)" }}>Required with in</Text>
        </View>
        <View style={[{ marginBottom: 10, marginTop: 15 }]}>
          <CustomButtonGroup
            buttons={reqWithinOptions}
            accessibilityLabelId="req_within"
            selectedIndices={[reqWithinOptions.findIndex(option => option.text === reqWithin)]}
            isMultiSelect={false}
            buttonStyle={{ backgroundColor: '#fff' }}
            selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
            buttonTextStyle={{ color: '#000' }}
            selectedButtonTextStyle={{ color: '#000' }}
            onButtonPress={(index, button) => {
              console.log(`Button pressed: ${button.text} (Index: ${index})`);
              setReqWithin(button.text);
              // Query update is handled by useEffect after state change
            }}
          />
        </View>

        {whatType.toLowerCase() === "Residential".toLowerCase() ? (<View>
          <View style={styles.header}>
            <Text style={{ padding: 10, backgroundColor: "rgba(229, 228, 226, .6)" }}>Preferd Tenants</Text>
          </View>
          <View style={[{ marginBottom: 5, marginTop: 15 }]}>
            <CustomButtonGroup
              buttons={tenantOptions}
              accessibilityLabelId="tenant_type"
              selectedIndices={[tenantOptions.findIndex(option => option.text === tenant)]}
              isMultiSelect={false}
              buttonStyle={{ backgroundColor: '#fff' }}
              selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
              buttonTextStyle={{ color: '#000' }}
              selectedButtonTextStyle={{ color: '#000' }}
              onButtonPress={(index, button) => {
                console.log(`Button pressed: ${button.text} (Index: ${index})`);
                setTenant(button.text);
                // Query update is handled by useEffect after state change
              }}
            />
          </View>
        </View>) : (<View></View>)}
      </KeyboardAwareScrollView>

      <View style={[{ flexDirection: "column", }]}>
        <View
          style={{
            marginBottom: 5,
            marginLeft: 10,
            marginRight: 10
          }}
        >
          <Button title="Search" onPress={() => onSubmit()} />
        </View>
      </View>

      <ModalActivityIndicator visible={loading} size='large' color='#A9A9A9' />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView1}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              You are not logged in, please login.
            </Text>
            <View
              style={{
                position: "absolute",
                flexDirection: "row",
                right: 0,
                bottom: 0,
                marginTop: 20,
                marginBottom: 20,
                padding: 20
              }}
            >
              <TouchableHighlight
                style={{ ...styles.cancelButton }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.applyButton }}
                onPress={() => {
                  login();
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Login</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>

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
    marginRight: 20,
    marginBottom: 60,
  },
  header: {
    alignContent: "flex-start",
    marginTop: 10
  },
  propSection: {
    marginTop: 20
  },
  propSubSection: {
    marginBottom: 10,
    marginLeft: 10
  },
  customButton: {
    backgroundColor: '#ffffff',
  },
  customSelectedButton: {
    backgroundColor: 'rgba(0, 163, 108, .2)',
    borderColor: 'rgba(0, 163, 108, .9)'
  },
  customButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  customSelectedButtonText: {
    color: '#0000000',
  },
  customButtonImage: {
    width: 30,
    height: 30,
  },
  customContainer: {
    padding: 10,
  },
  customToggleContainer: {
    marginBottom: 10,
  },
  customSelectedText: {
    color: 'green',
    fontSize: 18,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  centeredView1: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    marginTop: 22,
    marginBottom: 20
  },
  modalView: {
    margin: 20,
    height: 150,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  applyButton: {
    marginLeft: 10,
    marginRight: 10
  },
  cancelButton: {
    marginLeft: 10,
    marginRight: 30
  },
  modalText: {
    marginBottom: 16,
    fontWeight: "600",
    textAlign: "center"
  },
});

const mapStateToProps = state => ({
  userDetails: state.AppReducer.userDetails,
  propertyDetails: state.AppReducer.propertyDetails,
  customerDetails: state.AppReducer.customerDetails
});
const mapDispatchToProps = {
  setPropertyType,
  setPropertyDetails,
  setCustomerDetails,
  setResidentialPropertyList,
  setGlobalSearchResult
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalSearch);