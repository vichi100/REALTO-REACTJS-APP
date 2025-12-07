import React, { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const AccordionListItem = ({ title, children, open = false, testID }) => {
    const [isOpen, setIsOpen] = useState(open);
    const contentRef = useRef(null);

    const toggleListItem = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    return (
        <div className="flex flex-col w-full">
            <div
                className="flex flex-row justify-between items-center p-4 pl-6 border-t border-b-5 border-[#EFEFEF] cursor-pointer select-none"
                onClick={toggleListItem}
                data-testid={testID}
            >
                <span className="text-lg font-semibold text-black">{title}</span>
                <div
                    className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                        }`}
                >
                    <MdKeyboardArrowDown size={30} color="black" />
                </div>
            </div>
            <div
                className={`overflow-hidden transition-[max-height] duration-300 ease-in-out bg-[#EFEFEF]`}
                style={{
                    maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
                }}
                ref={contentRef}
            >
                <div className="p-4 pl-6 w-full">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AccordionListItem;
