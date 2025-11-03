import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export const TrendChart = ({ data, label, color = '#2196F3', suffix = '' }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{label}</Text>
        <View style={styles.noData}>
          <Text style={styles.noDataText}>No data available yet</Text>
          <Text style={styles.noDataSubtext}>Track your daily metrics to see trends</Text>
        </View>
      </View>
    );
  }

  // Get last 7 days of data
  const chartData = data.slice(-7);
  const values = chartData.map(d => d.value || 0);
  const labels = chartData.map(d => {
    const date = new Date(d.date);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 3);
  });

  // Calculate stats
  const average = values.length > 0
    ? values.reduce((a, b) => a + b, 0) / values.length
    : 0;
  const latest = values[values.length - 1] || 0;
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Ensure we have valid data for the chart
  const hasValidData = values.some(v => v > 0);

  if (!hasValidData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{label}</Text>
        <View style={styles.noData}>
          <Text style={styles.noDataText}>No data available yet</Text>
          <Text style={styles.noDataSubtext}>Track your daily metrics to see trends</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{label}</Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Latest</Text>
          <Text style={styles.statValue}>{latest.toFixed(0)}{suffix}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Avg</Text>
          <Text style={styles.statValue}>{average.toFixed(0)}{suffix}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Range</Text>
          <Text style={styles.statValue}>{min.toFixed(0)}-{max.toFixed(0)}</Text>
        </View>
      </View>

      <LineChart
        data={{
          labels,
          datasets: [{
            data: values,
            color: () => color,
            strokeWidth: 2
          }]
        }}
        width={screenWidth - 72}
        height={180}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: color
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: '#e0e0e0',
            strokeWidth: 1
          }
        }}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noData: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
  },
});
