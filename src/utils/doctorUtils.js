/**
 * Utility functions for doctor-related operations
 */

/**
 * Formats a doctor's name with proper "Dr." prefix
 * @param {string} name - The doctor's name
 * @returns {string} - Formatted name with "Dr." prefix
 */
export const formatDoctorName = (name) => {
  if (!name) return '';
  
  // Check if name already has Dr. prefix (with or without dot)
  if (name.startsWith('Dr.') || name.startsWith('Dr ')) {
    return name;
  }
  
  // Add Dr. prefix
  return `Dr. ${name}`;
};

/**
 * Removes "Dr." prefix from a doctor's name
 * @param {string} name - The doctor's name (possibly with Dr. prefix)
 * @returns {string} - Clean name without prefix
 */
export const cleanDoctorName = (name) => {
  if (!name) return '';
  
  // Remove Dr. prefix (with or without dot)
  if (name.startsWith('Dr. ')) {
    return name.substring(4);
  }
  if (name.startsWith('Dr ')) {
    return name.substring(3);
  }
  if (name.startsWith('Dr.')) {
    return name.substring(3).trim();
  }
  
  return name;
};

/**
 * Validates if a name has proper format (no double prefixes)
 * @param {string} name - The doctor's name
 * @returns {boolean} - True if name is properly formatted
 */
export const isValidDoctorName = (name) => {
  if (!name) return false;
  
  // Check for double Dr. prefix
  const lowerName = name.toLowerCase();
  return !lowerName.includes('dr. dr.') && !lowerName.includes('dr dr');
};

/**
 * Gets the display name for a doctor (with Dr. prefix)
 * @param {Object} doctor - Doctor object
 * @returns {string} - Formatted display name
 */
export const getDoctorDisplayName = (doctor) => {
  if (!doctor || !doctor.name) return 'Unknown Doctor';
  return formatDoctorName(doctor.name);
};

/**
 * Gets the clean name for a doctor (without Dr. prefix)
 * @param {Object} doctor - Doctor object
 * @returns {string} - Clean name without prefix
 */
export const getDoctorCleanName = (doctor) => {
  if (!doctor || !doctor.name) return '';
  return cleanDoctorName(doctor.name);
};
