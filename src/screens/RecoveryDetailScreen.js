import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TrendChart } from '../components/TrendChart';
import { SectionScoreCircle } from '../components/SectionScoreCircle';
import { getDailyLogs } from '../utils/storage';
import { calculateRollingAverage } from '../utils/rollingAverage';

export const RecoveryDetailScreen = ({ navigation }) => {
  const [allLogs, setAllLogs] = useState({});
  const [rollingAvg, setRollingAvg] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const logs = await getDailyLogs();
    setAllLogs(logs);
    const avg = calculateRollingAverage(logs, 'recovery', 7);
    setRollingAvg(avg);
  };

  const prepareChartData = (metric) => {
    const sortedDates = Object.keys(allLogs).sort();
    return sortedDates
      .map((d) => ({
        date: d,
        value:
          metric === 'recovery'
            ? parseFloat(allLogs[d].scoreData?.breakdown?.recovery || 0) * 10
            : allLogs[d][metric] || 0,
      }))
      .filter((d) => d.value > 0);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <SectionScoreCircle
          title="7-Day Average"
          score={rollingAvg}
          size="large"
          onPress={() => {}}
        />
        <Text style={styles.headerTitle}>Recovery</Text>
        <Text style={styles.headerSubtitle}>
          Monitor your sleep and stress levels
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Recovery Score</Text>
        <Text style={styles.description}>
          Your recovery score is based on sleep duration and stress levels.
          Optimal sleep (7-8 hours) and low stress result in the best scores.
        </Text>
        <Text style={styles.formula}>
          Score Range: 0.8 - 1.0 (based on sleep hours and stress)
        </Text>
      </View>

      <TrendChart
        data={prepareChartData('recovery')}
        label="Recovery Score Trend"
        color="#9C27B0"
        suffix="/10"
      />

      <TrendChart
        data={prepareChartData('sleepMinutes')}
        label="Sleep Duration"
        color="#BA68C8"
        suffix="m"
      />

      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>Tips for Better Score</Text>
        <Text style={styles.tip}>• Aim for 7-8 hours of sleep per night</Text>
        <Text style={styles.tip}>• Manage stress through meditation or exercise</Text>
        <Text style={styles.tip}>• Maintain a consistent sleep schedule</Text>
        <Text style={styles.tip}>• Avoid oversleeping (more than 9 hours)</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  formula: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  tips: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tip: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
  },
});
