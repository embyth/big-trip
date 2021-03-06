import SmartView from './smart';
import {formatEventType, formatDateTime} from '../utils/trip';
import {capitalizeFirstLetter} from '../utils/common';
import {EVENT_TYPE, DateType} from '../const';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import '../../node_modules/flatpickr/dist/themes/material_blue.css';

const createOfferItemTemplate = (offer, isChecked, id, isDisabled) => {
  const {label, price} = offer;
  const name = label.toLowerCase().replace(/ /g, `-`);

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-${id}" type="checkbox" name="event-offer-${name}" ${isChecked} value="${name}" ${isDisabled ? `disabled` : ``}>
      <label class="event__offer-label" for="event-offer-${name}-${id}">
        <span class="event__offer-title">${label}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const createOffersTemplate = (offers, totalOffers, id, isDisabled) => {
  const labels = offers.map((offer) => offer.label);
  if (totalOffers.length) {
    return (
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${totalOffers
            .map((offer) => {
              const isChecked = labels.includes(offer.label) ? `checked` : ``;
              return createOfferItemTemplate(offer, isChecked, id, isDisabled);
            })
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

const createDestinationsDatalistTemplate = (destinations, id) => {
  return (
    `<datalist id="destination-list-${id}">
      ${destinations
        .map((destination) => {
          return `<option value="${destination.name}"></option>`;
        })
        .join(``)}
    </datalist>`
  );
};

const createTypeListTemplate = (id, typeName) => {
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
                      <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === typeName ? `checked` : ``}>
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

const createTripFormTemplate = (event, offersData, destinationsData, isNewEvent) => {
  const {id, city, type, price, dateRange, isFavorite, isDisabled, isSaving, isDeleting} = event;
  const {name: cityName, description, photos} = city;
  const {name: typeName, offers} = type;

  const totalOffers = offersData.filter((offer) => offer.type === typeName).pop().offers;

  const typeWithLabel = formatEventType(typeName);
  const formattedStartTime = formatDateTime(dateRange[0]);
  const formattedEndTime = formatDateTime(dateRange[1]);

  const offersTemplate = createOffersTemplate(offers, totalOffers, id, isDisabled);
  const photosTemplate = createPhotosTemplate(photos);
  const typeListTemplate = createTypeListTemplate(id, typeName);
  const destinationsDatalistTemplate = createDestinationsDatalistTemplate(destinationsData, id);

  const resetFormText = isNewEvent ? `Cancel` : `${isDeleting ? `Deleting` : `Delete`}`;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${typeName}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled ? `disabled` : ``}>
          ${typeListTemplate}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${typeWithLabel}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${cityName}" list="destination-list-${id}" ${isDisabled ? `disabled` : ``}>
          ${destinationsDatalistTemplate}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${formattedStartTime}" ${isDisabled ? `disabled` : ``}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${formattedEndTime}" ${isDisabled ? `disabled` : ``}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}" ${isDisabled ? `disabled` : ``}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>${isSaving ? `Saving` : `Save`}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>${resetFormText}</button>

    ${isNewEvent
      ? ``
      : `<input id="event-favorite-${id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
        <label class="event__favorite-btn" for="event-favorite-${id}">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button" ${isDisabled ? `disabled` : ``}>
          <span class="visually-hidden">Close event</span>
        </button>`}

      </header>

     ${(totalOffers.length || description || photos.length)
      ? `<section class="event__details">
        ${offersTemplate}

      ${(description || photos.length)
      ? `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>
            ${photosTemplate}
        </section>`
      : ``}

        </section>`
      : ``}
    </form>`
  );
};

export default class TripForm extends SmartView {
  constructor(event, offers, destinations, isNewEvent = false) {
    super();

    this._data = TripForm.parseEventToData(event);
    this._offers = offers;
    this._destinations = destinations;
    this._isNewEvent = isNewEvent;
    this._startDatepicker = null;
    this._endDatepicker = null;

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._timeStartChangeHandler = this._timeStartChangeHandler.bind(this);
    this._timeEndChangeHandler = this._timeEndChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);

    this._setInnerHandlers();
  }

  removeElement() {
    super.removeElement();

    this.destroyDatepickers();
  }

  reset(event) {
    this.updateData(
        TripForm.parseEventToData(event)
    );
  }

  getTemplate() {
    return createTripFormTemplate(this._data, this._offers, this._destinations, this._isNewEvent);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setDatepickers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setFormCloseClickHandler(this._callback.formClose);
  }

  setDatepickers() {
    const timeStartInput = this.getElement().querySelector(`#event-start-time-${this._data.id}`);
    const timeEndInput = this.getElement().querySelector(`#event-end-time-${this._data.id}`);

    this.destroyDatepickers();
    this._startDatepicker = this._getDatepicker(timeStartInput, DateType.START);
    this._endDatepicker = this._getDatepicker(timeEndInput, DateType.END);
  }

  destroyDatepickers() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }
  }

  _getDatepicker(element, dateType) {
    return flatpickr(
        element,
        {
          dateFormat: `d/m/y H:i`,
          enableTime: true,
          [`time_24hr`]: true,
          defaultDate: dateType === DateType.START ? this._data.dateRange[0] : this._data.dateRange[1],
          minDate: dateType === DateType.END ? this._data.dateRange[0] : ``,
          onChange: dateType === DateType.START ? this._timeStartChangeHandler : this._timeEndChangeHandler,
        }
    );
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll(`.event__type-input`)
      .forEach((item) => item.addEventListener(`change`, this._typeChangeHandler));

    this.getElement()
      .querySelector(`#event-destination-${this._data.id}`)
      .addEventListener(`change`, this._destinationChangeHandler);

    this.getElement()
      .querySelector(`#event-price-${this._data.id}`)
      .addEventListener(`input`, this._priceInputHandler);

    if (!this._isNewEvent) {
      this.getElement()
        .querySelector(`.event__favorite-checkbox`)
        .addEventListener(`change`, this._favoriteChangeHandler);
    }

    this.getElement()
      .querySelectorAll(`.event__offer-checkbox`)
      .forEach((item) => item.addEventListener(`change`, this._offerChangeHandler));
  }

  _checkDestinationValidation(input) {
    let isValid = false;
    const isDataCorrect = this._destinations.includes(this._destinations.find((destination) => destination.name === input.value));

    if (input.validity.valueMissing || input.value === ``) {
      input.setCustomValidity(`Select value from the list below, please!`);
    } else if (!isDataCorrect) {
      input.setCustomValidity(`Can't find your destination, try to select value from hints below, please!`);
    } else {
      input.setCustomValidity(``);
      isValid = true;
    }

    return isValid;
  }

  _checkPriceValidation(input) {
    let isValid = false;
    const isDataCorrect = +input.value >= 0;
    const isStartedWithZero = /^(?:[1-9][0-9]*|0)$/.test(input.value);

    if (input.validity.valueMissing || input.value === ``) {
      input.setCustomValidity(`Indicate the price you spend on this event, if it's free - write 0!`);
    } else if (!isDataCorrect || !isStartedWithZero) {
      input.setCustomValidity(`Your price can't be negative number or starts with leading zero, please, correct your value!`);
    } else {
      input.setCustomValidity(``);
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
        offers: []
      }
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    if (this._checkDestinationValidation(evt.target)) {
      const targetedDestination = this._destinations.find((item) => item.name === evt.target.value);

      this.updateData({
        city: {
          name: targetedDestination.name,
          description: targetedDestination.description,
          photos: targetedDestination.pictures,
        }
      });
    } else {
      this.getElement().reportValidity();
    }
  }

  _timeStartChangeHandler([userDate]) {
    this.updateData({
      dateRange: [userDate, this._data.dateRange[1]]
    });
  }

  _timeEndChangeHandler([userDate]) {
    this.updateData({
      dateRange: [this._data.dateRange[0], userDate]
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();

    if (this._checkPriceValidation(evt.target)) {
      this.updateData({
        price: evt.target.value
      }, true);
    } else {
      this.getElement().reportValidity();
    }
  }

  _favoriteChangeHandler(evt) {
    evt.preventDefault();

    this.updateData({
      isFavorite: !this._data.isFavorite
    }, true);
  }

  _offerChangeHandler(evt) {
    evt.preventDefault();

    const type = Object.assign({}, this._data.type);
    const targetItem = this._offers
      .find((item) => item.type === type.name).offers
      .find((offer) => offer.label.toLowerCase().replace(/ /g, `-`) === evt.target.value);

    if (evt.target.checked) {
      type.offers.push(targetItem);
    } else {
      const index = type.offers.findIndex((offer) => offer.label === targetItem.label);
      type.offers = [
        ...type.offers.slice(0, index),
        ...type.offers.slice(index + 1)
      ];
    }

    this.updateData({
      type
    }, true);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    if (
      this._checkDestinationValidation(this.getElement().querySelector(`#event-destination-${this._data.id}`)) &&
      this._checkPriceValidation(this.getElement().querySelector(`#event-price-${this._data.id}`))
    ) {
      this._callback.formSubmit(TripForm.parseDataToEvent(this._data));
    } else {
      this.getElement().reportValidity();
    }
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(TripForm.parseDataToEvent(this._data));
  }

  _formCloseHandler(evt) {
    evt.preventDefault();
    this._callback.formClose();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().addEventListener(`reset`, this._deleteClickHandler);
  }

  setFormCloseClickHandler(callback) {
    if (!this._isNewEvent) {
      this._callback.formClose = callback;
      this.getElement()
        .querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, this._formCloseHandler);
    }
  }

  static parseEventToData(event) {
    return Object.assign({}, event, {
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
