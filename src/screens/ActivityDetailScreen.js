import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TrendChart } from '../components/TrendChart';
import { SectionScoreCircle } from '../components/SectionScoreCircle';
import { getDailyLogs } from '../utils/storage';
import { calculateRollingAverage } from '../utils/rollingAverage';

export const ActivityDetailScreen = ({ navigation }) => {
  const [allLogs, setAllLogs] = useState({});
  const [rollingAvg, setRollingAvg] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const logs = await getDailyLogs();
    setAllLogs(logs);
    const avg = calculateRollingAverage(logs, 'activity', 7);
    setRollingAvg(avg);
  };

  const prepareChartData = (metric) => {
    const sortedDates = Object.keys(allLogs).sort();
    return sortedDates
      .map((d) => ({
        date: d,
        value:
          metric === 'activity'
            ? parseFloat(allLogs[d].scoreData?.breakdown?.activity || 0) * 10
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
        <Text style={styles.headerTitle}>Activity</Text>
        <Text style={styles.headerSubtitle}>
          Track your daily steps and workouts
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Activity Score</Text>
        <Text style={styles.description}>
          Your activity score is based on daily step count and whether you completed
          strength training or cardio. Higher steps and workouts improve your score.
        </Text>
        <Text style={styles.formula}>
          Score Range: 0.9 - 1.2 (multiplier based on steps and workouts)
        </Text>
      </View>

      <TrendChart
        data={prepareChartData('activity')}
        label="Activity Score Trend"
        color="#4CAF50"
        suffix="/10"
      />

      <TrendChart
        data={prepareChartData('steps')}
        label="Daily Steps"
        color="#8BC34A"
        suffix=""
      />

      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>Tips for Better Score</Text>
        <Text style={styles.tip}>• Aim for at least 8,000 steps per day</Text>
        <Text style={styles.tip}>• Include both strength training and cardio</Text>
        <Text style={styles.tip}>• 12,000+ steps with workouts = maximum score</Text>
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
