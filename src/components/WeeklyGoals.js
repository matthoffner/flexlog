import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';

export const WeeklyGoals = ({ goals, progress, onSaveGoals }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [workoutsGoal, setWorkoutsGoal] = useState(goals.workouts?.toString() || '');
  const [totalRepsGoal, setTotalRepsGoal] = useState(goals.totalReps?.toString() || '');
  const [proteinGoal, setProteinGoal] = useState(goals.protein?.toString() || '');
  const [caloriesGoal, setCaloriesGoal] = useState(goals.calories?.toString() || '');

  const handleSave = () => {
    onSaveGoals({
      workouts: parseInt(workoutsGoal) || 0,
      totalReps: parseInt(totalRepsGoal) || 0,
      protein: parseFloat(proteinGoal) || 0,
      calories: parseFloat(caloriesGoal) || 0
    });
    setModalVisible(false);
  };

  const calculatePercentage = (current, goal) => {
    if (goal === 0) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  const renderGoalProgress = (label, current, goal, unit) => {
    if (goal === 0) return null;
    const percentage = calculatePercentage(current, goal);
    const isComplete = current >= goal;

    return (
      <View style={styles.goalItem}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalLabel}>{label}</Text>
          <Text style={[styles.goalValue, isComplete && styles.goalComplete]}>
            {current} / {goal} {unit}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${percentage}%` },
              isComplete && styles.progressComplete
            ]}
          />
        </View>
        <Text style={styles.progressText}>{percentage.toFixed(0)}%</Text>
      </View>
    );
  };

  const hasGoals = goals.workouts > 0 || goals.totalReps > 0 || goals.protein > 0 || goals.calories > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Goals</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.editButtonText}>Set Goals</Text>
        </TouchableOpacity>
      </View>

      {hasGoals ? (
        <View style={styles.goalsContainer}>
          {renderGoalProgress('Workouts', progress.workouts, goals.workouts, 'workouts')}
          {renderGoalProgress('Total Reps', progress.totalReps, goals.totalReps, 'reps')}
          {renderGoalProgress('Protein', progress.protein, goals.protein, 'g')}
          {renderGoalProgress('Calories', progress.calories, goals.calories, 'kcal')}
        </View>
      ) : (
        <Text style={styles.noGoalsText}>No weekly goals set. Tap "Set Goals" to get started!</Text>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Weekly Goals</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Workouts per week</Text>
              <TextInput
                style={styles.input}
                value={workoutsGoal}
                onChangeText={setWorkoutsGoal}
                placeholder="5"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Total reps per week</Text>
              <TextInput
                style={styles.input}
                value={totalRepsGoal}
                onChangeText={setTotalRepsGoal}
                placeholder="500"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Total protein per week (g)</Text>
              <TextInput
                style={styles.input}
                value={proteinGoal}
                onChangeText={setProteinGoal}
                placeholder="1000"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Total calories per week</Text>
              <TextInput
                style={styles.input}
                value={caloriesGoal}
                onChangeText={setCaloriesGoal}
                placeholder="14000"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save Goals</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  editButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  goalsContainer: {
    gap: 16,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  goalValue: {
    fontSize: 14,
    color: '#666',
  },
  goalComplete: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
  },
  progressComplete: {
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  noGoalsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
