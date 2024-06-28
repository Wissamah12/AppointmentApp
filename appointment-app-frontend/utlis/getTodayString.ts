// Helper function to get today's date in YYYY-MM-DD format
 export const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const getMarkedDates = () => {
  const todayString = getTodayString();
  return {
    [todayString]: {
      selected: true,
      marked: true,
      selectedColor: "blue",
    },
  };
};
