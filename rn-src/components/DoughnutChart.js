import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

const DoughnutChart = ({ 
  data=[2,98], 
  radius = 100, 
  holeRadius = 60, 
  strokeWidth = 30, 
  colors = [],
  textColor = '#000',
  textSize = 24,
  showPercentage = true
}) => {
  // Default colors if none provided
  const defaultColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
    '#FF9F40', '#8AC24A', '#607D8B', '#E91E63', '#00BCD4'
  ];
  
  const chartColors = colors.length ? colors : defaultColors;
  
  // Calculate total and percentages
  if(data[0] === 0 || data[1] === 0) {
    data = [1, 98]; // Default to a non-empty chart
  }
  const total = data.reduce((sum, value) => sum + value, 0);
  const percentages = data.map(value => (value / total) * 100);
  const mainPercentage = Math.round((data[0] / total) * 100); // First segment percentage
  
  // Generate path data for each segment
  let startAngle = 0;
  const segments = percentages.map((percent, index) => {
    if (percent === 0) return null;
    
    const angle = (percent / 100) * 360;
    const endAngle = startAngle + angle;
    
    // Outer coordinates
    const x1 = radius + (radius * Math.cos((startAngle * Math.PI) / 180));
    const y1 = radius + (radius * Math.sin((startAngle * Math.PI) / 180));
    const x2 = radius + (radius * Math.cos((endAngle * Math.PI) / 180));
    const y2 = radius + (radius * Math.sin((endAngle * Math.PI) / 180));
    
    // Inner coordinates (for doughnut effect)
    const innerX1 = radius + (holeRadius * Math.cos((startAngle * Math.PI) / 180));
    const innerY1 = radius + (holeRadius * Math.sin((startAngle * Math.PI) / 180));
    const innerX2 = radius + (holeRadius * Math.cos((endAngle * Math.PI) / 180));
    const innerY2 = radius + (holeRadius * Math.sin((endAngle * Math.PI) / 180));
    
    // Determine if the arc should be drawn as a large arc
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${innerX2} ${innerY2}`,
      `A ${holeRadius} ${holeRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1}`,
      'Z'
    ].join(' ');
    
    startAngle = endAngle;
    
    return (
      <Path
        key={index}
        d={pathData}
        fill={chartColors[index % chartColors.length]}
        stroke="white"
        strokeWidth={1}
      />
    );
  });
  
  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { width: radius * 2, height: radius * 2 }]}>
        <Svg height={radius * 2} width={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
          <G rotation="-90" origin={`${radius}, ${radius}`}>
            {segments}
          </G>
        </Svg>
        {showPercentage && (
          <View style={[styles.centerTextContainer, { width: holeRadius * 2, height: holeRadius * 2 }]}>
            <Text style={[styles.centerText, { color: textColor, fontSize: textSize }]}>
              {mainPercentage }%
            </Text>
            <Text style={[styles.centerText, { color: textColor, fontSize: textSize / 1.2 }]}>
            Match
            </Text>
          </View>
        )}
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
    // padding: 10,
  },
  chartContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  centerTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontWeight: 'bold',
    textAlign: 'center',
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

export default DoughnutChart;