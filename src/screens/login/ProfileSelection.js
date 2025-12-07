import React from "react";
import RadioButton from "./../../components/RadioButtons"; // Assuming this is converted or compatible
import { ButtonGroup } from "@rneui/themed";
import { connect } from 'react-redux';
import { setUserDetails } from './../../reducers/Action';

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
        <div style={styles.container}>
            <p>Select Property Type</p>
            <RadioButton
                selectedOption={selectedOption}
                onSelect={onSelect}
                options={options}
            />

            <div style={{ width: 300, marginTop: 20 }}>
                {PROFILE_ARRAY.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => updateIndex(idx)}
                        style={{
                            padding: 10,
                            backgroundColor: index === idx ? "rgba(27, 106, 158, 0.85)" : "#fff",
                            color: index === idx ? "#fff" : "#000",
                            border: '1px solid #ccc',
                            marginBottom: 5,
                            borderRadius: 5,
                            cursor: 'pointer',
                            textAlign: 'center'
                        }}
                    >
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        display: 'flex',
        flexDirection: 'column',
        height: '100vh'
    }
};


const mapStateToProps = (state) => ({
    userMobileNumber: state.AppReducer.userMobileNumber,
    country: state.AppReducer.country,
    countryCode: state.AppReducer.countryCode
});
const mapDispatchToProps = {
    setUserDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSelection);
