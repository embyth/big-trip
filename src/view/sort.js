import {SortType} from '../const';
import AbstractView from './abstract';

const createTripSortTemplate = (sortType) => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">${sortType === SortType.DEFAULT ? `Day` : ``}</span>

      ${Object
        .values(SortType)
        .map((type) => {
          return (
            `<div class="trip-sort__item  trip-sort__item--${type}">
              <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" ${sortType === type ? `checked` : ``}>
              <label class="trip-sort__btn" for="sort-${type}">
                ${type}
                <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
                  <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
                </svg>
              </label>
            </div>`
          );
        })
        .join(``)}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    this._callback.sortTypeChange(evt.target.value.replace(`sort-`, ``));
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement()
      .querySelectorAll(`.trip-sort__input`)
      .forEach((item) => item.addEventListener(`change`, this._sortTypeChangeHandler));
  }
}
