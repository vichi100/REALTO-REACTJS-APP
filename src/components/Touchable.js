import React from "react";
import PropTypes from "prop-types";

const noop = () => { };

const Touchable = ({ onPress, style, children }) => {
    return (
        <div
            onClick={onPress}
            style={{ cursor: 'pointer', ...style }}
            role="button"
            tabIndex={0}
        >
            {children}
        </div>
    );
};

Touchable.propTypes = {
    onPress: PropTypes.func,
    style: PropTypes.object,
    children: PropTypes.node.isRequired
};

Touchable.defaultProps = {
    onPress: noop,
    style: {}
};

export default Touchable;
