import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

export const WorkoutLogger = ({ onAddWorkout, workouts = [], activityNames = [] }) => {
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  useEffect(() => {
    if (exercise.length > 0) {
      const filtered = activityNames.filter(name =>
        name.toLowerCase().includes(exercise.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && filtered[0].toLowerCase() !== exercise.toLowerCase());
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [exercise, activityNames]);

  const handleAdd = () => {
    if (exercise && sets && reps) {
      onAddWorkout({
        exercise,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: weight ? parseFloat(weight) : 0,
        timestamp: new Date().toISOString()
      });
      // Clear form
      setExercise('');
      setSets('');
      setReps('');
      setWeight('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionPress = (suggestion) => {
    setExercise(suggestion);
    setShowSuggestions(false);
  };

  const renderWorkout = ({ item }) => (
    <View style={styles.workoutItem}>
      <Text style={styles.exerciseName}>{item.exercise}</Text>
      <Text style={styles.workoutDetails}>
        {item.sets} sets × {item.reps} reps
        {item.weight > 0 && ` @ ${item.weight} lbs`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Workout</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={exercise}
          onChangeText={setExercise}
          placeholder="Exercise name"
          placeholderTextColor="#999"
          testID="exercise-name-input"
          accessibilityLabel="Exercise name"
        />

        {showSuggestions && filteredSuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.smallInput]}
            value={sets}
            onChangeText={setSets}
            placeholder="Sets"
            placeholderTextColor="#999"
            keyboardType="numeric"
            testID="sets-input"
            accessibilityLabel="Sets"
          />
          <TextInput
            style={[styles.input, styles.smallInput]}
            value={reps}
            onChangeText={setReps}
            placeholder="Reps"
            placeholderTextColor="#999"
            keyboardType="numeric"
            testID="reps-input"
            accessibilityLabel="Reps"
          />
          <TextInput
            style={[styles.input, styles.smallInput]}
            value={weight}
            onChangeText={setWeight}
            placeholder="Weight (lbs)"
            placeholderTextColor="#999"
            keyboardType="numeric"
            testID="weight-input"
            accessibilityLabel="Weight"
          />
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          testID="add-exercise-button"
          accessibilityLabel="Add Exercise"
        >
          <Text style={styles.addButtonText}>Add Exercise</Text>
        </TouchableOpacity>
      </View>

      {workouts.length > 0 && (
        <View style={styles.workoutsList}>
          <Text style={styles.workoutsTitle}>Today's Workouts</Text>
          <FlatList
            data={workouts}
            renderItem={renderWorkout}
            keyExtractor={(item, index) => index.toString()}
          />
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  form: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  workoutsList: {
    marginTop: 16,
  },
  workoutsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  workoutItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  workoutDetails: {
    fontSize: 14,
    color: '#666',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 16,
    color: '#2196F3',
  },
});
