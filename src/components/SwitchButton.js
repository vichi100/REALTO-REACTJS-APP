import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SwitchButton extends Component {
    static propTypes = {
        onValueChange: PropTypes.func
    };

    static defaultProps = {
        onValueChange: () => null
    };

    constructor() {
        super();

        this.state = {
            activeSwitch: 1,
            sbWidth: 100,
            sbHeight: 44,
            direction: "ltr",
        };
    }

    _switchDirection(direction) {
        let dir = "row";
        if (direction === "rtl") {
            dir = "row-reverse";
        } else {
            dir = "row";
        }
        return dir;
    }

    _switchThump(direction) {
        const { onValueChange } = this.props;

        if (this.state.activeSwitch === 1) {
            this.setState({ activeSwitch: 2 }, () =>
                onValueChange(this.state.activeSwitch)
            );
        } else {
            this.setState({ activeSwitch: 1 }, () =>
                onValueChange(this.state.activeSwitch)
            );
        }
    }

    render() {
        const {
            switchWidth,
            switchHeight,
            switchBorderRadius,
            switchBorderColor,
            switchBackgroundColor,
            switchdirection,
            btnBorderColor,
            btnBackgroundColor,
            activeFontColor,
            fontColor,
            text1,
            text2
        } = this.props;

        const width = switchWidth || this.state.sbWidth;
        const height = switchHeight || this.state.sbHeight;
        const borderRadius = switchBorderRadius !== undefined ? switchBorderRadius : height / 2;
        const direction = switchdirection || this.state.direction;
        const flexDir = this._switchDirection(direction);

        // Calculate offset for the active button
        // If activeSwitch is 1 (left/first), offset is 0
        // If activeSwitch is 2 (right/second), offset is width/2
        // But we need to account for padding/margins.
        // The original code used Animated.Value. Here we use CSS transform.

        // Logic from original:
        // activeSwitch 1 -> offset 0
        // activeSwitch 2 -> offset ((width / 2) - 6) * dirsign

        // Simplified for web:
        // We have a container with relative positioning.
        // The active button is absolute or just translated.
        // Let's use a flex container and move the active button.

        const activeBtnWidth = (width / 2);
        const activeBtnHeight = height - 6;

        // We can use a sliding background or a moving element.
        // Let's use a moving element.

        const translateX = this.state.activeSwitch === 1 ? 0 : (width / 2) - 6; // Adjust calculation as needed
        // Actually, simpler:
        // If 1: translateX = 0
        // If 2: translateX = 100% (of its own width approx)

        // Let's stick to the visual structure.

        return (
            <div>
                <div
                    className="cursor-pointer"
                    onClick={() => {
                        this._switchThump(direction);
                    }}
                >
                    <div
                        style={{
                            width: width,
                            height: height,
                            borderRadius: borderRadius,
                            borderWidth: 1,
                            borderStyle: 'solid',
                            borderColor: switchBorderColor || "#d4d4d4",
                            backgroundColor: switchBackgroundColor || "#fff",
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: flexDir,
                                width: '100%',
                                height: '100%',
                                position: 'relative'
                            }}
                        >
                            {/* Active Button Background (Sliding) */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 2,
                                    left: 2, // Initial position
                                    width: activeBtnWidth, // Approx half width
                                    height: activeBtnHeight,
                                    borderRadius: borderRadius,
                                    borderWidth: 1,
                                    borderStyle: 'solid',
                                    borderColor: btnBorderColor || "#00a4b9",
                                    backgroundColor: btnBackgroundColor || "#00bcd4",
                                    transform: `translateX(${this.state.activeSwitch === 1 ? 0 : width / 2 - 4}px)`, // -4 for borders/margins
                                    transition: 'transform 0.3s ease',
                                    zIndex: 1
                                }}
                            />

                            {/* Text 1 */}
                            <div
                                style={{
                                    width: '50%',
                                    height: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 2,
                                    pointerEvents: 'none'
                                }}
                            >
                                <span
                                    style={{
                                        color: this.state.activeSwitch === 1 ? (activeFontColor || "#fff") : (fontColor || "#b1b1b1"),
                                        transition: 'color 0.3s'
                                    }}
                                >
                                    {text1 || "ON"}
                                </span>
                            </div>

                            {/* Text 2 */}
                            <div
                                style={{
                                    width: '50%',
                                    height: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 2,
                                    pointerEvents: 'none'
                                }}
                            >
                                <span
                                    style={{
                                        color: this.state.activeSwitch === 2 ? (activeFontColor || "#fff") : (fontColor || "#b1b1b1"),
                                        transition: 'color 0.3s'
                                    }}
                                >
                                    {text2 || "OFF"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.children}
            </div>
        );
    }
}
