import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getScoreColor } from '../utils/rollingAverage';

/**
 * Clickable card component for each section
 */
export const SectionCard = ({ title, score, icon, onPress }) => {
  const color = getScoreColor(score);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>7-day average</Text>
        </View>
        <View style={[styles.scoreCircle, { borderColor: color }]}>
          <Text style={[styles.score, { color }]}>
            {score > 0 ? score.toFixed(1) : '-'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  scoreCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
