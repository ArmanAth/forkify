import * as model from './model.js';
import { MODAL_CLOSE_SECONDS } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

//controlRecipe
//gets recipe id from url hash
//gets recipe state from model module
//passes recipe state to recipeView, updating page
const controlRecipe = async function () {
  try {
    //Get recipe id from url hash
    const id = window.location.hash.slice(1);

    //Guard for page opening with no hash
    if (!id) return;

    //Loading spinner
    recipeView.renderSpinner();

    //Updating results view to mark selection
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    //Load in recipe
    await model.loadRecipe(id);

    //Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(`${err}`);
  }
};

//controlSearchResults
//called by searchView when search is made by user
//calls model to make API request with user search query
//gets updated state of search results and passes to searchView for
//DOM update
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //Get search query and guard against empty search
    const query = searchView.getQuery();
    if (!query) return;

    //call model to make API request
    await model.loadSearchResults(query);

    //render search results
    resultsView.render(model.getSearchResultsPage());
    //render page buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

//controlPagination
const controlPagination = function (goToPage) {
  //render search results
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);

  //Rendering recipe
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.removeBookmark(model.state.recipe.id);
  }

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    //Render uploaded recipe
    recipeView.render(model.state.recipe);

    //Display succesful upload message
    addRecipeView.renderMessage();

    //Re render bookmark view to add new recipe to it
    bookmarksView.render(model.state.bookmarks);

    //Changing URL hash to new recipe ID
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
