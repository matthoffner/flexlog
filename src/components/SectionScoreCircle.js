import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getScoreColor } from '../utils/rollingAverage';

/**
 * Circular score display component for section navigation
 * Similar to Oura app's ring-based score display
 */
export const SectionScoreCircle = ({ title, score, onPress, size = 'medium' }) => {
  const circleSize = size === 'large' ? 80 : size === 'small' ? 50 : 65;
  const fontSize = size === 'large' ? 24 : size === 'small' ? 16 : 20;
  const titleSize = size === 'large' ? 14 : size === 'small' ? 10 : 12;

  const color = getScoreColor(score);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View
        style={[
          styles.circle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            borderColor: color,
          },
        ]}
      >
        <Text style={[styles.score, { fontSize, color }]}>
          {score > 0 ? score.toFixed(1) : '-'}
        </Text>
      </View>
      <Text style={[styles.title, { fontSize: titleSize }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  circle: {
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  score: {
    fontWeight: 'bold',
  },
  title: {
    marginTop: 6,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
});
