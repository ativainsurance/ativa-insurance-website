/**
 * Validates a human date of birth string (YYYY-MM-DD).
 * Returns an error message string, or null if valid.
 *
 * Rules:
 *  - Date must not be in the future
 *  - Age must not exceed 110 years
 */
export function validateDOB(dob: string): string | null {
  if (!dob) return null; // presence check handled separately
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  if (birthDate > today) {
    return "Date of birth cannot be in the future";
  }
  if (age > 110) {
    return "Please enter a valid date of birth";
  }
  return null;
}

/**
 * Validates a pet date of birth string (YYYY-MM-DD).
 * Returns an error message string, or null if valid.
 *
 * Rules:
 *  - Date must not be in the future
 *  (No maximum age cap applied for pets)
 */
export function validatePetDOB(dob: string): string | null {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();

  if (birthDate > today) {
    return "Date of birth cannot be in the future";
  }
  return null;
}
