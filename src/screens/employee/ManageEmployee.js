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
        <div className="flex flex-col h-full bg-white">
            <div className="bg-white border-b border-gray-200 flex items-center p-4 shadow-sm sticky top-0 z-10">
                <div onClick={handleBack} className="cursor-pointer mr-4 flex items-center">
                    <MdArrowBack size={24} color="#333" />
                </div>
                <h1 className="text-lg font-semibold text-gray-800">{editEmp ? "Update Employee" : "Add Employee"}</h1>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    <p className="mb-4 text-sm font-medium text-gray-700">
                        Add employees so they can have access/edit rights for your
                        properties listing, you can any time change any employees rights
                    </p>
                    <div className="h-px w-full bg-gray-200 mb-6" />

                    <div className="mb-4">
                        <label className="block mb-1 text-xs text-gray-500 font-bold">Employee Name*</label>
                        <input
                            value={employeeName}
                            onChange={e => setEmployeeName(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            className="w-full py-2 border-b border-gray-300 focus:border-teal-500 outline-none text-lg text-gray-800 transition-colors bg-transparent placeholder-gray-400"
                            placeholder="Enter employee name"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-1 text-xs text-gray-500 font-bold">Employee Mobile*</label>
                        <input
                            value={employeeMobile}
                            onChange={e => setEmployeeMobile(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            type="tel"
                            className="w-full py-2 border-b border-gray-300 focus:border-teal-500 outline-none text-lg text-gray-800 transition-colors bg-transparent placeholder-gray-400"
                            placeholder="+91"
                        />
                    </div>

                    <p className="mb-3 text-sm font-semibold text-gray-800">
                        Grant Access Rights
                    </p>
                    <div className="mb-6">
                        <div className="mb-6">
                            <div className="flex flex-row flex-wrap items-center gap-x-8 gap-y-4 mb-4">
                                {/* View Toggle - Always On */}
                                <label className="flex items-center cursor-pointer">
                                    <span className="text-sm font-medium text-gray-700 mr-3 w-12">View</span>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={true} readOnly />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </div>
                                </label>

                                {/* Add Toggle */}
                                <label className="flex items-center cursor-pointer">
                                    <span className="text-sm font-medium text-gray-700 mr-3 w-12">Add</span>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={isAddEnabled}
                                            onChange={toggleAddSwitch}
                                        />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                                    </div>
                                </label>

                                {/* Master Toggle */}
                                <label className="flex items-center cursor-pointer">
                                    <span className="text-sm font-medium text-gray-700 mr-3 w-12">Master</span>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={isMasterEnabled}
                                            onChange={toggleMasterSwitch}
                                        />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-400"></div>
                                    </div>
                                </label>
                            </div>

                            {/* Admin Toggle - Separate Row */}
                            <div className="flex flex-row items-center gap-4 mb-4">
                                <label className="flex items-center cursor-pointer">
                                    <span className="text-sm font-medium text-gray-700 mr-3 w-12">Admin</span>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={isAdminEnabled}
                                            onChange={toggleAdminSwitch}
                                        />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                    </div>
                                </label>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 p-0">
                                <p>
                                    <span className="font-bold text-gray-900">View:</span> Enable View will allow employee to see the properties and customers which are assigned to him.
                                </p>
                                {isAddEnabled && (
                                    <p>
                                        <span className="font-bold text-gray-900">Add:</span> Enable Add will allow employee to add the new properties and customers. Also will allow employee to see the properties and customers which are assigned to him.
                                    </p>
                                )}
                                {isMasterEnabled && (
                                    <p>
                                        <span className="font-bold text-red-600">Warning:</span> Enable Master will allow employee to see all the properties, customer and Employees details. Also will allow add the new properties and customers
                                    </p>
                                )}
                                {isAdminEnabled && (
                                    <p>
                                        <span className="font-bold text-red-600">Warning:</span> Enable Admin will allow employee to see and delete all the properties, customers and Employee.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-8">
                            {!editEmp ? (
                                <Button
                                    title="ADD"
                                    onPress={() => onSubmit()}
                                    style={{ width: '100%', backgroundColor: '#009688' }} // Teal color
                                />
                            ) : (
                                <Button
                                    title="UPDATE"
                                    onPress={() => updateEmployeeDetails()}
                                    style={{ width: '100%', backgroundColor: '#009688' }} // Teal color
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
