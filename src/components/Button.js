import React from "react";

const Button = ({ onPress, title, testID, accessibilityLabel, className = "", style = {}, ...props }) => (
    <button
        onClick={onPress}
        className={`bg-[#009688] rounded-[10px] py-[10px] w-[90%] mx-auto block mt-[10px] mb-[15px] shadow-lg hover:opacity-90 transition-opacity duration-200 ${className}`}
        data-testid={testID}
        aria-label={accessibilityLabel || title}
        style={style}
        {...props}
    >
        <span className="text-[16px] text-white font-semibold uppercase block text-center leading-normal">
            {title}
        </span>
    </button>
);

export default Button;
