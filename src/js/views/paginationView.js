import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  //addHandlerClick
  //Determines which page button was clicked and invokes
  //callback to controller to render new page
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = Number(btn.dataset.goto);
      handler(goToPage);
    });
  }

  //_generateMarkup
  //Determines which page buttons need to be rendered based on
  //current page number
  //Returns HTML markup of necessary buttons
  _generateMarkup() {
    const curPage = this._data.page;
    //Compute number of pages
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //First page with more pages, only generate next page button
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupNextButton();
    }
    //First page with no more pages, no page buttons
    else if (curPage === 1 && numPages === 1) {
      return '';
    }
    //Last page, only generate previous page button
    else if (curPage === numPages && numPages > 1) {
      return this._generateMarkupPreviousButton();
    }
    //Middle pages, generate next page and previous page buttons
    else {
      return (
        this._generateMarkupNextButton() + this._generateMarkupPreviousButton()
      );
    }
  }

  //_generateMarkupNextButton
  //Returns HTML markup for next page button
  _generateMarkupNextButton() {
    const curPage = this._data.page;
    return `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
  }

  //_generateMarkupPreviousButton
  //Returns HTML markup for previous page button
  _generateMarkupPreviousButton() {
    const curPage = this._data.page;
    return `
      <button data-goto="${
        curPage - 1
      }"class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
              </svg>
        <span>${curPage - 1}</span>
      </button>
    `;
  }
}

export default new PaginationView();
