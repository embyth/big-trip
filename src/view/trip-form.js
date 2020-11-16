import AbstractView from './abstract';
import {formatEventType, formatDateTime} from '../utils/trip';
import {capitalizeFirstLetter} from '../utils/common';
import {generateDescription, generatePhotos, generateOffers} from '../mock/trip';
import {DESTINATIONS, EVENT_TYPE} from '../const';

const createOfferItemTemplate = (offer) => {
  const {name, label, price, isChecked} = offer;
  const checked = isChecked ? `checked` : ``;
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-1" type="checkbox" name="event-offer-${name}" ${checked}>
      <label class="event__offer-label" for="event-offer-${name}-1">
        <span class="event__offer-title">${label}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const createOffersTemplate = (offers) => {
  if (offers.length) {
    return (
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${offers
            .map(createOfferItemTemplate)
            .join(``)}
        </div>
      </section>`
    );
  } else {
    return ``;
  }
};

const createImageElement = ({src, description}) => {
  return `<img class="event__photo" src="${src}" alt="${description}">`;
};

const createPhotosTemplate = (photos) => {
  if (photos.length) {
    return (
      `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${photos
            .map(createImageElement)
            .join(``)}
        </div>
      </div>`
    );
  } else {
    return ``;
  }
};

const createDestinationsDatalistTemplate = (id) => {
  return (
    `<datalist id="destination-list-${id}">
      ${DESTINATIONS
        .map((destination) => {
          return `<option value="${destination}"></option>`;
        })
        .join(``)}
    </datalist>`
  );
};

const createTypeListTemplate = (id) => {
  return (
    `<div class="event__type-list">
      ${Object
        .entries(EVENT_TYPE.NAMES)
        .map(([eventType, eventName]) => {
          return (
            `<fieldset class="event__type-group">
              <legend class="visually-hidden">${eventName}</legend>

              ${EVENT_TYPE[eventType]
                .map((type) => {
                  return (
                    `<div class="event__type-item">
                      <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
                      <label class="event__type-label event__type-label--${type}" for="event-type-${type}-${id}">${capitalizeFirstLetter(type)}</label>
                    </div>`
                  );
                })
                .join(``)
            }
            </fieldset>`
          );
        })
        .join(``)}
    </div>`
  );
};

const createTripFormTemplate = (event) => {
  const {id, city, type, price, dateRange, isFavorite} = event;
  const {name: cityName, description, photos} = city;
  const {name: typeName, offers} = type;

  const typeWithLabel = formatEventType(typeName);
  const formattedStartTime = formatDateTime(dateRange[0]);
  const formattedEndTime = formatDateTime(dateRange[1]);

  const offersTemplate = createOffersTemplate(offers);
  const photosTemplate = createPhotosTemplate(photos);
  const typeListTemplate = createTypeListTemplate(id);
  const destinationsDatalistTemplate = createDestinationsDatalistTemplate(id);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${typeName}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
          ${typeListTemplate}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${typeWithLabel}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${cityName}" list="destination-list-${id}">
          ${destinationsDatalistTemplate}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${formattedStartTime}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${formattedEndTime}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-${id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-${id}">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Close event</span>
        </button>
      </header>
      <section class="event__details">

        ${offersTemplate}

      ${(description || photos.length)
      ? `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>
          ${photosTemplate}
        </section>`
      : ``}

      </section>
    </form>`
  );
};

export default class TripForm extends AbstractView {
  constructor(event) {
    super();

    this._data = TripForm.parseEventToData(event);

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._timeInChangeHandler = this._timeInChangeHandler.bind(this);
    this._timeOutChangeHandler = this._timeOutChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formResetHandler = this._formResetHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createTripFormTemplate(this._data);
  }

  updateData(update, justDataUpdate) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        update
    );

    if (justDataUpdate) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;

    this.restoreHandlers();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormResetHandler(this._callback.formReset);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll(`.event__type-input`)
      .forEach((item) => item.addEventListener(`change`, this._typeChangeHandler));

    this.getElement()
      .querySelector(`#event-destination-${this._data.id}`)
      .addEventListener(`change`, this._destinationChangeHandler);

    this.getElement()
      .querySelector(`#event-start-time-${this._data.id}`)
      .addEventListener(`change`, this._timeInChangeHandler);

    this.getElement()
      .querySelector(`#event-end-time-${this._data.id}`)
      .addEventListener(`change`, this._timeOutChangeHandler);

    this.getElement()
      .querySelector(`#event-price-${this._data.id}`)
      .addEventListener(`input`, this._priceInputHandler);
  }

  _checkDestinationValidation(evt) {
    let isValid = false;
    const isDataCorrect = DESTINATIONS.includes(evt.target.value);

    if (evt.target.validity.valueMissing || evt.target.value === ``) {
      evt.target.setCustomValidity(`Select value from the list below, please!`);
    } else if (!isDataCorrect) {
      evt.target.setCustomValidity(`Can't find your destination, try to select value from hints below, please!`);
    } else {
      evt.target.setCustomValidity(``);
      isValid = true;
    }

    return isValid;
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();

    const value = evt.target.value;
    this.updateData({
      type: {
        name: value,
        offers: generateOffers(value)
      }
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.value === this._data.city.name) {
      return;
    }

    if (this._checkDestinationValidation(evt)) {
      this.updateData({
        city: {
          name: evt.target.value,
          description: generateDescription(),
          photos: generatePhotos(),
        }
      });
    } else {
      this.getElement().reportValidity();
    }
  }

  _timeInChangeHandler() {
    // Обработчик выбора даты начала
  }

  _timeOutChangeHandler() {
    // Обработчик выбора даты конца
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value
    }, true);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(TripForm.parseDataToEvent(this._data));
  }

  _formResetHandler(evt) {
    evt.preventDefault();
    this._callback.formReset();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`change`, this._favoriteClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setFormResetHandler(callback) {
    this._callback.formReset = callback;
    this.getElement().addEventListener(`reset`, this._formResetHandler);
  }

  static parseEventToData(event) {
    return Object.assign({}, event);
  }

  static parseDataToEvent(data) {
    return Object.assign({}, data);
  }
}
