import React from "react";

export default function RadioButtons({ options, selectedOption, onSelect }) {
    return (
        <div className="flex flex-wrap flex-row justify-start w-full">
            {options.map(item => {
                return (
                    <div key={item.key} className="flex flex-row mb-8 pl-5 items-center">
                        <div
                            className="h-5 w-5 rounded-full border-2 border-[#ACACAC] flex items-center justify-center cursor-pointer"
                            onClick={() => {
                                onSelect(item);
                            }}
                        >
                            {selectedOption && selectedOption.key === item.key && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[rgba(102,205,170,0.8)]" />
                            )}
                        </div>
                        <span className="text-sm pl-1.5">{item.text}</span>
                    </div>
                );
            })}
        </div>
    );
}
