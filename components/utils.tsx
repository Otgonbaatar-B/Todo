export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("mn-MN");
};

export const formatTime = (time: string) => {
  return time.substring(0, 5);
};
