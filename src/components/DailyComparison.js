import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const DailyComparison = ({ today, yesterday }) => {
  const getChange = (todayValue, yesterdayValue) => {
    if (!yesterdayValue || yesterdayValue === 0) return null;
    const change = ((todayValue - yesterdayValue) / yesterdayValue) * 100;
    return change;
  };

  const renderMetric = (label, todayValue, yesterdayValue, unit = '') => {
    const change = getChange(todayValue, yesterdayValue);
    const hasData = todayValue !== undefined && todayValue !== null && todayValue !== 0;

    return (
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>{label}</Text>
        <View style={styles.metricValues}>
          <View style={styles.valueContainer}>
            <Text style={styles.todayLabel}>Today</Text>
            <Text style={styles.todayValue}>
              {hasData ? `${todayValue}${unit}` : '--'}
            </Text>
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.yesterdayLabel}>Yesterday</Text>
            <Text style={styles.yesterdayValue}>
              {yesterdayValue ? `${yesterdayValue}${unit}` : '--'}
            </Text>
          </View>
          {change !== null && hasData && (
            <View style={styles.changeContainer}>
              <Text style={[
                styles.changeText,
                change > 0 ? styles.changePositive : styles.changeNegative
              ]}>
                {change > 0 ? '↑' : '↓'} {Math.abs(change).toFixed(0)}%
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Comparison</Text>

      {today?.scoreData && (
        renderMetric(
          'Score',
          today.scoreData.score,
          yesterday?.scoreData?.score,
          '/10'
        )
      )}

      {renderMetric('Sleep', today?.sleepMinutes, yesterday?.sleepMinutes, 'm')}
      {renderMetric('Steps', today?.steps, yesterday?.steps, '')}
      {renderMetric('Protein', today?.protein, yesterday?.protein, 'g')}
      {renderMetric('Calories', today?.calories, yesterday?.calories, '')}
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
    marginBottom: 16,
  },
  metricRow: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  metricValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueContainer: {
    flex: 1,
  },
  todayLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  todayValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  yesterdayLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  yesterdayValue: {
    fontSize: 16,
    color: '#666',
  },
  changeContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  changePositive: {
    color: '#4CAF50',
  },
  changeNegative: {
    color: '#f44336',
  },
});
