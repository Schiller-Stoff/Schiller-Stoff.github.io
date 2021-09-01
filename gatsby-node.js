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
  if (page.pathname === "/") {
    deletePage(page);
    // fetch orcid data
    const persOrcid = await OrcidAPI.fetchPubPerson("0000-0001-6941-113X");

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
