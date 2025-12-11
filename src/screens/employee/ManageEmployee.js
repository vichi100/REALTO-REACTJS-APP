import React, { useState, useEffect } from "react";
import Button from "./../../components/Button";
import Snackbar from "./../../components/SnackbarComponent";
import axios from "axios";
import { setEmployeeList } from "./../../reducers/Action";
import { connect } from "react-redux";
import { SERVER_URL } from "./../../utils/Constant";

const ManageEmployee = props => {
    const { navigation } = props;
    const { empData = {},
        editEmp = false
    } = props.route?.params || {};
    const [employeeName, setEmployeeName] = useState("");
    const [employeeMobile, setEmployeeMobile] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isViewEnabled, setIsViewEnabled] = useState(true);
    const [isMasterEnabled, setIsMasterEnabled] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isAddEnabled, setIsAddEnabled] = useState(false);
    const [isAdminEnabled, setIsAdminEnabled] = useState(false);
    const [role, setRole] = useState(empData ? empData.employee_role : "view");

    const calculateRole = (view, add, master, admin) => {
        if (admin) {
            return "admin";
        }
        if (master) {
            return "master";
        }
        if (add) {
            return "add";
        }
        if (view) {
            return "view";
        }
        return "view";
    };

    const toggleViewSwitch = () => {
        const newState = !isViewEnabled;
        setIsViewEnabled(newState);
        const newRole = calculateRole(newState, isAddEnabled, isMasterEnabled, isAdminEnabled);
        setRole(newRole);
    };

    const toggleAddSwitch = () => {
        const newState = !isAddEnabled;
        setIsAddEnabled(newState);
        const newRole = calculateRole(isViewEnabled, newState, isMasterEnabled, isAdminEnabled);
        setRole(newRole);
    };

    const toggleMasterSwitch = () => {
        const newState = !isMasterEnabled;
        setIsMasterEnabled(newState);
        const newRole = calculateRole(isViewEnabled, isAddEnabled, newState, isAdminEnabled);
        setRole(newRole);
    };

    const toggleAdminSwitch = () => {
        const newState = !isAdminEnabled;
        setIsAdminEnabled(newState);
        const newRole = calculateRole(isViewEnabled, isAddEnabled, isMasterEnabled, newState);
        setRole(newRole);
    };

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    const onSubmit = () => {
        if (employeeName.trim() === "") {
            setErrorMessage("Employee name is missing");
            setIsVisible(true);
            return;
        } else if (employeeMobile.trim() === "") {
            setErrorMessage("Employee mobile is missing");
            setIsVisible(true);
            return;
        }

        const calculatedRole = calculateRole(isViewEnabled, isAddEnabled, isMasterEnabled, isAdminEnabled);
        const finalRole = calculatedRole || "view";

        const user = {
            req_user_id: props.userDetails.works_for,
            agent_id: props.userDetails.works_for,
            user_type: "employee",
            company_name: props.userDetails.company_name,
            address: props.userDetails.address,
            city: props.userDetails.city,
            emp_name: employeeName.trim(),
            emp_mobile: employeeMobile.trim(),
            employee_role: finalRole
        };
        axios(SERVER_URL + "/addEmployee", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: user
        }).then(
            response => {
                if (response.data) {
                    const x = [response.data, ...props.employeeList];
                    props.setEmployeeList(x);
                    navigation.goBack();
                }
            }
        ).catch((error) => {
            if (error.response && error.response.status === 409) {
                if (error.response.data.errorCode === "EMPLOYEE_EXISTS") {
                    setErrorMessage(error.response.data.message);
                    setIsVisible(true);
                }
            } else {
                console.error("Error adding employee:", error);
                setErrorMessage("An unexpected error occurred. Please try again.");
                setIsVisible(true);
            }
        });
    };

    const updateEmployeeDetails = () => {
        if (employeeName.trim() === "") {
            setErrorMessage("Employee name is missing");
            setIsVisible(true);
            return;
        } else if (employeeMobile.trim() === "") {
            setErrorMessage("Employee mobile is missing");
            setIsVisible(true);
            return;
        }
        const user = {
            req_user_id: props.userDetails.works_for,
            agent_id: props.userDetails.works_for,
            emp_id: empData.id,
            emp_name: employeeName.trim(),
            emp_mobile: employeeMobile.trim(),
            employee_role: role
        };
        axios(SERVER_URL + "/updateEmployeeDetails", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: user
        }).then(
            response => {
                if (response.data) {
                    const x = [response.data, ...props.employeeList];
                    props.setEmployeeList(x);
                    navigation.goBack();
                }
            }
        ).catch((error) => {
            if (error.response && error.response.status === 409) {
                if (error.response.data.errorCode === "EMPLOYEE_EXISTS") {
                    setErrorMessage(error.response.data.message);
                    setIsVisible(true);
                }
            } else {
                console.error("Error adding employee:", error);
                setErrorMessage("An unexpected error occurred. Please try again.");
                setIsVisible(true);
            }
        });
    };

    useEffect(() => {
        if (empData && empData.employee_role) {
            switch (empData.employee_role.toLowerCase()) {
                case "admin":
                    setIsAdminEnabled(true);
                    setIsMasterEnabled(true);
                    setIsAddEnabled(true);
                    setIsViewEnabled(true);
                    break;
                case "master":
                    setIsAdminEnabled(false);
                    setIsMasterEnabled(true);
                    setIsAddEnabled(true);
                    setIsViewEnabled(true);
                    break;
                case "add":
                    setIsAdminEnabled(false);
                    setIsMasterEnabled(false);
                    setIsAddEnabled(true);
                    setIsViewEnabled(true);
                    break;
                case "view":
                    setIsAdminEnabled(false);
                    setIsMasterEnabled(false);
                    setIsAddEnabled(false);
                    setIsViewEnabled(true);
                    break;
                default:
                    setIsAdminEnabled(false);
                    setIsMasterEnabled(false);
                    setIsAddEnabled(false);
                    setIsViewEnabled(true);
                    break;
            }
        }
    }, [empData.employee_role]);

    useEffect(() => {
        setEmployeeName(empData.name || empData.emp_name || "");
        setEmployeeMobile(empData.mobile || empData.emp_mobile || "");
        getEmployeeList();
    }, []);

    const getEmployeeList = () => {
        const user = {
            req_user_id: props.userDetails.works_for,
            user_id: props.userDetails.id
        };
        axios(SERVER_URL + "/getEmployeeList", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: user
        }).then(
            response => {
                props.setEmployeeList(response.data);
            },
            error => {
            }
        );
    };

    return (
        <div style={{ flex: 1, backgroundColor: "#ffffff", color: "#000000", height: '100vh', overflowY: 'auto' }}>
            <div style={styles.container}>
                <div>
                    <p style={{ marginTop: 10, marginBottom: 10, fontSize: 14, fontWeight: 500 }}>
                        Add employees so they can have access/edit rights for your
                        properties listing, you can any time change any employees rights
                    </p>
                    <div style={{ height: 1, width: '100%', backgroundColor: '#ccc' }} />

                    <div style={{ marginTop: 8 }}>
                        <label style={{ display: 'block', marginBottom: 5 }}>Employee Name*</label>
                        <input
                            value={employeeName}
                            onChange={e => setEmployeeName(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            style={styles.input}
                        />
                    </div>

                    <div style={{ marginTop: 8 }}>
                        <label style={{ display: 'block', marginBottom: 5 }}>Employee Mobile*</label>
                        <input
                            value={employeeMobile}
                            onChange={e => setEmployeeMobile(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            type="tel"
                            style={styles.input}
                        />
                    </div>

                    <p style={{ marginTop: 20, marginBottom: 10, fontSize: 14 }}>
                        Grant access right
                    </p>
                    <div>
                        <div style={{ display: "flex", flexDirection: "row", marginLeft: 5, flexWrap: "wrap" }}>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <span>View</span>
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
                                <span>Add</span>
                                <input
                                    type="checkbox"
                                    checked={isAddEnabled}
                                    onChange={toggleAddSwitch}
                                    style={{ transform: "scale(1.2)", marginLeft: 5, cursor: 'pointer' }}
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
                                <span>Master</span>
                                <input
                                    type="checkbox"
                                    checked={isMasterEnabled}
                                    onChange={toggleMasterSwitch}
                                    style={{ transform: "scale(1.2)", marginLeft: 5, cursor: 'pointer' }}
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
                                <span>Admin</span>
                                <input
                                    type="checkbox"
                                    checked={isAdminEnabled}
                                    onChange={toggleAdminSwitch}
                                    style={{ transform: "scale(1.2)", marginLeft: 5, cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                        {<p style={{ marginTop: 10, fontWeight: "normal" }}>
                            <span style={{ color: "", fontWeight: "bold" }}>View:</span> Enable View will allow employee to see the properties and customers which are assigned to him.
                        </p>}
                        {isAddEnabled && <p style={{ marginTop: 10, fontWeight: "normal" }}>
                            <span style={{ color: "", fontWeight: "bold" }}>Add:</span> Enable Add will allow employee to add the new properties and and customers. Also will allow employee to see the properties and customers which are assigned to him.
                        </p>}
                        {isMasterEnabled && <p style={{ marginTop: 10, fontWeight: "normal" }}>
                            <span style={{ color: "red", fontWeight: "bold" }}>Warning:</span> Enable Master will allow employee to see all the properties, customer and Employees details. Also will allow add the new properties and and customers
                        </p>}
                        {isAdminEnabled && <p style={{ marginTop: 10, fontWeight: "normal" }}>
                            <span style={{ color: "red", fontWeight: "bold" }}>Warning:</span> Enable Admin will allow employee to see and delete all the properties, customers and Employee.
                        </p>}
                    </div>

                    <div
                        style={{
                            marginTop: 20,
                            marginBottom: 20
                        }}
                    >
                        {!editEmp ? (
                            <Button
                                title="ADD"
                                onPress={() => onSubmit()}
                            />
                        ) : (
                            <Button
                                title="UPDATE"
                                onPress={() => updateEmployeeDetails()}
                            />
                        )}
                    </div>
                </div>
            </div>
            <Snackbar
                visible={isVisible}
                textMessage={errorMessage}
                position={"top"}
                actionHandler={() => dismissSnackBar()}
                actionText="OK"
            />
        </div>
    );
};

const styles = {
    container: {
        flex: 1,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        display: 'flex',
        flexDirection: 'column'
    },
    input: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        border: '1px solid #ccc',
        fontSize: 16
    }
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
)(ManageEmployee);
