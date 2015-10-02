var AppDispatcher = require('../dispatcher/AppDispatcher');
var ColorConstants = require('../constants/ColorConstants');

var ColorActions = {

  updateSaturation: function(sat) {
    AppDispatcher.dispatch({
      actionType: ColorConstants.SATURATION_UPDATE,
      saturation: sat
    });
  },

  updateHue: function(hue) {
    AppDispatcher.dispatch({
      actionType: ColorConstants.HUE_UPDATE,
      hue: hue
    });
  },

  updateLightness: function(light) {
    AppDispatcher.dispatch({
      actionType: ColorConstants.LIGHTNESS_UPDATE,
      lightness: light
    });
  },

  updateAlpha: function(alpha) {
    AppDispatcher.dispatch({
      actionType: ColorConstants.ALPHA_UPDATE,
      alpha: alpha
    });
  },

  updateAlphaEnabled: function(enabled) {
    AppDispatcher.dispatch({
      actionType: ColorConstants.ALPHA_UPDATE,
      alphaEnabled: enabled
    });
  },

  updateHex: function(hex) {
    AppDispatcher.dispatch({
      actionType: ColorConstants.HEX_UPDATE,
      hex: hex
    });
  },

  updateRgb: function(rgb) {
    AppDispatcher.dispatch({
      actionType: ColorConstants.RGB_UPDATE,
      rgb: rgb
    });
  },

  updateHsl: function(hsl) {
    AppDispatcher.dispatch({
      actionType: ColorConstants.HSL_UPDATE,
      hsl: hsl
    });
  }

};

module.exports = ColorActions;
