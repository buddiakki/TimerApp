import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useStore from '../store';
const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const timersData = useStore((state) => state.timersData);

  console.log('timersData', timersData)

  useEffect(() => {
    loadHistory();
  }, [timersData]);

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('timers');
      const parsedHistory = storedHistory
        ? JSON.parse(storedHistory).map((item) => ({
            ...item,
            completedAt: new Date(item.completedAt),
          }))
        : [];

      const zustandHistory = Object.entries(timersData).map(([id, timer]) => ({
        id, 
        ...timer,
        completedAt: timer.completedAt ? new Date(timer.completedAt) : null,
      }));

      setHistory([...zustandHistory]);
    } catch (error) {
      console.error('Failed to load history:', error);
      setHistory([]);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Timers</Text>
      {history.length === 0 ? (
        <Text>No timers completed yet!</Text>
      ) : (
        <FlatList
  data={history}
  keyExtractor={(item) => item.id || item.name}
  renderItem={({ item }) => {
    console.log('data', history);
    return (
      <View style={styles.item}>
        <Text>{item.name}</Text>
        <Text>
          Completed At:{' '}
          {item.completedAt instanceof Date && !isNaN(item.completedAt)
            ? item.completedAt.toLocaleString()
            : 'Invalid Date'}
        </Text>
      </View>
    );
  }}
/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
});

export default HistoryScreen;
