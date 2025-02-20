export const calculateDuration = (startTime: Date, endTime: Date): number => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return (end - start) / (1000 * 60 * 60); // Retourne la durée en heures
};
