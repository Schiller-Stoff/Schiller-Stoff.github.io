
const OrcidAPI = require("./api/orcid");

exports.createPages = async ({ actions: { createPage } }) => {
  // `getPokemonData` is a function that fetches our data
  const persOrcid = await OrcidAPI.fetchPubPerson("0000-0001-6941-113X");
  // Create a page that lists all Pokémon.
  createPage({
    path: `/orcid`,
    component: require.resolve("./src/templates/OrcidPerson.js"),
    context: { persOrcid },
  })
  // Create a page for each Pokémon.
  // allPokemon.forEach(pokemon => {
  //   createPage({
  //     path: `/pokemon/${pokemon.name}/`,
  //     component: require.resolve("./src/templates/pokemon.js"),
  //     context: { pokemon },
  //   })
  // })
}