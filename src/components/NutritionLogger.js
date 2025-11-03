import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

export const NutritionLogger = ({ onAddNutrition, nutritionLogs = [] }) => {
  const [description, setDescription] = useState('');
  const [protein, setProtein] = useState('');
  const [calories, setCalories] = useState('');

  const handleAdd = () => {
    if (description && (protein || calories)) {
      onAddNutrition({
        description,
        protein: protein ? parseFloat(protein) : 0,
        calories: calories ? parseFloat(calories) : 0,
        timestamp: new Date().toISOString()
      });
      // Clear form
      setDescription('');
      setProtein('');
      setCalories('');
    }
  };

  const getTotals = () => {
    return nutritionLogs.reduce(
      (acc, log) => ({
        protein: acc.protein + (log.protein || 0),
        calories: acc.calories + (log.calories || 0)
      }),
      { protein: 0, calories: 0 }
    );
  };

  const totals = getTotals();

  const renderNutritionLog = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.logDescription}>{item.description}</Text>
      <Text style={styles.logDetails}>
        {item.protein > 0 && `${item.protein}g protein`}
        {item.protein > 0 && item.calories > 0 && ' • '}
        {item.calories > 0 && `${item.calories} kcal`}
      </Text>
      <Text style={styles.logTime}>
        {new Date(item.timestamp).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Nutrition</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="What did you eat? (e.g., Chicken breast, Protein shake)"
          placeholderTextColor="#999"
          testID="nutrition-description-input"
          accessibilityLabel="Nutrition description"
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.smallInput]}
            value={protein}
            onChangeText={setProtein}
            placeholder="Protein (g)"
            placeholderTextColor="#999"
            keyboardType="numeric"
            testID="protein-input"
            accessibilityLabel="Protein"
          />
          <TextInput
            style={[styles.input, styles.smallInput]}
            value={calories}
            onChangeText={setCalories}
            placeholder="Calories"
            placeholderTextColor="#999"
            keyboardType="numeric"
            testID="calories-input"
            accessibilityLabel="Calories"
          />
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          testID="add-nutrition-button"
          accessibilityLabel="Add Nutrition"
        >
          <Text style={styles.addButtonText}>Add Entry</Text>
        </TouchableOpacity>
      </View>

      {nutritionLogs.length > 0 && (
        <View style={styles.logsList}>
          <View style={styles.totalsHeader}>
            <Text style={styles.logsTitle}>Today's Nutrition</Text>
            <Text style={styles.totalsText}>
              Total: {totals.protein.toFixed(1)}g protein • {totals.calories.toFixed(0)} kcal
            </Text>
          </View>
          <FlatList
            data={nutritionLogs}
            renderItem={renderNutritionLog}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
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
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logsList: {
    marginTop: 16,
  },
  totalsHeader: {
    marginBottom: 12,
  },
  logsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  totalsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
  },
  logItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  logDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  logDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  logTime: {
    fontSize: 12,
    color: '#999',
  },
});
