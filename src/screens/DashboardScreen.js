import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SectionScoreCircle } from '../components/SectionScoreCircle';
import { SectionCard } from '../components/SectionCard';
import { getDailyLogs } from '../utils/storage';
import {
  calculateAllRollingAverages,
  calculateOverallRollingAverage,
} from '../utils/rollingAverage';

export const DashboardScreen = ({ navigation }) => {
  const [allLogs, setAllLogs] = useState({});
  const [rollingAverages, setRollingAverages] = useState({
    nutrition: 0,
    energy: 0,
    activity: 0,
    recovery: 0,
  });
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    loadData();

    // Refresh data when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const logs = await getDailyLogs();
    setAllLogs(logs);

    const averages = calculateAllRollingAverages(logs, 7);
    setRollingAverages(averages);

    const overall = calculateOverallRollingAverage(logs, 7);
    setOverallScore(overall);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>FlexLog</Text>
          <Text style={styles.subtitle}>Your Performance Dashboard</Text>
        </View>

        <View style={styles.topNav}>
          <SectionScoreCircle
            title="Overall"
            score={overallScore}
            size="large"
            onPress={() => navigation.navigate('DataEntry')}
          />
        </View>

        <View style={styles.sectionsContainer}>
          <Text style={styles.sectionsTitle}>Performance Sections</Text>
          <Text style={styles.sectionsSubtitle}>
            Tap any section to view detailed metrics
          </Text>

          <SectionCard
            title="Nutrition"
            score={rollingAverages.nutrition}
            icon="🍎"
            onPress={() => navigation.navigate('NutritionDetail')}
          />

          <SectionCard
            title="Energy"
            score={rollingAverages.energy}
            icon="⚡"
            onPress={() => navigation.navigate('EnergyDetail')}
          />

          <SectionCard
            title="Activity"
            score={rollingAverages.activity}
            icon="🏃"
            onPress={() => navigation.navigate('ActivityDetail')}
          />

          <SectionCard
            title="Recovery"
            score={rollingAverages.recovery}
            icon="😴"
            onPress={() => navigation.navigate('RecoveryDetail')}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Rolling averages are calculated from the last 7 days
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  topNav: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionsContainer: {
    paddingHorizontal: 16,
  },
  sectionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  footer: {
    marginTop: 24,
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
