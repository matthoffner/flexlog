import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const DateNavigation = ({ currentDate, onDateChange }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isToday = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const changeDate = (days) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    onDateChange(date.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onDateChange(today);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => changeDate(-1)}
      >
        <Text style={styles.navButtonText}>←</Text>
      </TouchableOpacity>

      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
        {!isToday(currentDate) && (
          <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
            <Text style={styles.todayButtonText}>Go to Today</Text>
          </TouchableOpacity>
        )}
        {isToday(currentDate) && (
          <Text style={styles.todayIndicator}>Today</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.navButton, isToday(currentDate) && styles.navButtonDisabled]}
        onPress={() => changeDate(1)}
        disabled={isToday(currentDate)}
      >
        <Text style={[styles.navButtonText, isToday(currentDate) && styles.navButtonTextDisabled]}>
          →
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  navButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  navButtonTextDisabled: {
    color: '#999',
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  todayButton: {
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
  },
  todayButtonText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  todayIndicator: {
    marginTop: 4,
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
});
