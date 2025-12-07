import React, { Component } from "react";
import PropTypes from "prop-types";

class SnackbarComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            hideDistance: 0
        };
        this.timer = null;
    }

    componentDidMount() {
        if (this.props.visible) {
            this.showSnackbar();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.visible !== prevProps.visible) {
            if (this.props.visible) {
                this.showSnackbar();
            } else {
                this.hideSnackbar();
            }
        }
    }

    componentWillUnmount() {
        if (this.timer) clearTimeout(this.timer);
    }

    showSnackbar() {
        this.setState({ visible: true });
        if (this.props.autoHidingTime) {
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.hideSnackbar();
            }, this.props.autoHidingTime);
        }
    }

    hideSnackbar() {
        this.setState({ visible: false });
    }

    render() {
        const {
            position,
            backgroundColor,
            left,
            right,
            top,
            bottom,
            textMessage,
            messageStyle,
            messageColor,
            actionHandler,
            actionText,
            actionStyle,
            accentColor,
            containerStyle
        } = this.props;

        const isTop = position === "top";
        const translateY = this.state.visible ? '0' : (isTop ? '-100%' : '100%');

        return (
            <div
                className="fixed z-[9999] transition-transform duration-200 ease-in-out"
                style={{
                    left: left || 0,
                    right: right || 0,
                    top: isTop ? (top || 0) : 'auto',
                    bottom: !isTop ? (bottom || 0) : 'auto',
                    transform: `translateY(${translateY})`,
                    visibility: this.state.visible ? 'visible' : 'hidden' // Hide when not visible to avoid blocking clicks
                }}
            >
                <div
                    className="flex flex-row justify-between items-center shadow-md"
                    style={{
                        backgroundColor: backgroundColor,
                        ...containerStyle
                    }}
                >
                    {typeof textMessage === "function" ? (
                        textMessage()
                    ) : (
                        <span
                            className="text-sm flex-1 text-left pl-5 py-3.5"
                            style={{
                                color: messageColor,
                                ...messageStyle
                            }}
                        >
                            {textMessage}
                        </span>
                    )}
                    {actionHandler !== null && !!actionText ? (
                        <button
                            onClick={actionHandler}
                            className="bg-transparent border-none cursor-pointer"
                        >
                            <span
                                className="text-sm font-semibold pr-5 py-3.5"
                                style={{
                                    color: accentColor,
                                    ...actionStyle
                                }}
                            >
                                {actionText.toUpperCase()}
                            </span>
                        </button>
                    ) : null}
                </div>
            </div>
        );
    }
}

SnackbarComponent.defaultProps = {
    accentColor: "orange",
    messageColor: "#FFFFFF",
    backgroundColor: "#484848",
    distanceCallback: null,
    actionHandler: null,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    visible: false,
    position: "bottom",
    actionText: "",
    textMessage: "",
    autoHidingTime: 0,
    containerStyle: {},
    messageStyle: {},
    actionStyle: {}
};

SnackbarComponent.propTypes = {
    accentColor: PropTypes.string,
    messageColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    distanceCallback: PropTypes.func,
    actionHandler: PropTypes.func,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
    bottom: PropTypes.number,
    visible: PropTypes.bool,
    actionText: PropTypes.string,
    textMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    position: PropTypes.oneOf(["bottom", "top"]),
    autoHidingTime: PropTypes.number,
    containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    messageStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    actionStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default SnackbarComponent;
