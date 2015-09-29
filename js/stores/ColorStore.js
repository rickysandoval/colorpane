var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ColorConstants = require('../constants/ColorConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _hue = Math.floor(Math.random()*360),
    _saturation = 1,
    _lightness = .5;


function updateHue(hue) {
  _hue = hue;
}

function updateSaturation(sat) {
  _saturation = sat;
}

function updateLightness(light) {
  _lightness = light;
}

var ColorStore = assign({}, EventEmitter.prototype, {

  getHue: function() {
    return _hue;
  },

  getSaturation: function() {
    return _saturation;
  },

  getLightness: function() {
    return _lightness;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  //console.log('Color store catch dispatched acton');

  switch(action.actionType) {
    case ColorConstants.HUE_UPDATE:
      hue = action.hue;
      if (validHue(+hue)){
        updateHue(+hue);
        ColorStore.emitChange();
      }
    case ColorConstants.SATURATION_UPDATE:
      sat = action.saturation;
      if (validSaturation(+sat)){
        updateSaturation(+sat);
        ColorStore.emitChange();
      }
    case ColorConstants.LIGHTNESS_UPDATE:
      light = action.lightness;
      if (validLightness(+light)){
        updateLightness(+light);
        ColorStore.emitChange();
      }
    default:
      // no op
  }
});

function validHue(hue) {
  if (isNaN(hue) || hue < 0 || hue > 360) {
    return false;
  } else {
    return true;
  }
}

function validSaturation(sat) {
  if (isNaN(sat) || sat < 0 || sat > 1) {
    return false;
  } else {
    return true;
  }
}

function validLightness(light) {
  if (isNaN(light) || light < 0 || light > 1) {
    return false;
  } else {
    return true;
  }
}

module.exports = ColorStore;
