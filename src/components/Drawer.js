import React, { Component } from "react";

const DRAWER_WIDTH = 300;

export default class Drawer extends Component {
    constructor() {
        super();
        this.state = {
            isOpen: false,
            disabled: false
        };
    }

    toggleDrawer = () => {
        if (this.state.disabled) return;

        this.setState({ disabled: true }, () => {
            this.setState(prevState => ({ isOpen: !prevState.isOpen }), () => {
                setTimeout(() => {
                    this.setState({ disabled: false });
                }, 250);
            });
        });
    };

    render() {
        return (
            <div className="flex-1 flex flex-col justify-center items-center relative h-screen overflow-hidden">
                <div className="text-2xl text-center m-2.5 text-black font-bold">
                    Animated Sliding Drawer Tutorial.
                </div>
                <div
                    className="absolute top-0 right-0 bottom-0 flex flex-row transition-transform duration-250 ease-in-out"
                    style={{
                        width: DRAWER_WIDTH,
                        transform: `translateX(${this.state.isOpen ? '0px' : `${DRAWER_WIDTH - 46}px`})`
                    }}
                >
                    <button
                        disabled={this.state.disabled}
                        onClick={this.toggleDrawer}
                        className="p-2 bg-transparent border-none cursor-pointer h-full flex items-center"
                    >
                        {/* Using a placeholder or icon for menu.png since local assets might not be available */}
                        <div style={{ width: 30, height: 30, backgroundColor: '#ccc', borderRadius: 4 }}>
                            {/* Replace with actual image if available or use an icon */}
                            <span className="block w-full h-full flex items-center justify-center text-xs">Menu</span>
                        </div>
                    </button>
                    <div className="flex-1 bg-[#f53b3b] flex flex-col items-center">
                        <div className="mb-px bg-[#4CAF50] w-full text-2xl text-white p-2.5">Buy Now</div>
                        <div className="mb-px bg-[#4CAF50] w-full text-2xl text-white p-2.5">Offer Zone</div>
                        <div className="mb-px bg-[#4CAF50] w-full text-2xl text-white p-2.5">Qualty Product</div>
                        <div className="mb-px bg-[#4CAF50] w-full text-2xl text-white p-2.5">50% Off</div>
                    </div>
                </div>
            </div>
        );
    }
}
