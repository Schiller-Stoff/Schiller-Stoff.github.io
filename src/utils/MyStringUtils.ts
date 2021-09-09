/**
 * Helper module for basic string operations
 */
const MyStringUtils = (() => {
  /**
   * Catches errors thrown by given function and returns the defaultVal instead
   * @param mightThrow function that might throw an error.
   * @param defaultVal by default returns an emtpy string. 
   * @returns returns the succesful calculated string or the defaultValue given as second param
   */
  const catchToString = (
    mightThrow: () => string,
    defaultVal: string = ""
  ): string => {
    let string = "";
    try {
      string = mightThrow();
    } catch (e) {
      string = defaultVal;
    } finally {
      return string;
    }
  };

  return {
    catchToString,
  };
})();


export default MyStringUtils;