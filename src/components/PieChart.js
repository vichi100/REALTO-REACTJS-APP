import React from 'react';

const PieChart = ({ data, radius = 100, strokeWidth = 20, colors = [] }) => {
    // Default colors if none provided
    const defaultColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#8AC24A', '#607D8B', '#E91E63', '#00BCD4'
    ];

    const chartColors = colors.length ? colors : defaultColors;

    // Calculate total and percentages
    const total = data.reduce((sum, value) => sum + value, 0);
    const percentages = data.map(value => (value / total) * 100);

    // Generate SVG path data for each segment
    let startAngle = 0;
    const segments = percentages.map((percent, index) => {
        if (percent === 0) return null;

        const angle = (percent / 100) * 360;
        const endAngle = startAngle + angle;

        // Calculate coordinates for the arc
        const x1 = radius + radius * Math.cos((startAngle * Math.PI) / 180);
        const y1 = radius + radius * Math.sin((startAngle * Math.PI) / 180);
        const x2 = radius + radius * Math.cos((endAngle * Math.PI) / 180);
        const y2 = radius + radius * Math.sin((endAngle * Math.PI) / 180);

        // Determine if the arc should be drawn as a large arc
        const largeArcFlag = angle > 180 ? 1 : 0;

        const pathData = [
            `M ${radius} ${radius}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
        ].join(' ');

        startAngle = endAngle;

        return (
            <div key={index} className="absolute top-0 left-0">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    viewBox={`0 0 ${radius * 2} ${radius * 2}`}
                    style={{ transform: 'rotate(-90deg)' }}
                >
                    <path
                        d={pathData}
                        fill={chartColors[index % chartColors.length]}
                        stroke="white"
                        strokeWidth={strokeWidth / 2}
                    />
                </svg>
                {/* Legend text inside chart - simplified positioning or removed if hard to place exactly like RN without absolute coordinates calculation */}
                {/* <span className="absolute text-sm">{percent.toFixed(1)}%</span> */}
            </div>
        );
    });

    return (
        <div className="flex flex-row items-center justify-center flex-wrap p-2.5">
            <div className="relative mr-5" style={{ width: radius * 2, height: radius * 2 }}>
                {segments}
            </div>
            <div className="flex flex-col justify-center">
                {data.map((value, index) => (
                    <div key={index} className="flex flex-row items-center my-1.5">
                        <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                        <span className="text-sm">
                            {value} ({percentages[index].toFixed(1)}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PieChart;
