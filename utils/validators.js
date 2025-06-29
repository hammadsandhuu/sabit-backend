exports.validateForm = (data) => {
  if (!data.userName || !data.userEmail || !data.selectedDate)
    return "Missing required fields";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.userEmail)) return "Invalid email format";

  const date = new Date(data.selectedDate);
  if (isNaN(date.getTime())) return "Invalid date";
  if (date <= new Date()) return "Meeting date must be in the future";

  return null;
};
