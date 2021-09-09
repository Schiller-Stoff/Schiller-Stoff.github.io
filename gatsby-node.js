const OrcidAPI = require("./api/orcid");

/**
 *  
 * 
 * 
  exports.createPages = async ({ actions: { createPage } }) => {
    // `getPokemonData` is a function that fetches our data
    const persOrcid = await OrcidAPI.fetchPubPerson("0000-0001-6941-113X");
    // Create a page that lists all Pokémon.
    createPage({
      path: `/orcid`,
      component: require.resolve("./src/templates/OrcidPerson.js"),
      context: { persOrcid },
    })
  }

*/

/**
 * Passes orcid page data to each page.
 *
 */
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  // only index page will be supplied with orcid data
  if (page.path === "/") {
    deletePage(page);
    // fetch orcid data using env variable
    if(!process.env.ORCID_ID) throw new ReferenceError("Found no ORCID_ID in given dot env file. Please make sure to define ORCID_ID via standard dotenev workflow before starting Gatsby.");
    const persOrcid = await OrcidAPI.fetchPubPerson(process.env.ORCID_ID);

    // You can access the variable "house" in your page queries now
    createPage({
      ...page,
      context: {
        ...page.context,
        persOrcid,
      },
    });
  }
};
