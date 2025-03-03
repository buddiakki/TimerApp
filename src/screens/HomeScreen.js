import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CategorySection from '../componenrs/CategorySection';
import useStore from '../store';

const HomeScreen = ({ navigation }) => {
  const [timers, setTimers] = useState([]);
  const [newTimer, setNewTimer] = useState({ name: '', duration: '', category: '' });
  useEffect(() => {
    loadTimers();
  }, [navigation]);

  const loadTimers = async () => {
    const storedTimers = await AsyncStorage.getItem('timers');
    if (storedTimers) {
      setTimers(JSON.parse(storedTimers));
    }
  };

  const saveTimers = async (updatedTimers) => {
    setTimers(updatedTimers);
    await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };

  const addTimer = () => {
    const { name, duration, category } = newTimer;
    if (!name || !duration || !category) return;
    const newEntry = { id: Date.now(), ...newTimer, remainingTime: parseInt(duration), status: 'Paused' };
    const updatedTimers = [...timers, newEntry];
    saveTimers(updatedTimers);
    setNewTimer({ name: '', duration: '', category: '' });
  };

  const removeAllTimers = async () => {
    try {
      const clearTimers = useStore.getState().removeAllTimers;
      clearTimers();
      setTimers([]);
      await AsyncStorage.removeItem('timers');
      console.log('All timers removed successfully');
    } catch (error) {
      console.error('Failed to remove timers:', error);
    }
  };
  


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Timer</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={newTimer.name}
        onChangeText={(text) => setNewTimer({ ...newTimer, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Duration (seconds)"
        keyboardType="numeric"
        value={newTimer.duration}
        onChangeText={(text) => setNewTimer({ ...newTimer, duration: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={newTimer.category}
        onChangeText={(text) => setNewTimer({ ...newTimer, category: text })}
      />
      <Button title="Add Timer" onPress={addTimer} />

      <FlatList
        data={Object.entries(
          timers.reduce((acc, timer) => {
            acc[timer.category] = [...(acc[timer.category] || []), timer];
            return acc;
          }, {})
        )}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => (
          <CategorySection category={item[0]} timers={item[1]} saveTimers={saveTimers} />
        )}
      />

     <View style={styles.buttons}>
        <Button title="Remove All Timers" onPress={removeAllTimers} />
        <Button title="View History" onPress={() => navigation.navigate('History')} />
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
    buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },

  });

export default HomeScreen;
