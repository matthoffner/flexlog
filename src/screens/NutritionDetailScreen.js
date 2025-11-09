import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TrendChart } from '../components/TrendChart';
import { SectionScoreCircle } from '../components/SectionScoreCircle';
import { getDailyLogs } from '../utils/storage';
import { calculateRollingAverage } from '../utils/rollingAverage';

export const NutritionDetailScreen = ({ navigation }) => {
  const [allLogs, setAllLogs] = useState({});
  const [rollingAvg, setRollingAvg] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const logs = await getDailyLogs();
    setAllLogs(logs);
    const avg = calculateRollingAverage(logs, 'nutrition', 7);
    setRollingAvg(avg);
  };

  const prepareChartData = (metric) => {
    const sortedDates = Object.keys(allLogs).sort();
    return sortedDates
      .map((d) => ({
        date: d,
        value:
          metric === 'nutrition'
            ? parseFloat(allLogs[d].scoreData?.breakdown?.nutrition || 0) * 10
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
        <Text style={styles.headerTitle}>Nutrition</Text>
        <Text style={styles.headerSubtitle}>
          Track your protein and calorie intake
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Nutrition Score</Text>
        <Text style={styles.description}>
          Your nutrition score is calculated based on your protein-to-calorie ratio.
          Higher protein intake relative to total calories results in a better score.
        </Text>
        <Text style={styles.formula}>Formula: (Protein ÷ Calories) × 10</Text>
      </View>

      <TrendChart
        data={prepareChartData('nutrition')}
        label="Nutrition Score Trend"
        color="#FF6B6B"
        suffix="/10"
      />

      <TrendChart
        data={prepareChartData('protein')}
        label="Protein Intake"
        color="#4ECDC4"
        suffix="g"
      />

      <TrendChart
        data={prepareChartData('calories')}
        label="Calorie Intake"
        color="#95E1D3"
        suffix="kcal"
      />

      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>Tips for Better Score</Text>
        <Text style={styles.tip}>• Aim for 0.8-1g protein per lb of body weight</Text>
        <Text style={styles.tip}>• Focus on lean protein sources</Text>
        <Text style={styles.tip}>• Spread protein intake throughout the day</Text>
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
