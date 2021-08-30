
/**
 * Helper to fetch against orcid's public data. 
 */
const OrcidAPI = (() => {
  const ORCID_PUBLIC_ENDPOINT = "https://pub.orcid.org/v2.1/";

  /**
   * Fetches JSON representation of given person id. 
   * @param {string} orcid orcid id of given person
   * @param {string} mimeType allowed mimetype define by orcid 
   * @returns 
   */
  const fetchPubPerson = async (orcid, mimeType = "application/json") => {

    const resp = await fetch(`${ORCID_PUBLIC_ENDPOINT}${orcid}`, {
      headers: {
        accept: mimeType,
      },
    });

    const parsed = await resp.json();
    return parsed;
  };

  return {
    fetchPubPerson,
  };
})();

module.exports = {
  OrcidAPI,
};
