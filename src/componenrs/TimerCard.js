import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { ProgressBar } from '@react-native-community/progress-bar-android'; // For Android
import useStore from '../store';

const TimerCard = ({ timer, saveTimers }) => {
  const [remainingTime, setRemainingTime] = useState(timer.remainingTime);
  const [status, setStatus] = useState(timer.status);
  const [intervalId, setIntervalId] = useState(null);

  const updateTimers = useStore((state) => state.updateTimers);

  useEffect(() => {
    if (status === 'Running') {
      clearInterval(intervalId);

      const id = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            handleCompletion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [status]);

  const handleStart = () => setStatus('Running');

  const handlePause = () => setStatus('Paused');

  const handleReset = () => {
    setRemainingTime(timer.duration);
    setStatus('Paused');
    saveTimers((prevTimers) =>
      prevTimers.map((t) =>
        t.id === timer.id ? { ...t, remainingTime: timer.duration, status: 'Paused' } : t
      )
    );
  };

  const handleCompletion = () => {
    setStatus('Completed');

    Alert.alert('Timer Completed', `Timer "${timer.name}" has finished!`);
    saveTimers((prevTimers) =>
      prevTimers.map((t) =>
        t.id === timer.id
          ? { ...t, remainingTime: 0, status: 'Completed', completedAt: new Date().toISOString() }
          : t
      )
    );
    updateTimers({
        ...timer,
        remainingTime: 0,
        status: 'Completed',
        completedAt: new Date().toISOString(),
      });

  };

  useEffect(() => {
    saveTimers((prevTimers) =>
      prevTimers.map((t) =>
        t.id === timer.id ? { ...t, remainingTime, status } : t
      )
    );
  }, [remainingTime, status]);

  const progress = Math.max(0, Math.min(1, remainingTime / Math.max(1, timer.duration)));

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{timer.name}</Text>
      <Text>Status: {status}</Text>
      <Text>Time Remaining: {remainingTime}s</Text>
      <ProgressBar
        styleAttr="Horizontal"
        indeterminate={false}
        progress={progress}
        color="blue"
        style={{ height: 20, width: '100%' , marginTop: 10}} // Ensure proper height and width
      />
      <View style={styles.actions}>
        <Button title="Start" onPress={handleStart} disabled={status === 'Running'} />
        <Button title="Pause" onPress={handlePause} disabled={status !== 'Running'} />
        <Button title="Reset" onPress={handleReset} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 15, marginBottom: 10, backgroundColor: '#f9f9f9', borderRadius: 5 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
});

export default TimerCard;
