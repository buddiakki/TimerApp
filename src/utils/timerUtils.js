export const calculateProgress = (remainingTime, duration) => {
    return remainingTime / duration;
  };
  
  export const shouldTriggerAlert = (remainingTime, duration) => {
    return remainingTime === duration / 2;
  };
  