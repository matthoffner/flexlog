import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const BADGE_LEVELS = {
  BRONZE: { name: 'Bronze', color: '#CD7F32', icon: '🥉' },
  SILVER: { name: 'Silver', color: '#C0C0C0', icon: '🥈' },
  GOLD: { name: 'Gold', color: '#FFD700', icon: '🥇' },
  PLATINUM: { name: 'Platinum', color: '#E5E4E2', icon: '💎' },
  DIAMOND: { name: 'Diamond', color: '#B9F2FF', icon: '💠' }
};

export const Badges = ({ badges = [] }) => {
  const renderBadge = ({ item }) => {
    const level = BADGE_LEVELS[item.level] || BADGE_LEVELS.BRONZE;

    return (
      <View style={styles.badgeItem}>
        <View style={[styles.badgeIcon, { backgroundColor: level.color }]}>
          <Text style={styles.badgeEmoji}>{level.icon}</Text>
        </View>
        <View style={styles.badgeInfo}>
          <Text style={styles.badgeName}>{item.name}</Text>
          <Text style={styles.badgeLevel}>{level.name}</Text>
          <Text style={styles.badgeDate}>
            Earned {new Date(item.earnedDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  if (badges.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Badges</Text>
        <Text style={styles.emptyText}>
          Complete your weekly goals to earn badges! Higher badges are awarded for completing goals multiple weeks in a row.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Badges</Text>
        <View style={styles.badgeCount}>
          <Text style={styles.badgeCountText}>{badges.length}</Text>
        </View>
      </View>
      <FlatList
        data={badges}
        renderItem={renderBadge}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
        contentContainerStyle={styles.badgeList}
      />
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
  badgeCount: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeCountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  badgeList: {
    gap: 12,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeEmoji: {
    fontSize: 32,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  badgeLevel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  badgeDate: {
    fontSize: 12,
    color: '#999',
  },
});
