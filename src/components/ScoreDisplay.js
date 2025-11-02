import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ScoreDisplay = ({ score, breakdown }) => {
  const getScoreColor = (score) => {
    if (score >= 8) return '#4CAF50'; // Green
    if (score >= 6) return '#FFC107'; // Yellow
    if (score >= 4) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getScoreGrade = (score) => {
    if (score >= 9) return 'Excellent';
    if (score >= 8) return 'Great';
    if (score >= 7) return 'Good';
    if (score >= 6) return 'Fair';
    if (score >= 5) return 'Average';
    return 'Needs Improvement';
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainScore}>
        <Text style={styles.scoreLabel}>Daily Performance Score</Text>
        <Text style={[styles.score, { color: getScoreColor(score) }]}>
          {score.toFixed(1)}
        </Text>
        <Text style={styles.grade}>{getScoreGrade(score)}</Text>
      </View>

      {breakdown && (
        <View style={styles.breakdown}>
          <Text style={styles.breakdownTitle}>Breakdown</Text>
          <View style={styles.breakdownGrid}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Nutrition</Text>
              <Text style={styles.breakdownValue}>{breakdown.nutrition}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Energy</Text>
              <Text style={styles.breakdownValue}>{breakdown.energy}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Activity</Text>
              <Text style={styles.breakdownValue}>{breakdown.activity}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Recovery</Text>
              <Text style={styles.breakdownValue}>{breakdown.recovery}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainScore: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  score: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  grade: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  breakdown: {
    marginTop: 20,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  breakdownValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
});
