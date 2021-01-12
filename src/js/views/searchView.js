class SearchView {
  _parentElement = document.querySelector('.search');

  //getQuery
  //Obtains user input in search field and clears the field
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  //addHandlerSearch(handler)
  //Listens for user search then invokes callback function from controller
  //to process the search
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
