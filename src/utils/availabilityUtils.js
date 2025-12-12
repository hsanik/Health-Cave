/**
 * Utility functions for doctor availability management
 */

/**
 * Get current day name in lowercase
 * @returns {string} - Day name (e.g., "monday", "tuesday")
 */
export const getCurrentDay = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date();
  return days[today.getDay()];
};

/**
 * Check if doctor is available today based on their schedule
 * @param {Object} doctor - Doctor object with availability array
 * @returns {boolean} - True if available today
 */
export const isAvailableToday = (doctor) => {
  if (!doctor.availability || !Array.isArray(doctor.availability)) {
    return false;
  }

  const today = getCurrentDay();
  const todaySchedule = doctor.availability.find(slot => slot.day === today);

  if (!todaySchedule || !todaySchedule.isAvailable) {
    return false;
  }

  // Check if current time is within working hours
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return currentTime >= todaySchedule.startTime && currentTime <= todaySchedule.endTime;
};

/**
 * Get availability status string
 * @param {Object} doctor - Doctor object
 * @returns {string} - "Available" or "Unavailable"
 */
export const getAvailabilityStatus = (doctor) => {
  if (!doctor.availability || !Array.isArray(doctor.availability)) {
    return 'Unavailable';
  }

  const today = getCurrentDay();
  const todaySchedule = doctor.availability.find(slot => slot.day === today);

  if (!todaySchedule || !todaySchedule.isAvailable) {
    return 'Unavailable';
  }

  // Check if current time is within working hours
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  if (currentTime >= todaySchedule.startTime && currentTime <= todaySchedule.endTime) {
    return 'Available';
  }

  return 'Unavailable';
};

/**
 * Get next available day for the doctor
 * @param {Object} doctor - Doctor object with availability array
 * @returns {string} - Next available day (e.g., "Today", "Tomorrow", "Monday")
 */
export const getNextAvailable = (doctor) => {
  if (!doctor.availability || !Array.isArray(doctor.availability)) {
    return 'Not Available';
  }

  const today = new Date();
  const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDayIndex = today.getDay();

  // Check today first
  const todayName = dayOrder[currentDayIndex];
  const todaySchedule = doctor.availability.find(slot => slot.day === todayName);

  if (todaySchedule?.isAvailable) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    if (currentTime < todaySchedule.endTime) {
      return 'Today';
    }
  }

  // Check next 7 days
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentDayIndex + i) % 7;
    const nextDayName = dayOrder[nextDayIndex];
    const nextSchedule = doctor.availability.find(slot => slot.day === nextDayName);

    if (nextSchedule?.isAvailable) {
      if (i === 1) return 'Tomorrow';
      return nextDayName.charAt(0).toUpperCase() + nextDayName.slice(1);
    }
  }

  return 'Not Available';
};

/**
 * Format time from 24h to 12h format
 * @param {string} timeString - Time in HH:MM format
 * @returns {string} - Formatted time (e.g., "2:30 PM")
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

/**
 * Get today's working hours for a doctor
 * @param {Object} doctor - Doctor object
 * @returns {string} - Working hours or off day message
 */
export const getTodayWorkingHours = (doctor) => {
  if (!doctor.availability || !Array.isArray(doctor.availability)) {
    return 'Schedule not available';
  }

  const today = getCurrentDay();
  const todaySchedule = doctor.availability.find(slot => slot.day === today);

  if (!todaySchedule || !todaySchedule.isAvailable) {
    return 'Off Day';
  }

  return `${formatTime(todaySchedule.startTime)} - ${formatTime(todaySchedule.endTime)}`;
};

/**
 * Get weekly schedule formatted
 * @param {Object} doctor - Doctor object
 * @returns {Array} - Array of schedule objects
 */
export const getWeeklySchedule = (doctor) => {
  if (!doctor.availability || !Array.isArray(doctor.availability)) {
    return [];
  }

  const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  return dayOrder.map(day => {
    const schedule = doctor.availability.find(slot => slot.day === day);
    const dayName = day.charAt(0).toUpperCase() + day.slice(1);
    
    if (!schedule || !schedule.isAvailable) {
      return {
        day: dayName,
        status: 'Off Day',
        hours: null,
        isAvailable: false
      };
    }

    return {
      day: dayName,
      status: 'Available',
      hours: `${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`,
      isAvailable: true
    };
  });
};

/**
 * Check if doctor has availability array (new format) or string (old format)
 * @param {Object} doctor - Doctor object
 * @returns {boolean} - True if using new availability format
 */
export const hasScheduleFormat = (doctor) => {
  return doctor.availability && Array.isArray(doctor.availability);
};

/**
 * Process doctor data to add computed availability fields
 * @param {Object} doctor - Raw doctor object
 * @returns {Object} - Doctor with computed availability
 */
export const processDoctorAvailability = (doctor) => {
  return {
    ...doctor,
    availabilityStatus: getAvailabilityStatus(doctor),
    nextAvailable: getNextAvailable(doctor),
    todayWorkingHours: getTodayWorkingHours(doctor),
    isAvailableNow: isAvailableToday(doctor)
  };
};
