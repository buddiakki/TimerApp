import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import TimerCard from './TimerCard';

const CategorySection = ({ category, timers, saveTimers }) => {
  const [collapsed, setCollapsed] = useState(false);

  const validTimers = Array.isArray(timers) ? timers : []; // Validate timers

  const bulkAction = (action) => {
    if (!validTimers.length) return; // Skip if no timers
    const updatedTimers = validTimers.map((timer) => ({
      ...timer,
      status: action === 'Start' ? 'Running' : 'Paused',
    }));
    saveTimers(updatedTimers);
  };

  return (
    <View>
      <Text style={styles.header} onPress={() => setCollapsed(!collapsed)}>
        {category} ({validTimers.length})
      </Text>
      {!collapsed && (
        <>
          {validTimers.length === 0 ? (
            <Text style={styles.placeholder}>No timers available in this category</Text>
          ) : (
            <FlatList
              data={validTimers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <TimerCard timer={item} saveTimers={saveTimers} />}
            />
          )}
          {/* <View style={styles.actions}>
            <Button title="Start All" onPress={() => bulkAction('Start')} />
            <Button title="Pause All" onPress={() => bulkAction('Pause')} />
          </View> */}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  placeholder: { fontSize: 16, color: '#888', textAlign: 'center', marginVertical: 10 },
});

export default CategorySection;
