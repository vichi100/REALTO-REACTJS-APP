import React, { Component } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import RadioButton from "./../../components/RadioButtons";
import { ButtonGroup } from "@rneui/themed";

import { connect } from 'react-redux';
import axios from 'axios';
// import { setUserDetails } from './../../reducers/Action';
// import { SERVER_URL } from './../../utils/Constant';

const options = [
	{
		key: "Residential",
		text: "Residential"
	},
	{
		key: "Commercial",
		text: "Commercial"
	}
];

const PROFILE_ARRAY = ["I am real estate agent and own real estate company",
	"I am real estate agent and works independently",
	"I am employee works in real estate company as real estate agent"]

const ProfileSelection = () => {
	const [selectedOption, setSelectedOption] = React.useState(null);
	const [index, setIndex] = React.useState(null);

	const onSelect = item => {
		if (selectedOption && selectedOption.key === item.key) {
			setSelectedOption(null);
		} else {
			setSelectedOption(item);
		}
	};

	const updateIndex = index => {
		setIndex(index);
	};

	return (
		<View style={styles.container}>
			<Text>Select Property Type</Text>
			<RadioButton
				selectedOption={selectedOption}
				onSelect={onSelect}
				options={options}
			/>

			<ButtonGroup
				selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
				onPress={updateIndex}
				selectedIndex={index}
				buttons={PROFILE_ARRAY}
				// containerStyle={{ height: 30 }}
				textStyle={{ textAlign: "center" }}
				selectedTextStyle={{ color: "#fff" }}
				containerStyle={{ borderRadius: 10, width: 300 }}
				containerBorderRadius={10}
				vertical={true}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	}
});


const mapStateToProps = (state) => ({
	userMobileNumber: state.AppReducer.userMobileNumber,
	country: state.AppReducer.country,
	countryCode: state.AppReducer.countryCode
});
const mapDispatchToProps = {
	setUserDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSelection);

// export default ProfileSelection;
