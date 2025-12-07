import React, { useState, useEffect } from "react";
import { setEmployeeList } from "./../../reducers/Action";
import { connect } from "react-redux";
import axios from "axios";
import { SERVER_URL } from "./../../utils/Constant";
import { IoMdRemoveCircleOutline, IoMdCall } from "react-icons/io";
import { Avatar } from "@rneui/themed";

const EmployeeAccess = props => {
    const [isReadEnabled, setIsReadEnabled] = useState(false);
    const [isEditEnabled, setIsEditEnabled] = useState(false);

    useEffect(() => {
        if (props.item.access_rights === "read") {
            setIsReadEnabled(true);
        }

        if (props.item.access_rights === "edit") {
            setIsEditEnabled(true);
        }
    }, []);

    const makeCall = mobile => {
        window.open(`tel:${mobile}`);
    };

    const removeEmployee = empIdToBeRemoved => {
        const user = {
            req_user_id: props.userDetails.works_for,
            agent_id: props.userDetails.works_for,
            employee_id: empIdToBeRemoved
        };
        axios(SERVER_URL + "/removeEmployee", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: user
        }).then(
            response => {
                if (response.data === "success") {
                    const x = props.employeeList.filter(function (el) {
                        return el.id !== empIdToBeRemoved;
                    });
                    props.setEmployeeList([...x]);
                }
            },
            error => {
            }
        );
    };

    const updateEmployeeEditRights = employeeId => {
        const user = {
            req_user_id: props.userDetails.works_for,
            employee_id: employeeId,
            access_rights: isEditEnabled ? "read" : "edit"
        };
        axios(SERVER_URL + "/updateEmployeeEditRights", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: user
        }).then(
            response => {
                if (response.data === "success") {
                    setIsEditEnabled(!isEditEnabled);
                }
            },
            error => {
            }
        );
    };

    return props.userDetails.id === props.item.id ? null : (
        <div
            style={{
                flex: 1,
                marginTop: 2,
                padding: 10,
                backgroundColor: "#FFF",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
            >
                <Avatar
                    rounded
                    size={60}
                    title={props.item.name && props.item.name.slice(0, 1)}
                    activeOpacity={0.7}
                    titleStyle={{ color: "rgba(105,105,105, .9)" }}
                    source={{
                        uri: props.item.photo
                    }}
                    avatarStyle={{
                        borderWidth: 1,
                        borderColor: "rgba(127,255,212, .9)",
                        borderStyle: "solid"
                    }}
                />
                <div style={{ alignItems: "left", marginLeft: 15, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: "bold", textAlign: "left" }}>
                                {props.item.name}
                            </span>
                            <span style={{ fontSize: 12, textAlign: "left" }}>
                                +91 {props.item.mobile}
                            </span>
                        </div>
                        <div style={{ marginLeft: 5 }}>
                            <div
                                style={{
                                    height: 30,
                                    width: 30,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    display: 'flex',
                                    cursor: 'pointer'
                                }}
                                onClick={() => removeEmployee(props.item.id)}
                            >
                                <IoMdRemoveCircleOutline
                                    color={"rgba(250,128,114,.7)"}
                                    size={26}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", marginLeft: 5, marginTop: 3 }}>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <span>Read</span>
                            <input
                                type="checkbox"
                                checked={true}
                                readOnly
                                style={{ transform: "scale(1.2)", marginLeft: 5 }}
                            />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                marginLeft: 30
                            }}
                        >
                            <span>Edit</span>
                            <input
                                type="checkbox"
                                checked={isEditEnabled}
                                onChange={() => updateEmployeeEditRights(props.item.id)}
                                style={{ transform: "scale(1.2)", marginLeft: 5, cursor: 'pointer' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div
                style={{
                    height: 50,
                    width: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    display: 'flex',
                    cursor: 'pointer'
                }}
                onClick={() => makeCall(props.item.mobile)}
            >
                <IoMdCall color={"rgba(30,144,255,.7)"} size={26} />
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    employeeList: state.AppReducer.employeeList,
    userDetails: state.AppReducer.userDetails
});
const mapDispatchToProps = {
    setEmployeeList
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmployeeAccess);
