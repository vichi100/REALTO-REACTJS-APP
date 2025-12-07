import React, { useState, useEffect, useRef } from 'react';
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	ScrollView,
	TextInput,
	Image,
	TouchableOpacity,
	AsyncStorage,
	ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import Counter from '../common/Counter';
import axios from 'axios';
import { setUserDetails } from './../../reducers/Action';
import { OtpInput } from "react-native-otp-entry";
// (legacy OTP input components removed — using `react-native-otp-entry` now)
import { SERVER_URL } from './../../utils/Constant';
import { en } from 'react-native-paper-dates';

const OtpScreen = (props) => {
	const { navigation, userDetails } = props;
	const { needToEnterOTP: initialNeedToEnterOTP = false } = props.route.params; // Get initial value from route params
  const [needToEnterOTP, setNeedToEnterOTP] = useState(initialNeedToEnterOTP); // Manage as state
  
	const [otp, setOTP] = useState(null);
	const otpInput = useRef(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Navigate to BottomTabScreen only after userDetails is set
		console.log("userDetails changed:", userDetails);
		if (!needToEnterOTP && userDetails) {
		  navigation.navigate("BottomTabScreen");
		}
	  }, [userDetails, needToEnterOTP]); // Triggered when userDetails changes

	useEffect(() => {
		setLoading(true);
		const otpX = "999999";//Math.floor(Math.random() * 900000) + 100000;
		const mobileX = props.userMobileNumber;
		generateOTP(otpX, mobileX);
	}, []);

	const resendOTP = () => {
		const mobileX = props.countryCode + props.userMobileNumber;
		generateOTP(otp, mobileX);
	};

	const generateOTP = (otpX, mobileX) => {
		setOTP(otpX);
		console.log('otp: ', otpX);
		const obj = {
			mobile: mobileX,
			otp: otpX
		};
		axios
			.post(
				SERVER_URL + '/generateOTP',
				obj
			)
			.then(
				(response) => {
					console.log(response.data);
					setLoading(false);
				},
				(error) => {
					console.log(error);
				}
			);
	};

	const handleSubmit = (code) => {
		console.log(code);
		if (code === otp.toString()) {
			onSubmit();
		}
	};
	const onSubmit = () => {
		const mobileX = props.countryCode + props.userMobileNumber;
		console.log('onSubmit: ', mobileX);
		const userObj = {
			mobile: mobileX,
			country: props.country,
			country_code: props.countryCode
		};
		axios
			.post(
				SERVER_URL + '/getUserDetails',
				userObj
			)
			.then(
				(response) => {
					console.log('response: ' + JSON.stringify(response));
					console.log('response.data: ' + JSON.stringify(response.data));
					save(response.data);
					// navigation.navigate('BottomTabScreen');
				},
				(error) => {
					console.log(error);
				}
			);
	};

	const save = (userData) => {
		console.log('userData: ' + JSON.stringify(userData));
		setNeedToEnterOTP(false); // Update state
		props.setUserDetails(userData);
		
		// await AsyncStorage.setItem('user_details', JSON.stringify(userData));

	};

	const onSkip = () => {
		navigation.navigate('BottomTabScreen');
	};

	return loading ? (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'rgba(0,0,0, .9)'
			}}
		>
			<ActivityIndicator animating size="large" color={'#fff'} />
			{/* <ActivityIndicator animating size="large" /> */}
		</View>
	) : (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<ScrollView>
				<View
					style={{
						marginTop: 50,
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Text style={{ color: '#000000', fontSize: 18, fontWeight: '500' }}>OTP Sent To Mobile</Text>
					<Text style={{ color: '#696969', fontSize: 16, fontWeight: '500', marginTop: 10 }}>
						{props.countryCode + ' ' + props.userMobileNumber}
					</Text>
				</View>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						// width: '100%',
						marginLeft: 15,
						marginRight: 15,
						marginTop: 40
					}}
				>
					{/* <OTPTextView
						handleTextChange={(e) => {
							handleSubmit(e);
						}}
						// containerStyle={{ marginBottom: 20 }}
						// textInputStyle={{
						// 	borderRadius: 10,
						// 	borderWidth: 4
						// }}
						inputCount={6}
						inputCellLength={1}
					/> */}

					<OtpInput
						numberOfDigits={6}
						focusColor="green"
						autoFocus={false}
						hideStick={true}
						  placeholder="******"
						blurOnFilled={true}
						disabled={false}
						type="numeric"
						secureTextEntry={false}
						focusStickBlinkingDuration={500}
						onFocus={() => console.log("Focused")}
						onBlur={() => console.log("Blurred")}
						onTextChange={(text) => console.log(text)}
						//   onFilled={(text) => console.log(`OTP is ${text}`)}
						onFilled={(text) => {
							console.log(`Code is ${text}, you are good to go!`);
							handleSubmit(text);
						}}
						textInputProps={{
							accessibilityLabel: "One-Time Password",
						}}

					/>
				</View>

				<View style={{ margin: 20 }}>
					{/* <Text>Resend OTP in </Text> */}
					<Counter resendOTP={resendOTP} />
					{/* <Text>s</Text> */}
					{/* <Button title="NEXT" onPress={() => onSubmit()} /> */}
				</View>
			</ScrollView>
			<View style={{ position: 'absolute', bottom: 15, right: 15 }}>
				<TouchableOpacity onPress={() => onSkip()}>
					<Text style={{ color: '#000000' }}>{'Skip >>'}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const mapStateToProps = (state) => ({
	userDetails: state.AppReducer.userDetails,
	country: state.AppReducer.country,
	countryCode: state.AppReducer.countryCode,
	userMobileNumber: state.AppReducer.userMobileNumber
});
const mapDispatchToProps = {
	setUserDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(OtpScreen);
// export default OtpScreen; XXXXXX is your OTP for mobile verification at Flick Sick
