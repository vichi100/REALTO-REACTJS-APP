import React, { useState, useEffect } from 'react';

const Counter = (props) => {
    const [count, setCount] = useState(120);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevCount) => {
                if (prevCount > 0) {
                    return prevCount - 1;
                } else {
                    clearInterval(interval);
                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const resend = () => {
        props.resendOTP();
    };

    return count > 0 ? (
        <div
            style={{
                flexDirection: 'row',
                margin: 20,
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex'
            }}
        >
            <span style={{ color: '#696969', fontSize: 16, fontWeight: '500' }}>Resend OTP in </span>
            <span style={{ color: '#696969', fontSize: 16, fontWeight: '500' }}> {count}</span>
            <span style={{ color: '#696969', fontSize: 16, fontWeight: '500' }}>s</span>
        </div>
    ) : (
        <div onClick={() => resend()} style={{ cursor: 'pointer' }}>
            <div
                style={{
                    flexDirection: 'row',
                    margin: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex'
                }}
            >
                <span style={{ color: '#6495ED' }}>Resend OTP</span>
            </div>
        </div>
    );
};

export default Counter;
