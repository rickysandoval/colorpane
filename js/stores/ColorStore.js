var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ColorConstants = require('../constants/ColorConstants');
var assign = require('object-assign');
var colorUtils = require('../utils/colorUtil');

var CHANGE_EVENT = 'change';

var _hue = Math.floor(Math.random()*360),
    _saturation = 1,
    _lightness = .5,
    _alpha = 1,
    _alphaEnabled = false;


function updateHue(hue) {
  _hue = hue;
}

function updateSaturation(sat) {
  _saturation = sat;
}

function updateLightness(light) {
  _lightness = light;
}

function updateAlpha(alpha) {
  _alpha = alpha;
}

function updateAlphaEnabled(enabled) {
  _alphaEnabled = enabled;
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

  getAlpha: function() {
    return _alpha;
  },

  getAlphaEnabled: function() {
    return _alphaEnabled;
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
      var hue = action.hue;
      if (validHue(+hue)){
        updateHue(+hue);
        ColorStore.emitChange();
      }
      break;
    case ColorConstants.SATURATION_UPDATE:
      var sat = action.saturation;
      if (validSaturation(+sat)){
        updateSaturation(+sat);
        ColorStore.emitChange();
      }
      break;
    case ColorConstants.LIGHTNESS_UPDATE:
      var light = action.lightness;
      if (validLightness(+light)){
        updateLightness(+light);
        ColorStore.emitChange();
      }
      break;
    case ColorConstants.ALPHA_UPDATE:
      var alpha = action.alpha;
      if (validAlpha(+alpha)){
        updateAlpha(+alpha);
        ColorStore.emitChange();
      }
      break
    case ColorConstants.ALPHA_ENABLED_UPDATE:
      var enabled = action.alphaEnabled;
      if (enabled){
        updateAlpha(true);
      } else {
        updateAlpha(false);
      }
      break
    case ColorConstants.HEX_UPDATE:
      var hex = action.hex;
      var hsl = colorUtils.hex2hsl(hex);
      if (hsl) {
        updateHue(hsl[0]);
        updateSaturation(hsl[1]);
        updateLightness(hsl[2]);
        ColorStore.emitChange();
      }
      break;
    case ColorConstants.RGB_UPDATE:
      var rgb = action.rgb;
      var hsl = colorUtils.rgb2hsl(rgb[0], rgb[1], rgb[2]);
      if (hsl) {
        updateHue(hsl[0]);
        updateSaturation(hsl[1]);
        updateLightness(hsl[2]);
        ColorStore.emitChange();
      }
      break;
    case ColorConstants.HSL_UPDATE:
      var hsl = action.hsl;
      if (hsl) {
        updateHue(hsl[0]);
        updateSaturation(hsl[1]);
        updateLightness(hsl[2]);
        ColorStore.emitChange();
      }
      break;
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

function validAlpha(alpha) {
  if (isNaN(alpha) || alpha < 0 || alpha > 1) {
    return false;
  } else {
    return true;
  }
}

module.exports = ColorStore;
