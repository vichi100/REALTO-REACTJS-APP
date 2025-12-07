import PropTypes from "prop-types";
import React, { Component } from "react";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

export default class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: this.props.isChecked
        };
    }

    static propTypes = {
        containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        onClick: PropTypes.func.isRequired,
        isChecked: PropTypes.bool.isRequired,
        checkBoxColor: PropTypes.string,
        checkedCheckBoxColor: PropTypes.string,
        uncheckedCheckBoxColor: PropTypes.string,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        isChecked: false,
        disabled: false,
        checkBoxColor: '#000000'
    };

    onClick() {
        if (this.props.disabled) return;
        const checkboxState = !this.state.isChecked;
        this.setState({ isChecked: !this.state.isChecked });
        this.props.onClick(checkboxState);
    }

    getCheckedCheckBoxColor() {
        return this.props.checkedCheckBoxColor
            ? this.props.checkedCheckBoxColor
            : this.props.checkBoxColor;
    }

    getUncheckedCheckBoxColor() {
        return this.props.uncheckedCheckBoxColor
            ? this.props.uncheckedCheckBoxColor
            : this.props.checkBoxColor;
    }

    getTintColor() {
        return this.state.isChecked
            ? this.getCheckedCheckBoxColor()
            : this.getUncheckedCheckBoxColor();
    }

    render() {
        return (
            <div
                className={`flex flex-row items-center cursor-pointer ${this.props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={this.props.style}
                onClick={() => this.onClick()}
            >
                <div className="flex flex-row items-center">
                    {this.state.isChecked ? (
                        <MdCheckBox size={24} color={this.getTintColor()} />
                    ) : (
                        <MdCheckBoxOutlineBlank size={24} color={this.getTintColor()} />
                    )}
                </div>
            </div>
        );
    }
}
