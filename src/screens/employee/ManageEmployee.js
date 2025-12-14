import React, { useState, useEffect } from "react";
import Button from "./../../components/Button";
import Snackbar from "./../../components/SnackbarComponent";
import axios from "axios";
import { setEmployeeList } from "./../../reducers/Action";
import { connect } from "react-redux";
import { SERVER_URL } from "./../../utils/Constant";

import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ManageEmployee = props => {
    const { navigation } = props;
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/profile/EmployeeList');
        }
    };
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
        <div className="flex flex-col h-full bg-gray-50">
            <div className="bg-white border-b border-gray-200 flex items-center p-4 shadow-sm sticky top-0 z-10">
                <div onClick={handleBack} className="cursor-pointer mr-4 flex items-center">
                    <MdArrowBack size={24} color="#333" />
                </div>
                <h1 className="text-lg font-semibold text-gray-800">{editEmp ? "Update Employee" : "Add Employee"}</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
                <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
                    <p className="mb-4 text-sm font-medium text-gray-700">
                        Add employees so they can have access/edit rights for your
                        properties listing, you can any time change any employees rights
                    </p>
                    <div className="h-px w-full bg-gray-200 mb-6" />

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Employee Name*</label>
                        <input
                            value={employeeName}
                            onChange={e => setEmployeeName(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            className="w-full p-2.5 rounded border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none text-base transition-colors"
                            placeholder="Enter employee name"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Employee Mobile*</label>
                        <input
                            value={employeeMobile}
                            onChange={e => setEmployeeMobile(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            type="tel"
                            className="w-full p-2.5 rounded border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none text-base transition-colors"
                            placeholder="Enter mobile number"
                        />
                    </div>

                    <p className="mb-3 text-sm font-semibold text-gray-800">
                        Grant Access Rights
                    </p>
                    <div className="mb-6">
                        <div className="flex flex-row flex-wrap gap-6 mb-4">
                            <label className="flex items-center cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 mr-2">View</span>
                                <input
                                    type="checkbox"
                                    checked={true}
                                    readOnly
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 mr-2">Add</span>
                                <input
                                    type="checkbox"
                                    checked={isAddEnabled}
                                    onChange={toggleAddSwitch}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 mr-2">Master</span>
                                <input
                                    type="checkbox"
                                    checked={isMasterEnabled}
                                    onChange={toggleMasterSwitch}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 mr-2">Admin</span>
                                <input
                                    type="checkbox"
                                    checked={isAdminEnabled}
                                    onChange={toggleAdminSwitch}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                            </label>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded border border-gray-100">
                            <p>
                                <span className="font-semibold text-gray-900">View:</span> Allows employee to see assigned properties and customers.
                            </p>
                            {isAddEnabled && <p>
                                <span className="font-semibold text-gray-900">Add:</span> Allows employee to add new properties/customers and see assigned ones.
                            </p>}
                            {isMasterEnabled && <p>
                                <span className="font-semibold text-red-600">Warning (Master):</span> Allows employee to see/add ALL properties, customers, and employees details.
                            </p>}
                            {isAdminEnabled && <p>
                                <span className="font-semibold text-red-600">Warning (Admin):</span> Full access to see and DELETE all properties, customers, and employees.
                            </p>}
                        </div>
                    </div>

                    <div className="mt-8">
                        {!editEmp ? (
                            <Button
                                title="ADD EMPLOYEE"
                                onPress={() => onSubmit()}
                                style={{ width: '100%' }}
                            />
                        ) : (
                            <Button
                                title="UPDATE DETAILS"
                                onPress={() => updateEmployeeDetails()}
                                style={{ width: '100%' }}
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
