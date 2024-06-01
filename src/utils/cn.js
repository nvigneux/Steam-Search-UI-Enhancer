/**
 * Combines an array of class names into a single string.
 *
 * @param {Array<string>} classes - The array of class names to combine.
 * @returns {string} - The combined class names as a string.
 */
export default function cn(classes) {
  return classes.filter(Boolean).join(' ');
}
