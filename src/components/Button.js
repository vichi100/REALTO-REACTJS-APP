import React from "react";

const Button = ({ onPress, title, testID, accessibilityLabel }) => (
    <button
        onClick={onPress}
        className="bg-[#009688] rounded-lg py-2.5 px-24 mt-2.5 mb-4 shadow-md hover:bg-[#00796b] transition-colors duration-200 w-full md:w-auto"
        data-testid={testID}
        aria-label={accessibilityLabel || title}
    >
        <span className="text-base text-white font-semibold uppercase block text-center">
            {title}
        </span>
    </button>
);

export default Button;
