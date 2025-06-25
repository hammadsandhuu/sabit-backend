exports.validateForm = (data) => {
  if (
    !data.userName ||
    !data.userEmail ||
    !data.selectedDate ||
    !data.selectedTime
  )
    return "Missing required fields";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.userEmail)) return "Invalid email format";
  const date = new Date(`${data.selectedDate}T${data.selectedTime}`);
  if (date <= new Date()) return "Meeting date must be in the future";
  return null;
};
