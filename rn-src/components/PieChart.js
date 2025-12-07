import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

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
      <View key={index} style={styles.segmentContainer}>
        <svg
          height={radius * 2}
          width={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          style={styles.svg}
        >
          <path
            d={pathData}
            fill={chartColors[index % chartColors.length]}
            stroke="white"
            strokeWidth={strokeWidth / 2}
          />
        </svg>
        <Text style={styles.legendText}>
          {percent.toFixed(1)}%
        </Text>
      </View>
    );
  });
  
  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { width: radius * 2, height: radius * 2 }]}>
        {segments}
      </View>
      <View style={styles.legendContainer}>
        {data.map((value, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: chartColors[index % chartColors.length] }]} />
            <Text style={styles.legendText}>
              {value} ({percentages[index].toFixed(1)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: 10,
  },
  chartContainer: {
    position: 'relative',
    marginRight: 20,
  },
  segmentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  legendContainer: {
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 3,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
});

export default PieChart;