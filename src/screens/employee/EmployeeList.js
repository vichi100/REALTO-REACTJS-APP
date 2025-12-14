import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { MdSort, MdFilterList, MdSearch, MdArrowBack } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import axios from "axios";
import { SERVER_URL } from "./../../utils/Constant";
import { EMPLOYEE_ROLE } from "./../../utils/AppConstant";
import { setEmployeeList } from "./../../reducers/Action";
import EmployeeCard from "../employee/EmployeeCard";
import { useDispatch } from 'react-redux';
import { triggerRefresh } from './../../reducers/dataRefreshReducer';

const EmployeeList = props => {
    const navigate = useNavigate();
    // const { navigation } = props;
    const {
        itemForAddEmplyee = null,
        disableDrawer = false,
        displayCheckBox = false
    } = props.route?.params || {};

    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const isFetching = useRef(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (
            props.userDetails &&
            props.userDetails.works_for !== null
        ) {
            getListing();
        }
    }, [props.userDetails]);

    const handleBack = () => {
        if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/profile');
        }
    };

    const getListing = () => {
        const user = {
            req_user_id: props.userDetails.works_for,
            agent_id: props.userDetails.works_for
        };
        setLoading(true);

        if (isFetching.current) return;
        isFetching.current = true;
        axios(SERVER_URL + "/employeeList", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: user
        }).then(
            response => {
                setData(response.data);
                props.setEmployeeList(response.data);
                setLoading(false);
                isFetching.current = false;
            },
            error => {
                console.log(error);
                setLoading(false);
                isFetching.current = false;
            }
        );
    };

    const searchFilterFunction = text => {
        if (text) {
            const newData = props.employeeList.filter(function (item) {
                const itemData = item.name + item.mobile;
                const textData = text.toUpperCase();
                return itemData.toUpperCase().indexOf(textData) > -1;
            });
            setData(newData);
            setSearch(text);
        } else {
            setData(props.employeeList);
            setSearch(text);
        }
    };

    const deleteMe = (empObj) => {
        const user = {
            req_user_id: props.userDetails.id,
            agent_id: props.userDetails.works_for,
            employee_id: empObj.id
        };
        axios(SERVER_URL + "/deleteEmployee", {
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
                        return el.id !== empObj.id;
                    });
                    props.setEmployeeList([...x]);
                    dispatch(triggerRefresh());
                }
            },
            error => {
            }
        );
        setData((data) => data.filter((item) => item.id !== empObj.id));
        setRefresh(!refresh);
    }

    const navigateTo = () => {
        navigate("/profile/ManageEmployee");
    };

    useEffect(() => {
        if (props.residentialCustomerList.length > 0) {
            setData(props.residentialCustomerList)
        }
    }, [props.residentialCustomerList])

    return (
        loading ? <div
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(245,245,245, .4)',
                height: '100%',
                display: 'flex'
            }}
        >
            <div>Loading...</div>
        </div> :
            <div style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={styles.header}>
                    <div onClick={handleBack} style={styles.backButton}>
                        <MdArrowBack size={24} color="#333" />
                    </div>
                    <h1 style={styles.title}>Employee List</h1>
                </div>
                <div style={styles.searchBar}>
                    <MdSearch size={20} color="#999" style={{ marginRight: 5, }} />
                    <input
                        style={styles.textInputStyle}
                        onChange={e => searchFilterFunction(e.target.value)}
                        value={search}
                        placeholder="Search By Name, Mobile"
                    />
                </div>
                {data.length > 0 ? (
                    <div style={styles.container}>
                        <div style={{ overflowY: 'auto', flex: 1 }}>
                            {data.map((item, index) => (
                                <div key={index}>
                                    <EmployeeCard
                                        // navigation={navigation}
                                        item={item}
                                        itemForAddEmplyee={itemForAddEmplyee}
                                        deleteMe={deleteMe}
                                        disableDrawer={disableDrawer}
                                        displayCheckBox={displayCheckBox}
                                    />
                                    <div style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
                                </div>
                            ))}
                            <div style={{ padding: 10, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                <span style={{ color: '#000' }}>End</span>
                            </div>
                        </div>
                        <div style={styles.fab}>
                            <div
                                onClick={() => console.log("Sort")}
                                style={{ ...styles.fabIcon1, cursor: 'pointer' }}
                            >
                                <MdSort color={"#ffffff"} size={26} />
                            </div>
                            <div style={styles.verticalLine}></div>
                            <div
                                onClick={() => console.log("Filter")}
                                style={{ ...styles.fabIcon2, cursor: 'pointer' }}
                            >
                                <MdFilterList
                                    color={"#ffffff"}
                                    size={26}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={styles.container}>
                        <div
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <span style={{ textAlign: "center" }}>
                                You have no Employee
                            </span>

                            {props.userDetails && ((props.userDetails.works_for === props.userDetails.id) ||
                                (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role)
                                )) ?
                                <div onClick={() => navigateTo()} style={{ cursor: 'pointer' }}>
                                    <span
                                        style={{ color: "#00BFFF", textAlign: "center", marginTop: 20 }}
                                    >
                                        Add New Employee
                                    </span>
                                </div> : null}
                        </div>
                    </div>)}
                {props.userDetails && ((props.userDetails.works_for === props.userDetails.id) ||
                    (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role)
                    )) ?
                    <div
                        style={{
                            ...styles.addButton,
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate("/profile/ManageEmployee")}
                    >
                        <AiOutlinePlusCircle size={40} color="#ffffff" />
                    </div> : null}
            </div>
    );
};

const styles = {
    container: {
        flex: 1,
        margin: 5,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%'
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
        display: 'flex',
        margin: 10
    },
    fab: {
        flexDirection: "row",
        position: "absolute",
        width: 130,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
        right: "33%",
        bottom: 10,
        backgroundColor: "rgba(128,128,128, 0.8)",
        borderRadius: 30,
        boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
        display: 'flex'
    },
    verticalLine: {
        height: "100%",
        width: 2,
        backgroundColor: "#ffffff"
    },
    fabIcon1: {
        paddingRight: 20,
        display: 'flex',
        alignItems: 'center'
    },
    fabIcon2: {
        paddingLeft: 20,
        display: 'flex',
        alignItems: 'center'
    },
    addButton: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 15,
        right: 10,
        backgroundColor: "rgba(255, 148, 112, 1)",
        borderRadius: 100,
        display: 'flex',
        width: 40,
        height: 40
    },
    textInputStyle: {
        width: "100%",
        height: 30,
        paddingLeft: 10,
        border: 'none',
        outline: 'none',
        fontSize: 16,
        color: '#000'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: '15px 20px',
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 10,
    },
    backButton: {
        cursor: 'pointer',
        marginRight: '15px',
        display: 'flex',
        alignItems: 'center',
    },
    title: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#333',
        margin: 0,
    },
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    residentialCustomerList: state.AppReducer.residentialCustomerList,
    employeeList: state.AppReducer.employeeList
});
const mapDispatchToProps = {
    setEmployeeList
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmployeeList);
