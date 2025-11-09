import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TrendChart } from '../components/TrendChart';
import { SectionScoreCircle } from '../components/SectionScoreCircle';
import { getDailyLogs } from '../utils/storage';
import { calculateRollingAverage } from '../utils/rollingAverage';

export const EnergyDetailScreen = ({ navigation }) => {
  const [allLogs, setAllLogs] = useState({});
  const [rollingAvg, setRollingAvg] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const logs = await getDailyLogs();
    setAllLogs(logs);
    const avg = calculateRollingAverage(logs, 'energy', 7);
    setRollingAvg(avg);
  };

  const prepareChartData = (metric) => {
    const sortedDates = Object.keys(allLogs).sort();
    return sortedDates
      .map((d) => ({
        date: d,
        value:
          metric === 'energy'
            ? parseFloat(allLogs[d].scoreData?.breakdown?.energy || 0) * 10
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
        <Text style={styles.headerTitle}>Energy</Text>
        <Text style={styles.headerSubtitle}>
          Track your calorie balance vs. goals
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Energy Score</Text>
        <Text style={styles.description}>
          Your energy score measures how well your calorie intake aligns with your
          goals (deficit, maintenance, or surplus). Staying within your target range
          maximizes your score.
        </Text>
        <Text style={styles.formula}>
          Score Range: 0.8 - 1.0 (based on calories vs. maintenance)
        </Text>
      </View>

      <TrendChart
        data={prepareChartData('energy')}
        label="Energy Score Trend"
        color="#FF9800"
        suffix="/10"
      />

      <TrendChart
        data={prepareChartData('calories')}
        label="Daily Calories"
        color="#FFB74D"
        suffix="kcal"
      />

      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>Tips for Better Score</Text>
        <Text style={styles.tip}>
          • Deficit: 75-90% of maintenance calories
        </Text>
        <Text style={styles.tip}>
          • Maintenance: 95-105% of maintenance calories
        </Text>
        <Text style={styles.tip}>
          • Surplus: 110-125% of maintenance calories
        </Text>
        <Text style={styles.tip}>• Track consistently for accurate averages</Text>
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
