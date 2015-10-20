(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/rsandoval/colored/js/actions/ColorActions.js":[function(require,module,exports){
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
      actionType: ColorConstants.ALPHA_ENABLED_UPDATE,
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

},{"../constants/ColorConstants":"/Users/rsandoval/colored/js/constants/ColorConstants.js","../dispatcher/AppDispatcher":"/Users/rsandoval/colored/js/dispatcher/AppDispatcher.js"}],"/Users/rsandoval/colored/js/components/App.js":[function(require,module,exports){
var React = require('react');

var ColorStore = require('./../stores/ColorStore');
var ColorActions = require('./../actions/ColorActions');

var Header = require('./Header.react');
var ColorPane = require('./colorpane/ColorPane.react');
var ShadePane = require('./colorpane/ShadePane.react');
var DisplayPane = require('./displaypane/DisplayPane.react');
var ControlPane = require('./controls/ControlPane.react');

function getState() {
	return {
		saturation: ColorStore.getSaturation(),
		hue: ColorStore.getHue(),
		lightness: ColorStore.getLightness(),
		alpha: ColorStore.getAlpha(),
		alphaEnabled: ColorStore.getAlphaEnabled()
	};
}

var App = React.createClass({displayName: "App",

	getInitialState: function() {
		return getState()
	},

	componentDidMount: function() {
		ColorStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		ColorStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			React.createElement("div", {className: "site-wrapper"}, 
				React.createElement(Header, null), 
				React.createElement("main", {className: "site-main"}, 
					React.createElement("div", {className: "picker-controls"}, 
						React.createElement(ControlPane, {
							hue: this.state.hue, 
							saturation: this.state.saturation, 
							lightness: this.state.lightness, 
							alpha: this.state.alpha, 
							alphaEnabled: this.state.alphaEnabled}
						)
					), 
					React.createElement("div", {className: "picker-wheel"}, 
						React.createElement("div", {className: "picker-wheel__wrapper"}, 
							React.createElement(ColorPane, null), 
							React.createElement(ShadePane, {
								hue: this.state.hue, 
								saturation: this.state.saturation, 
								lightness: this.state.lightness}
							)
						)
					), 
					React.createElement(DisplayPane, {
						hue: this.state.hue, 
						saturation: this.state.saturation, 
						lightness: this.state.lightness, 
						alpha: this.state.alpha, 
						alphaEnabled: this.state.alphaEnabled}
					)
				)
			)
		);
	},

	_onChange: function() {
		this.setState(getState());
	}

});

module.exports = App;

;(function() {
    var throttle = function(type, name, obj) {
        var obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle("resize", "optimizedResize");
})();
},{"./../actions/ColorActions":"/Users/rsandoval/colored/js/actions/ColorActions.js","./../stores/ColorStore":"/Users/rsandoval/colored/js/stores/ColorStore.js","./Header.react":"/Users/rsandoval/colored/js/components/Header.react.js","./colorpane/ColorPane.react":"/Users/rsandoval/colored/js/components/colorpane/ColorPane.react.js","./colorpane/ShadePane.react":"/Users/rsandoval/colored/js/components/colorpane/ShadePane.react.js","./controls/ControlPane.react":"/Users/rsandoval/colored/js/components/controls/ControlPane.react.js","./displaypane/DisplayPane.react":"/Users/rsandoval/colored/js/components/displaypane/DisplayPane.react.js","react":"react"}],"/Users/rsandoval/colored/js/components/Header.react.js":[function(require,module,exports){
var React = require('react');

var Header = React.createClass({displayName: "Header",
	render: function() {
		return (
			React.createElement("header", {className: "site-header"}, 
				React.createElement("h1", {className: "site-header__title"}, "Color Pane")
			)
		);
	}
});

module.exports = Header;
},{"react":"react"}],"/Users/rsandoval/colored/js/components/colorpane/ColorPane.react.js":[function(require,module,exports){
var React = require('react');
var ColorActions = require('../../actions/ColorActions');
var colorUtils = require('../../utils/colorUtil');
var domUtils = require('../../utils/domUtil.js');
var genUtils = require('../../utils/generalUtil.js');

var size;
var active = false;
var lastMove = 0;
var moveThrottle = 1;
var wrapperStyle = {
	display: 'inline-block'
};
var markerStyle = {
	position: 'absolute',
	width: '2px',
	background: 'black',
	left: '50%',
	top: '0px',
	marginLeft: '-1px',
	transformOrigin: 'bottom center',
	cursor: 'pointer'
};

var ColorPane = React.createClass({displayName: "ColorPane",

	componentDidMount: function() {
		var canvas = React.findDOMNode(this.refs.colorPaneCanvas);
		var context = canvas.getContext('2d');
		size = parseInt(domUtils.getStyle(this.getDOMNode(), 'width'));
		canvas.width = size;
		canvas.height = size;
    	this.paint(context);
    	window.addEventListener('optimizedResize', this.resize);
	},

	componentWillUnmount: function() {
		window.removeEventListener('optimizedResize', this.resize);
	},

	resize: function() {
		var nSize = parseInt(domUtils.getStyle(this.getDOMNode(), 'width'));
		if (size != nSize) {
			size = nSize;
			var canvas = React.findDOMNode(this.refs.colorPaneCanvas);
			canvas.width = size;
			canvas.height = size;
			var context = canvas.getContext('2d');
	    	this.paint(context);
		}
	},

	paint: function(context) {
		var bitmap = context.getImageData(0,0,size,size);
		var value = 1;
        var saturation = 1;

		for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
                // offset for the 4 RGBA values in the data array
                var offset = 4 * ((y * size) + x);

                var hue = 180 + Math.atan2(y - size/2, x - size/2) * (180 / Math.PI);

                var hsv = colorUtils.hsv2rgb(hue, saturation, value);

                // fill RGBA values
                bitmap.data[offset + 0] = hsv[0];
                bitmap.data[offset + 1] = hsv[1];
                bitmap.data[offset + 2] = hsv[2];
                bitmap.data[offset + 3] = 255; // no transparency

            }
        }

        context.putImageData(bitmap, 0, 0);
	},

	render: function() {
		return (
			React.createElement("div", {
				className: "color-pane", 
				style: wrapperStyle, 
				onMouseMove: this._handleMouseMove}, 
				React.createElement("canvas", {
					id: "picker", 
					className: "color-pane__canvas", 
					onMouseDown: this._handleMouseDown, 
					onMouseLeave: this._handleMouseLeave, 
					ref: "colorPaneCanvas"}
				)
			)
		);
	},

	_handleMouseDown: function(down_event) {
		active = true;
		this._setColor(down_event);
		var that = this;

		var mouseMove = function(move_event) {
			document.body.removeEventListener('mouseup', mouseMove);
			that._setColor(move_event);
		};
		var mouseUp = function(up_event) {
			active = false;
			document.body.removeEventListener('mouseup', mouseUp);
			document.body.removeEventListener('mousemove', mouseMove);
			that._setColor(up_event);
		};
		document.body.addEventListener('mouseup', mouseUp);
		document.body.addEventListener('mousemove', mouseMove);
	},

	_handleMouseLeave: function(event) {
		if (active) {
			this._setColor(event);
		}
	},

	_handleMouseMove: function(event) {
		var now = Date.now();
      	if (now > lastMove + moveThrottle && active) {
      		lastMove = now;
      		this._setColor(event);
      	}
	},

	_setColor: function(event) {
		var pos = domUtils.offset(this.getDOMNode());
		var x = event.pageX - pos.left;
		var y = event.pageY - pos.top;
		var hue = 180 + Math.atan2(y - size/2, x - size/2) * (180 / Math.PI);
		ColorActions.updateHue(+hue.toFixed(2));
	}

});

module.exports = ColorPane;
},{"../../actions/ColorActions":"/Users/rsandoval/colored/js/actions/ColorActions.js","../../utils/colorUtil":"/Users/rsandoval/colored/js/utils/colorUtil.js","../../utils/domUtil.js":"/Users/rsandoval/colored/js/utils/domUtil.js","../../utils/generalUtil.js":"/Users/rsandoval/colored/js/utils/generalUtil.js","react":"react"}],"/Users/rsandoval/colored/js/components/colorpane/ShadePane.react.js":[function(require,module,exports){
var React = require('react');
var colorUtils = require('../../utils/colorUtil');
var domUtils = require('../../utils/domUtil.js');
var genUtils = require('../../utils/generalUtil.js');
var ColorActions = require('../../actions/ColorActions');

var size;
var padding = 10;
var active = false;
var lastMove = 0;
var moveThrottle = 1;
var painting = false;
var lastHue;
var wrapperStyle = {
	display: 'inline-block',
	padding: padding + 'px',
	boxSizing: 'content-box',
	borderRadius: '50%'
};
var mouseDown = false;
var mouseDownListener = function(event) {
	if (event.target.className.indexOf('color-pane__canvas') >= 0) {
		mouseDown = true;
	}
};
var mosueUpListener = function(event) {
	mouseDown = false;
};

var DisplayPane = React.createClass({displayName: "DisplayPane",

	propTypes: {
		hue: React.PropTypes.number.isRequired,
		saturation: React.PropTypes.number.isRequired,
		lightness: React.PropTypes.number.isRequired
	},

	componentDidMount: function() {
		size = parseInt(domUtils.getStyle(this.getDOMNode(), 'width'))+2;
		var canvas = React.findDOMNode(this.refs.shadePaneCanvas);
		canvas.width = size;
		canvas.height = size;
		var context = canvas.getContext('2d');
    	this.paint(context);
    	lastHue = this.props.hue;

    	window.addEventListener('optimizedResize', this.resize)
    	document.body.addEventListener('mousedown', mouseDownListener);
    	document.body.addEventListener('mouseup', mosueUpListener);
	},

	componentDidUpdate: function(prevProps) {
		if (!mouseDown && lastHue != this.props.hue) {
			lastHue = this.props.hue;
			var context = React.findDOMNode(this.refs.shadePaneCanvas).getContext('2d');
    		this.paint(context);
		}
	},

	componentWillUnmount: function() {
		window.removeEventListener('optimizedResize', this.resize);
		document.removeEventListener('mousedown', mouseDownListener);
    	document.removeEventListener('mouseup', mosueUpListener);
	},

	resize: function() {
		var nSize = parseInt(domUtils.getStyle(this.getDOMNode(), 'width'))+1;
		if (size != nSize) {
			size = nSize;
			var canvas = React.findDOMNode(this.refs.shadePaneCanvas);
			canvas.width = size;
			canvas.height = size;
			var context = canvas.getContext('2d');
	    	this.paint(context);
		}
	},

	paint: function(context) {
		if (!painting) {
			var bitmap = context.getImageData(0,0,size,size);
			var r = size/2;

			for (var y = 0; y < size; y++) {
				var c1 = y*y - 2*y*r + r*r;
				var x1 = (2*r - Math.sqrt(4*r*r-4*c1))/2;
				var x2 = (2*r + Math.sqrt(4*r*r-4*c1))/2;

	    		for (var x = 0; x < size; x++) {

	    			if (Math.sqrt((x-r)*(x-r) + (y-r)*(y-r)) > r) {
	    				hsv = [255,255,255];
	    			} else {
	    				var c2 = ( x*x - 2*x*r + r*r);
		    			var y1 = (2*r - Math.sqrt(4*r*r-4*c2))/2;
						var y2 = (2*r + Math.sqrt(4*r*r-4*c2))/2;

		    			var offset = 4 * ((y * (size)) + x);

		    			var hue = this.props.hue;
		    			var saturation = (y-y1) / (y2-y1);
		    			var lightness = (x-x1) / (x2-x1);
	    				var hsv = colorUtils.hsl2rgb(hue, saturation, lightness);
	    			}

	    			bitmap.data[offset + 0] = hsv[0];
	                bitmap.data[offset + 1] = hsv[1];
	                bitmap.data[offset + 2] = hsv[2];
	                bitmap.data[offset + 3] = 255; // no transparency

	    		
	           }
	       }
	        context.putImageData(bitmap, 0, 0);
	        painting = false;
	    }
	},

	render: function() {
		return (
			React.createElement("div", {
				className: "shade-pane", 
				style: wrapperStyle, 
				onMouseMove: this._handleMouseMove}, 
				React.createElement("div", {className: "shade-pane__window"}, 
					React.createElement("canvas", {
						id: "shade", 
						className: "shade-pane__canvas", 
						ref: "shadePaneCanvas", 
						onMouseDown: this._handleMouseDown, 
						onMouseLeave: this._handeMouseLeave}
					)
				)
			)
		);
	},

	_handleMouseDown: function(event) {
		active = true;
		this._setShade(event);
		var mouseUp = function() {
			active = false;
			document.body.removeEventListener('mouseup', mouseUp);
		};
		document.body.addEventListener('mouseup', mouseUp);
	},

	_handleMouseLeave: function(event) {
		if (active) {
			this._setShade(event);
		}
	},

	_handleMouseMove: function(event) {
		var now = Date.now();
      	if (now > lastMove + moveThrottle && active) {
      		lastMove = now;
      		this._setShade(event);
      	}
	},

	_setShade: function(event) {
		var pos = domUtils.offset(React.findDOMNode(this.refs.shadePaneCanvas)),
			x = event.pageX - pos.left,
			y = event.pageY - pos.top,
			r = size/2;

		if (Math.sqrt(Math.pow(x-r,2) + Math.pow(y-r,2)) > r){
			if (Math.sqrt(Math.pow(x-r,2) + Math.pow(y-r,2)) > r+padding) {
				return;
			}
			var m = (y-r)/(x-r),
				norm = Math.sqrt(1 + m*m),
				sign = x < r ? -1 : 1;

			x = r + sign*(r/norm);
			y = r + sign*(r*m/norm);
		}

		var c1 = y*y - 2*y*r + r*r,
			x1 = (2*r - Math.sqrt(4*r*r-4*c1))/2,
			x2 = (2*r + Math.sqrt(4*r*r-4*c1))/2,
			c2 = ( x*x - 2*x*r + r*r),
			y1 = (2*r - Math.sqrt(4*r*r-4*c2))/2,
			y2 = (2*r + Math.sqrt(4*r*r-4*c2))/2;

		var saturation = (y-y1) / (y2-y1);
		var lightness = (x-x1) / (x2-x1);
		ColorActions.updateSaturation(+saturation.toFixed(2));
		ColorActions.updateLightness(+lightness.toFixed(2));
	}
});

module.exports = DisplayPane;
},{"../../actions/ColorActions":"/Users/rsandoval/colored/js/actions/ColorActions.js","../../utils/colorUtil":"/Users/rsandoval/colored/js/utils/colorUtil.js","../../utils/domUtil.js":"/Users/rsandoval/colored/js/utils/domUtil.js","../../utils/generalUtil.js":"/Users/rsandoval/colored/js/utils/generalUtil.js","react":"react"}],"/Users/rsandoval/colored/js/components/controls/ControlPane.react.js":[function(require,module,exports){
var React = require('react');
var HslDisplay = require('./HslDisplay.react');
var RgbDisplay= require('./RgbDisplay.react');
var HexDisplay = require('./HexDisplay.react');
var TransparencyInput = require('./TransparencyInput.react');
var colorUtil = require('../../utils/colorUtil');

var style = {
	backgroundColor: ''
}

var ControlPane = React.createClass({displayName: "ControlPane",

	propTypes: {
		hue: React.PropTypes.number.isRequired,
		saturation: React.PropTypes.number.isRequired,
		lightness: React.PropTypes.number.isRequired,
		alpha: React.PropTypes.number.isRequired,
		alphaEnabled: React.PropTypes.bool.isRequired
	},

	render: function() {
		style.backgroundColor = '#' + colorUtil.hsl2hex(this.props.hue, this.props.saturation, this.props.lightness);
		return (
			React.createElement("div", {style: style, className: "picker-inputs"}, 
				React.createElement("div", {className: "picker-inputs__inner"}, 
					React.createElement(HslDisplay, {color: [this.props.hue, this.props.saturation, this.props.lightness]}), 
					React.createElement(RgbDisplay, {color: [this.props.hue, this.props.saturation, this.props.lightness], alpha: this.props.alpha, alphaEnabled: this.props.alphaEnabled}), 
					React.createElement(HexDisplay, {color: [this.props.hue, this.props.saturation, this.props.lightness]}), 
					React.createElement(TransparencyInput, {hasTransparency: this.props.alphaEnabled, alpha: this.props.alpha})
				)
			)
		);
	}

});

module.exports = ControlPane;
},{"../../utils/colorUtil":"/Users/rsandoval/colored/js/utils/colorUtil.js","./HexDisplay.react":"/Users/rsandoval/colored/js/components/controls/HexDisplay.react.js","./HslDisplay.react":"/Users/rsandoval/colored/js/components/controls/HslDisplay.react.js","./RgbDisplay.react":"/Users/rsandoval/colored/js/components/controls/RgbDisplay.react.js","./TransparencyInput.react":"/Users/rsandoval/colored/js/components/controls/TransparencyInput.react.js","react":"react"}],"/Users/rsandoval/colored/js/components/controls/HexDisplay.react.js":[function(require,module,exports){
var React = require('react');
var classNames = require('classnames');

var ColorActions = require('./../../actions/ColorActions');
var colorUtils = require('./../../utils/colorUtil');
var HexInput = require('./HexInput.react');


var HexDisplay = React.createClass({displayName: "HexDisplay",

	propTypes: {
		color: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
	},

	getInitialState: function() {
		return {
			isEditing: false
		};
	},

	render: function() {
		var hex = colorUtils.hsl2hex(this.props.color[0], this.props.color[1], this.props.color[2]);
		var input;

		if (this.state.isEditing) {
			input = 
				React.createElement(HexInput, {
					onSave: this._onSave, 
					hex: hex}
				);
		}
		//
		return (
			React.createElement("div", {
				className: classNames('color-input', {
					'editing': this.state.isEditing
				})}, 
				React.createElement("div", {onDoubleClick: this._onDoubleClick}, 
					React.createElement("div", {className: "color-input__label"}, "Hex"), 
					React.createElement("div", {className: "color-input__display"}, "#", hex )
				), 
				input
			)
		);
	},

	_onDoubleClick: function() {
		this.setState({isEditing: true});
	},

	_onSave: function(hex, keepOpen) {
		ColorActions.updateHex(hex);
		if (!keepOpen){
			this.setState({isEditing: false});
		}
	}

});

module.exports = HexDisplay;
},{"./../../actions/ColorActions":"/Users/rsandoval/colored/js/actions/ColorActions.js","./../../utils/colorUtil":"/Users/rsandoval/colored/js/utils/colorUtil.js","./HexInput.react":"/Users/rsandoval/colored/js/components/controls/HexInput.react.js","classnames":"/Users/rsandoval/colored/node_modules/classnames/index.js","react":"react"}],"/Users/rsandoval/colored/js/components/controls/HexInput.react.js":[function(require,module,exports){
var React = require('react');
var colorUtil = require('../../utils/colorUtil');

var HexInput = React.createClass({displayName: "HexInput",

	propTypes: {
		onSave: React.PropTypes.func.isRequired,
		hex: React.PropTypes.string.isRequired
	},

	getInitialState: function() {
		return {
			value: this.props.hex || ''
		};
	},

	componentDidUpdate: function(prevProps) {
		if (prevProps.hex != this.props.hex) {
			this.setState({
				value: this.props.hex
			});
		}
	},

	render: function() {
		return (
			React.createElement("input", {
				value: this.state.value, 
				onKeyDown: this._handleKeyDown, 
				onChange: this._onChange}
			)
		);
	},
	//comment
	_handleKeyDown: function(event) {
		if (event.keyCode === 13) {
			this._save();
		}
	},

	_onChange: function(event) {
		this.setState({
			value: event.target.value
		}, this._changeCallback);
	},

	_changeCallback: function(){
		if (colorUtil.hex2hsl(this.state.value)){
			this.props.onSave(this.state.value, true);
		}
	},

	_save: function() {
		if (colorUtil.hex2hsl(this.state.value)){
			this.props.onSave(this.state.value);
		}
	}
});

module.exports = HexInput;
},{"../../utils/colorUtil":"/Users/rsandoval/colored/js/utils/colorUtil.js","react":"react"}],"/Users/rsandoval/colored/js/components/controls/HslDisplay.react.js":[function(require,module,exports){
var React = require('react');
var classNames = require('classnames');

var ColorActions = require('./../../actions/ColorActions');
var HslInput = require('./HslInput.react');
var gUtil = require('./../../utils/generalUtil');

var HslDisplay = React.createClass({displayName: "HslDisplay",

	propTypes: {
		color: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
	},

	getInitialState: function() {
		return {
			isEditing: false
		};
	},

	render: function() {
		var hsl = this.props.color
		var input;

		if (this.state.isEditing) {
			input =
				React.createElement(HslInput, {
					onSave: this._onSave, 
					h: gUtil.round(hsl[0]), 
					s: gUtil.round(hsl[1]), 
					l: gUtil.round(hsl[2])}
				);
		}
		//
		return (
			React.createElement("div", {className: classNames('color-input', {
				'editing': this.state.isEditing
				})}, 
				React.createElement("div", {onDoubleClick: this._onDoubleClick}, 
					React.createElement("div", {className: "color-input__label"}, "HSL"), 
					React.createElement("div", {className: "color-input__display"}, gUtil.round(hsl[0]), ", ", gUtil.round(hsl[1]), ", ", gUtil.round(hsl[2]))
				), 
				input
			)
		);
	},

	_onDoubleClick: function() {
		this.setState({isEditing: true});
	},

	_onSave: function(hsl, keepOpen) {
		ColorActions.updateHsl(hsl);
		if (!keepOpen){
			this.setState({isEditing: false});
		}
	}

});

module.exports = HslDisplay;
},{"./../../actions/ColorActions":"/Users/rsandoval/colored/js/actions/ColorActions.js","./../../utils/generalUtil":"/Users/rsandoval/colored/js/utils/generalUtil.js","./HslInput.react":"/Users/rsandoval/colored/js/components/controls/HslInput.react.js","classnames":"/Users/rsandoval/colored/node_modules/classnames/index.js","react":"react"}],"/Users/rsandoval/colored/js/components/controls/HslInput.react.js":[function(require,module,exports){
var React = require('react');

var HslInput = React.createClass({displayName: "HslInput",

	propTypes: {
		onSave: React.PropTypes.func.isRequired,
		h: React.PropTypes.number.isRequired,
		s: React.PropTypes.number.isRequired,
		l: React.PropTypes.number.isRequired
	},

	getInitialState: function() {
		return {
			h: this.props.h || 0,
			s: this.props.s || 0,
			l: this.props.l || 0
		};
	},

	componentDidUpdate: function(prevProps) {
		if (prevProps.h != this.props.h || prevProps.s != this.props.s || prevProps.l != this.props.l) {
			this.setState({
				h: this.props.h,
				s: this.props.s,
				l: this.props.l
			});
		}
	},

	render: function() {
		return (
			React.createElement("div", {className: "hsl-input"}, 
				React.createElement("input", {
					min: "0", 
					max: "360", 
					type: "number", 
					value: this.state.h, 
					onKeyDown: this._handleKeyDown, 
					onChange: this._onChange, 
					ref: "hInput"}
				), 
				React.createElement("input", {
					min: "0", 
					max: "1", 
					step: ".1", 
					type: "number", 
					value: this.state.s, 
					onKeyDown: this._handleKeyDown, 
					onChange: this._onChange, 
					ref: "sInput"}
				), 
				React.createElement("input", {
					min: "0", 
					max: "1", 
					step: ".1", 
					type: "number", 
					value: this.state.l, 
					onKeyDown: this._handleKeyDown, 
					onChange: this._onChange, 
					ref: "lInput"}
				)
			)
		);
	},
	//comment
	_handleKeyDown: function(event) {
		if (event.keyCode === 13) {
			this._save();
		}
	},

	_onChange: function(event) {
		this.setState({
			h: React.findDOMNode(this.refs.hInput).valueAsNumber,
			s: React.findDOMNode(this.refs.sInput).valueAsNumber,
			l: React.findDOMNode(this.refs.lInput).valueAsNumber
		}, this._save.bind(this, true));
	},

	_save: function(keepOpen) {
		this.props.onSave([
			Math.min(Math.max(this.state.h, 0), 360),
			Math.min(Math.max(this.state.s, 0), 1),
			Math.min(Math.max(this.state.l, 0), 1)
		], keepOpen);
	}
});

module.exports = HslInput;
},{"react":"react"}],"/Users/rsandoval/colored/js/components/controls/RgbDisplay.react.js":[function(require,module,exports){
var React = require('react');
var classNames = require('classnames');

var ColorActions = require('./../../actions/ColorActions');
var colorUtils = require('./../../utils/colorUtil');
var gUtil = require('./../../utils/generalUtil');
var RgbInput = require('./RgbInput.react');

var RgbDisplay = React.createClass({displayName: "RgbDisplay",

	propTypes: {
		color: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
		alpha: React.PropTypes.number.isRequired,
		alphaEnabled: React.PropTypes.bool.isRequired
	},

	getInitialState: function() {
		return {
			isEditing: false
		};
	},

	render: function() {
		var rgb = colorUtils.hsl2rgb(this.props.color[0], this.props.color[1], this.props.color[2]);
		var input;

		if (this.state.isEditing) {
			input =
				React.createElement(RgbInput, {
					onSave: this._onSave, 
					r: gUtil.round(rgb[0]), 
					g: gUtil.round(rgb[1]), 
					b: gUtil.round(rgb[2]), 
					alpha: this.props.alpha, 
					alphaEnabled: this.props.alphaEnabled}
				);
		}
		//
		return (
			React.createElement("div", {className: classNames('color-input', {
				'editing': this.state.isEditing
				})}, 
				React.createElement("div", {onDoubleClick: this._onDoubleClick}, 
					React.createElement("div", {className: "color-input__label"}, "RGB", this.props.alphaEnabled ? 'a' : ''), 
					React.createElement("div", {className: "color-input__display"}, 
						gUtil.round(rgb[0]), ", ", gUtil.round(rgb[1]), ", ", gUtil.round(rgb[2]), this.props.alphaEnabled ? ', '+this.props.alpha : ''
					)
				), 
				input
			)
		);
	},

	_onDoubleClick: function() {
		this.setState({isEditing: true});
	},

	_onSave: function(rgb, keepOpen) {
		ColorActions.updateRgb(rgb);
		if (!keepOpen){
			this.setState({isEditing: false});
		}
	}

});

module.exports = RgbDisplay;
},{"./../../actions/ColorActions":"/Users/rsandoval/colored/js/actions/ColorActions.js","./../../utils/colorUtil":"/Users/rsandoval/colored/js/utils/colorUtil.js","./../../utils/generalUtil":"/Users/rsandoval/colored/js/utils/generalUtil.js","./RgbInput.react":"/Users/rsandoval/colored/js/components/controls/RgbInput.react.js","classnames":"/Users/rsandoval/colored/node_modules/classnames/index.js","react":"react"}],"/Users/rsandoval/colored/js/components/controls/RgbInput.react.js":[function(require,module,exports){
var React = require('react');
var classNames = require('classnames');

var RgbInput = React.createClass({displayName: "RgbInput",

	propTypes: {
		onSave: React.PropTypes.func.isRequired,
		r: React.PropTypes.number.isRequired,
		g: React.PropTypes.number.isRequired,
		b: React.PropTypes.number.isRequired,
		alpha: React.PropTypes.number.isRequired,
		alphaEnabled: React.PropTypes.bool.isRequired
	},

	getInitialState: function() {
		return {
			r: this.props.r || 0,
			g: this.props.g || 0,
			b: this.props.b || 0,
			a: this.props.alpha || 0
		};
	},

	componentDidUpdate: function(prevProps) {
		if (prevProps.r != this.props.r || prevProps.g != this.props.g || prevProps.b != this.props.b) {
			this.setState({
				r: this.props.r,
				g: this.props.g,
				b: this.props.b,
				a: this.props.alpha
			});
		}
	},

	render: function() {
		return (
			React.createElement("div", {className: classNames("rgb-input", {"alpha-enabled": this.props.alphaEnabled})}, 
				React.createElement("input", {
					min: "0", 
					max: "255", 
					type: "number", 
					value: this.state.r, 
					onKeyDown: this._handleKeyDown, 
					onChange: this._onChange, 
					ref: "rInput"}
				), 
				React.createElement("input", {
					min: "0", 
					max: "255", 
					type: "number", 
					value: this.state.g, 
					onKeyDown: this._handleKeyDown, 
					onChange: this._onChange, 
					ref: "gInput"}
				), 
				React.createElement("input", {
					min: "0", 
					max: "255", 
					type: "number", 
					value: this.state.b, 
					onKeyDown: this._handleKeyDown, 
					onChange: this._onChange, 
					ref: "bInput"}
				), 
				React.createElement("input", {
					className: "rgb-input__alpha", 
					min: "0", 
					max: "1", 
					type: "number", 
					step: ".1", 
					value: this.state.a, 
					onKeyDown: this._handleKeyDown, 
					onChange: this._onChange, 
					ref: "aInput"}
				)
			)
		);
	},
	//comment
	_handleKeyDown: function(event) {
		if (event.keyCode === 13) {
			this._save();
		}
	},

	_onChange: function() {
		this.setState({
			r: React.findDOMNode(this.refs.rInput).valueAsNumber,
			g: React.findDOMNode(this.refs.gInput).valueAsNumber,
			b: React.findDOMNode(this.refs.bInput).valueAsNumber,
			a: React.findDOMNode(this.refs.aInput).valueAsNumber
		}, this._save.bind(this, true));
	},

	_save: function(keepOpen) {
		this.props.onSave([
			Math.min(Math.max(this.state.r || 0, 0), 255),
			Math.min(Math.max(this.state.g || 0, 0), 255),
			Math.min(Math.max(this.state.b || 0, 0), 255),
			Math.min(Math.max(this.state.a || 0, 0), 1)
		], keepOpen);
	}
});

module.exports = RgbInput;
},{"classnames":"/Users/rsandoval/colored/node_modules/classnames/index.js","react":"react"}],"/Users/rsandoval/colored/js/components/controls/TransparencyInput.react.js":[function(require,module,exports){
var React = require('react');
var classNames = require('classnames');
var ColorActions = require('./../../actions/ColorActions');

var TransparencyInput = React.createClass({displayName: "TransparencyInput",

	propTypes: {
		alpha: React.PropTypes.number.isRequired,
		hasTransparency: React.PropTypes.bool.isRequired
	},

	getInitialState: function() {
		return {
			isEditing: false,
			hasTransparency: this.props.hasTransparency || false,
			alpha: this.props.alpha || 1
		};
	},

	render: function() {
		var input;
		var display;
		var checked;
		if (this.state.hasTransparency){
			if (this.state.isEditing) {
				input =
					React.createElement("input", {
						type: "number", 
						min: "0", 
						max: "1", 
						step: ".1", 
						value: this.state.alpha, 
						onKeyDown: this._handleKeyDown, 
						onChange: this._onAlphaChange}
					);
					//
			}
		}
		//
		return (
			React.createElement("div", {className: classNames('color-input', 'transparency-input', {
				'editing': this.state.isEditing,
				'enabled': this.state.hasTransparency
				})
			}, 
				React.createElement("div", {className: "color-input__label"}, 
					React.createElement("span", {onDoubleClick: this._onDoubleClick}, "Transparency"), 
					React.createElement("input", {
						type: "checkbox", 
						onChange: this._onEnabledChange, 
						checked: this.state.hasTransparency}
					 )
				), 
				React.createElement("div", {className: "color-input__display", onDoubleClick: this._onDoubleClick}, this.props.alpha), 
				input
			)
		);
	},

	_onDoubleClick: function() {
		if (this.state.hasTransparency){
			this.setState({
				isEditing: true
			});
		}
	},

	_handleKeyDown: function(event) {
		if (event.keyCode === 13) {
			this._save();
		}
	},

	_onAlphaChange: function(event) {
		this.setState({
			alpha: event.target.value
		}, this._save.bind(this,true));
	},

	_onEnabledChange: function(event) {
		if (this.state.hasTransparency) {
			this.setState({
				isEditing: false
			});
		}
		this.setState({
			hasTransparency: !this.state.hasTransparency
		}, this._saveEnabled);
	},

	_saveEnabled: function(){
		ColorActions.updateAlphaEnabled(this.state.hasTransparency);
	},

	_save: function(keepOpen) {
		ColorActions.updateAlpha(this.state.alpha);
		if (!keepOpen) {
			this.setState({
				isEditing: false
			});
		}
	}

});

module.exports = TransparencyInput;
},{"./../../actions/ColorActions":"/Users/rsandoval/colored/js/actions/ColorActions.js","classnames":"/Users/rsandoval/colored/node_modules/classnames/index.js","react":"react"}],"/Users/rsandoval/colored/js/components/displaypane/DisplayPane.react.js":[function(require,module,exports){
var React = require('react');
var classNames = require('classnames');
var colorUtil = require('../../utils/colorUtil');
var DisplayText = require('./DisplayText.react');

var style = {
	backgroundColor: ''
}

var DisplayPane = React.createClass({displayName: "DisplayPane",

	propTypes: {
		hue: React.PropTypes.number.isRequired,
		saturation: React.PropTypes.number.isRequired,
		lightness: React.PropTypes.number.isRequired,
		alpha: React.PropTypes.number.isRequired,
		alphaEnabled: React.PropTypes.bool.isRequired
	},

	render: function() {
		style.backgroundColor = '#' + colorUtil.hsl2hex(this.props.hue, this.props.saturation, this.props.lightness);
		if (this.props.alphaEnabled) {
			style.opacity = this.props.alpha;
		} else {
			style.opacity = 1;
		}
		return (
			React.createElement("div", {
				className: classNames("picker-display",{
					'picker-display__dark' : this.props.lightness <= .45
				})}, 
				React.createElement("div", {className: "picker-display__background-image"}), 
				React.createElement("div", {className: "picker-display__inner", style: style}, 
					React.createElement(DisplayText, {color: [this.props.hue, this.props.saturation, this.props.lightness]})
				)
			)
		);
	}
});

module.exports = DisplayPane;
},{"../../utils/colorUtil":"/Users/rsandoval/colored/js/utils/colorUtil.js","./DisplayText.react":"/Users/rsandoval/colored/js/components/displaypane/DisplayText.react.js","classnames":"/Users/rsandoval/colored/node_modules/classnames/index.js","react":"react"}],"/Users/rsandoval/colored/js/components/displaypane/DisplayText.react.js":[function(require,module,exports){
var React = require('react');
var classNames = require('classnames');
var colorUtil = require('../../utils/colorUtil');

var style = {
	color: ''
}
var light = true;

var DisplayText = React.createClass({displayName: "DisplayText",

	propTypes: {
		color: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
	},

	render: function() {
		var hsl = this.props.color;
		var hex = colorUtil.hsl2hex(hsl[0], hsl[1], hsl[2]);
		style.color = hsl[2] > .45 ? '' : '#' + hex;
		return (
			React.createElement("div", {className: "picker-display__text picker-display__block", style: style}, 
				React.createElement("h1", {className: "sample-header"}, "Sample Text"), 
				React.createElement("p", {className: "sample-paragraph"}, "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet qui, perferendis! Nihil qui omnis corporis dignissimos. Quas, ab vitae, repellendus delectus nulla officiis possimus unde dignissimos nobis deserunt laudantium, quisquam.")
			)
		);
	}

});

module.exports = DisplayText;
},{"../../utils/colorUtil":"/Users/rsandoval/colored/js/utils/colorUtil.js","classnames":"/Users/rsandoval/colored/node_modules/classnames/index.js","react":"react"}],"/Users/rsandoval/colored/js/constants/ColorConstants.js":[function(require,module,exports){
var keyMirror = require('keymirror');

module.exports = keyMirror({
  HUE_UPDATE: null,
  SATURATION_UPDATE: null,
  LIGHTNESS_UPDATE: null,
  ALPHA_UPDATE: null,
  ALPHA_ENABLED_UPDATE: null,
  HEX_UPDATE: null,
  RGB_UPDATE: null,
  HSL_UPDATE: null
});

},{"keymirror":"/Users/rsandoval/colored/node_modules/keymirror/index.js"}],"/Users/rsandoval/colored/js/dispatcher/AppDispatcher.js":[function(require,module,exports){
/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * AppDispatcher
 *
 * A singleton that operates as the central hub for application updates.
 */

var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();

},{"flux":"flux"}],"/Users/rsandoval/colored/js/main.js":[function(require,module,exports){
var React = require('react');
var App = require('./components/App.js');
console.log(document.getElementById('approot'));
React.render(React.createElement(App, null), document.getElementById('approot'));
},{"./components/App.js":"/Users/rsandoval/colored/js/components/App.js","react":"react"}],"/Users/rsandoval/colored/js/stores/ColorStore.js":[function(require,module,exports){
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ColorConstants = require('../constants/ColorConstants');
var assign = require('object-assign');
var colorUtils = require('../utils/colorUtil');

var CHANGE_EVENT = 'change';

var _hue = Math.floor(Math.random()*360),
    _saturation = 1,
    _lightness = .5,
    _alpha = .75,
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
        updateAlphaEnabled(true);
        ColorStore.emitChange();
      } else {
        updateAlphaEnabled(false);
        ColorStore.emitChange();
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
      var alpha = rgb[3];
      if (hsl) {
        updateHue(hsl[0]);
        updateSaturation(hsl[1]);
        updateLightness(hsl[2]);
        ColorStore.emitChange();
      }
      if (typeof alpha == 'number' && validAlpha(+alpha)) {
        updateAlpha(+alpha);
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

},{"../constants/ColorConstants":"/Users/rsandoval/colored/js/constants/ColorConstants.js","../dispatcher/AppDispatcher":"/Users/rsandoval/colored/js/dispatcher/AppDispatcher.js","../utils/colorUtil":"/Users/rsandoval/colored/js/utils/colorUtil.js","events":"/Users/rsandoval/colored/node_modules/browserify/node_modules/events/events.js","object-assign":"object-assign"}],"/Users/rsandoval/colored/js/utils/colorUtil.js":[function(require,module,exports){
var utils = {
	hsv2rgb: function(h,s,v) {
		var c = v * s;
	    var h1 = h / 60;
	    var x = c * (1 - Math.abs((h1 % 2) - 1));
	    var m = v - c;
	    var rgb;

	    if (typeof h == 'undefined') rgb = [0, 0, 0];
	    else if (h1 < 1) rgb = [c, x, 0];
	    else if (h1 < 2) rgb = [x, c, 0];
	    else if (h1 < 3) rgb = [0, c, x];
	    else if (h1 < 4) rgb = [0, x, c];
	    else if (h1 < 5) rgb = [x, 0, c];
	    else if (h1 <= 6) rgb = [c, 0, x];

	    var r = 255 * (rgb[0] + m);
	    var g = 255 * (rgb[1] + m);
	    var b = 255 * (rgb[2] + m);
	    return [+r.toFixed(8), +g.toFixed(8), +b.toFixed(8)];
	},

	rgb2hsl: function(r,g,b) {
		var r1 = (r/255),
			g1 = (g/255),
			b1 = (b/255);

		var cMax = Math.max(r1,g1,b1),
			cMin = Math.min(r1,g1,b1),
			delta = cMax - cMin;
		var H,S,L;

		if (delta === 0) {
			H = 0;
		} else {
			switch (cMax) {
				case (r1):
					H = 60 * (((g1-b1)/delta) % 6);
					break;
				case (g1):
					H = 60 * (((b1-r1)/delta) + 2);
					break;
				case (b1):
					H = 60 * (((r1-g1)/delta) + 4);
					break;
			}
		}
	
		if (H<0) {
			H = 360 - Math.abs(H);
		}

		L = (cMax + cMin)/2;

		if (delta == 0) {
			S = 0;
		} else {
			S = delta/(1-Math.abs(2*L-1));
		}
		return [+H.toFixed(8),+S.toFixed(8),+L.toFixed(8)]
	},

	hsl2rgb: function(h,s,l) {
		h = h/360;
		var r, g, b;

	    if(s == 0){
	        r = g = b = l; // achromatic
	    }else{
	        function hue2rgb(p, q, t){
	            if(t < 0) t += 1;
	            if(t > 1) t -= 1;
	            if(t < 1/6) return p + (q - p) * 6 * t;
	            if(t < 1/2) return q;
	            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	            return p;
	        }

	        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	        var p = 2 * l - q;
	        r = hue2rgb(p, q, h + 1/3);
	        g = hue2rgb(p, q, h);
	        b = hue2rgb(p, q, h - 1/3);
	    }

	    return [+(r * 255).toPrecision(8), +(g * 255).toFixed(8), +(b * 255).toFixed(8)];
	},

	hsl2hex: function(h,s,l) {
		var rgb = this.hsl2rgb(h,s,l);
		return '' + componentToHex(Math.floor(rgb[0])) + componentToHex(Math.floor(rgb[1])) + componentToHex(Math.floor(rgb[2]));
	},

	hex2hsl: function(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

		return result ? this.rgb2hsl(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) : null;
	}

}

function componentToHex(c) {
	var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
window.color = utils;
module.exports = utils;
},{}],"/Users/rsandoval/colored/js/utils/domUtil.js":[function(require,module,exports){
var utils = {
	/*
	* @param element: dom element
	*/
	offset: function(element) {
        var boundingClientRect = element.getBoundingClientRect();
        return {
            width: boundingClientRect.width || element.prop('offsetWidth'),
            height: boundingClientRect.height || element.prop('offsetHeight'),
            top: boundingClientRect.top + (window.pageYOffset || document.documentElement.scrollTop),
            left: boundingClientRect.left + (window.pageXOffset || document.documentElement.scrollLeft)
        };
    },

    getStyle: function (el, cssprop) {
        if (el.currentStyle) { //IE
            return el.currentStyle[cssprop];
        } else if (window.getComputedStyle) {
            return window.getComputedStyle(el)[cssprop];
        }
        // finally try and get inline style
        return el.style[cssprop];
    }
}

module.exports = utils;
},{}],"/Users/rsandoval/colored/js/utils/generalUtil.js":[function(require,module,exports){
var utils = {
	debounce: function(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	},
	round: function(n, dec) {
		if (decimalPlaces(n) > (dec || 2)){
			return parseFloat(n.toFixed(dec || 2));
		} else {
			return n;
		}
	}
};

function decimalPlaces(number) {
  return ((+number).toFixed(20)).replace(/^-?\d*\.?|0+$/g, '').length;
}

module.exports = utils;
},{}],"/Users/rsandoval/colored/node_modules/browserify/node_modules/events/events.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],"/Users/rsandoval/colored/node_modules/classnames/index.js":[function(require,module,exports){
/*!
  Copyright (c) 2015 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes += ' ' + arg;
			} else if (Array.isArray(arg)) {
				classes += ' ' + classNames.apply(null, arg);
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes += ' ' + key;
					}
				}
			}
		}

		return classes.substr(1);
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],"/Users/rsandoval/colored/node_modules/keymirror/index.js":[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

"use strict";

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  if (!(obj instanceof Object && !Array.isArray(obj))) {
    throw new Error('keyMirror(...): Argument must be an object.');
  }
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

},{}]},{},["/Users/rsandoval/colored/js/main.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hY3Rpb25zL0NvbG9yQWN0aW9ucy5qcyIsImpzL2NvbXBvbmVudHMvQXBwLmpzIiwianMvY29tcG9uZW50cy9IZWFkZXIucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2NvbG9ycGFuZS9Db2xvclBhbmUucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2NvbG9ycGFuZS9TaGFkZVBhbmUucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2NvbnRyb2xzL0NvbnRyb2xQYW5lLnJlYWN0LmpzIiwianMvY29tcG9uZW50cy9jb250cm9scy9IZXhEaXNwbGF5LnJlYWN0LmpzIiwianMvY29tcG9uZW50cy9jb250cm9scy9IZXhJbnB1dC5yZWFjdC5qcyIsImpzL2NvbXBvbmVudHMvY29udHJvbHMvSHNsRGlzcGxheS5yZWFjdC5qcyIsImpzL2NvbXBvbmVudHMvY29udHJvbHMvSHNsSW5wdXQucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2NvbnRyb2xzL1JnYkRpc3BsYXkucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2NvbnRyb2xzL1JnYklucHV0LnJlYWN0LmpzIiwianMvY29tcG9uZW50cy9jb250cm9scy9UcmFuc3BhcmVuY3lJbnB1dC5yZWFjdC5qcyIsImpzL2NvbXBvbmVudHMvZGlzcGxheXBhbmUvRGlzcGxheVBhbmUucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2Rpc3BsYXlwYW5lL0Rpc3BsYXlUZXh0LnJlYWN0LmpzIiwianMvY29uc3RhbnRzL0NvbG9yQ29uc3RhbnRzLmpzIiwianMvZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyLmpzIiwianMvbWFpbi5qcyIsImpzL3N0b3Jlcy9Db2xvclN0b3JlLmpzIiwianMvdXRpbHMvY29sb3JVdGlsLmpzIiwianMvdXRpbHMvZG9tVXRpbC5qcyIsImpzL3V0aWxzL2dlbmVyYWxVdGlsLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9rZXltaXJyb3IvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBDb2xvckNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9Db2xvckNvbnN0YW50cycpO1xuXG52YXIgQ29sb3JBY3Rpb25zID0ge1xuXG4gIHVwZGF0ZVNhdHVyYXRpb246IGZ1bmN0aW9uKHNhdCkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogQ29sb3JDb25zdGFudHMuU0FUVVJBVElPTl9VUERBVEUsXG4gICAgICBzYXR1cmF0aW9uOiBzYXRcbiAgICB9KTtcbiAgfSxcblxuICB1cGRhdGVIdWU6IGZ1bmN0aW9uKGh1ZSkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogQ29sb3JDb25zdGFudHMuSFVFX1VQREFURSxcbiAgICAgIGh1ZTogaHVlXG4gICAgfSk7XG4gIH0sXG5cbiAgdXBkYXRlTGlnaHRuZXNzOiBmdW5jdGlvbihsaWdodCkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogQ29sb3JDb25zdGFudHMuTElHSFRORVNTX1VQREFURSxcbiAgICAgIGxpZ2h0bmVzczogbGlnaHRcbiAgICB9KTtcbiAgfSxcblxuICB1cGRhdGVBbHBoYTogZnVuY3Rpb24oYWxwaGEpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIGFjdGlvblR5cGU6IENvbG9yQ29uc3RhbnRzLkFMUEhBX1VQREFURSxcbiAgICAgIGFscGhhOiBhbHBoYVxuICAgIH0pO1xuICB9LFxuXG4gIHVwZGF0ZUFscGhhRW5hYmxlZDogZnVuY3Rpb24oZW5hYmxlZCkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogQ29sb3JDb25zdGFudHMuQUxQSEFfRU5BQkxFRF9VUERBVEUsXG4gICAgICBhbHBoYUVuYWJsZWQ6IGVuYWJsZWRcbiAgICB9KTtcbiAgfSxcblxuICB1cGRhdGVIZXg6IGZ1bmN0aW9uKGhleCkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogQ29sb3JDb25zdGFudHMuSEVYX1VQREFURSxcbiAgICAgIGhleDogaGV4XG4gICAgfSk7XG4gIH0sXG5cbiAgdXBkYXRlUmdiOiBmdW5jdGlvbihyZ2IpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIGFjdGlvblR5cGU6IENvbG9yQ29uc3RhbnRzLlJHQl9VUERBVEUsXG4gICAgICByZ2I6IHJnYlxuICAgIH0pO1xuICB9LFxuXG4gIHVwZGF0ZUhzbDogZnVuY3Rpb24oaHNsKSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICBhY3Rpb25UeXBlOiBDb2xvckNvbnN0YW50cy5IU0xfVVBEQVRFLFxuICAgICAgaHNsOiBoc2xcbiAgICB9KTtcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbG9yQWN0aW9ucztcbiIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBDb2xvclN0b3JlID0gcmVxdWlyZSgnLi8uLi9zdG9yZXMvQ29sb3JTdG9yZScpO1xudmFyIENvbG9yQWN0aW9ucyA9IHJlcXVpcmUoJy4vLi4vYWN0aW9ucy9Db2xvckFjdGlvbnMnKTtcblxudmFyIEhlYWRlciA9IHJlcXVpcmUoJy4vSGVhZGVyLnJlYWN0Jyk7XG52YXIgQ29sb3JQYW5lID0gcmVxdWlyZSgnLi9jb2xvcnBhbmUvQ29sb3JQYW5lLnJlYWN0Jyk7XG52YXIgU2hhZGVQYW5lID0gcmVxdWlyZSgnLi9jb2xvcnBhbmUvU2hhZGVQYW5lLnJlYWN0Jyk7XG52YXIgRGlzcGxheVBhbmUgPSByZXF1aXJlKCcuL2Rpc3BsYXlwYW5lL0Rpc3BsYXlQYW5lLnJlYWN0Jyk7XG52YXIgQ29udHJvbFBhbmUgPSByZXF1aXJlKCcuL2NvbnRyb2xzL0NvbnRyb2xQYW5lLnJlYWN0Jyk7XG5cbmZ1bmN0aW9uIGdldFN0YXRlKCkge1xuXHRyZXR1cm4ge1xuXHRcdHNhdHVyYXRpb246IENvbG9yU3RvcmUuZ2V0U2F0dXJhdGlvbigpLFxuXHRcdGh1ZTogQ29sb3JTdG9yZS5nZXRIdWUoKSxcblx0XHRsaWdodG5lc3M6IENvbG9yU3RvcmUuZ2V0TGlnaHRuZXNzKCksXG5cdFx0YWxwaGE6IENvbG9yU3RvcmUuZ2V0QWxwaGEoKSxcblx0XHRhbHBoYUVuYWJsZWQ6IENvbG9yU3RvcmUuZ2V0QWxwaGFFbmFibGVkKClcblx0fTtcbn1cblxudmFyIEFwcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJBcHBcIixcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBnZXRTdGF0ZSgpXG5cdH0sXG5cblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdENvbG9yU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuXHR9LFxuXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcblx0XHRDb2xvclN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic2l0ZS13cmFwcGVyXCJ9LCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChIZWFkZXIsIG51bGwpLCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcIm1haW5cIiwge2NsYXNzTmFtZTogXCJzaXRlLW1haW5cIn0sIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwaWNrZXItY29udHJvbHNcIn0sIFxuXHRcdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChDb250cm9sUGFuZSwge1xuXHRcdFx0XHRcdFx0XHRodWU6IHRoaXMuc3RhdGUuaHVlLCBcblx0XHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogdGhpcy5zdGF0ZS5zYXR1cmF0aW9uLCBcblx0XHRcdFx0XHRcdFx0bGlnaHRuZXNzOiB0aGlzLnN0YXRlLmxpZ2h0bmVzcywgXG5cdFx0XHRcdFx0XHRcdGFscGhhOiB0aGlzLnN0YXRlLmFscGhhLCBcblx0XHRcdFx0XHRcdFx0YWxwaGFFbmFibGVkOiB0aGlzLnN0YXRlLmFscGhhRW5hYmxlZH1cblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpLCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicGlja2VyLXdoZWVsXCJ9LCBcblx0XHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwaWNrZXItd2hlZWxfX3dyYXBwZXJcIn0sIFxuXHRcdFx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KENvbG9yUGFuZSwgbnVsbCksIFxuXHRcdFx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFNoYWRlUGFuZSwge1xuXHRcdFx0XHRcdFx0XHRcdGh1ZTogdGhpcy5zdGF0ZS5odWUsIFxuXHRcdFx0XHRcdFx0XHRcdHNhdHVyYXRpb246IHRoaXMuc3RhdGUuc2F0dXJhdGlvbiwgXG5cdFx0XHRcdFx0XHRcdFx0bGlnaHRuZXNzOiB0aGlzLnN0YXRlLmxpZ2h0bmVzc31cblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdCksIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGlzcGxheVBhbmUsIHtcblx0XHRcdFx0XHRcdGh1ZTogdGhpcy5zdGF0ZS5odWUsIFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogdGhpcy5zdGF0ZS5zYXR1cmF0aW9uLCBcblx0XHRcdFx0XHRcdGxpZ2h0bmVzczogdGhpcy5zdGF0ZS5saWdodG5lc3MsIFxuXHRcdFx0XHRcdFx0YWxwaGE6IHRoaXMuc3RhdGUuYWxwaGEsIFxuXHRcdFx0XHRcdFx0YWxwaGFFbmFibGVkOiB0aGlzLnN0YXRlLmFscGhhRW5hYmxlZH1cblx0XHRcdFx0XHQpXG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXG5cdF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZShnZXRTdGF0ZSgpKTtcblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHA7XG5cbjsoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRocm90dGxlID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgb2JqKSB7XG4gICAgICAgIHZhciBvYmogPSBvYmogfHwgd2luZG93O1xuICAgICAgICB2YXIgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICB2YXIgZnVuYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBvYmouZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQobmFtZSkpO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBvYmouYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBmdW5jKTtcbiAgICB9O1xuXG4gICAgLyogaW5pdCAtIHlvdSBjYW4gaW5pdCBhbnkgZXZlbnQgKi9cbiAgICB0aHJvdHRsZShcInJlc2l6ZVwiLCBcIm9wdGltaXplZFJlc2l6ZVwiKTtcbn0pKCk7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIEhlYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJIZWFkZXJcIixcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImhlYWRlclwiLCB7Y2xhc3NOYW1lOiBcInNpdGUtaGVhZGVyXCJ9LCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIHtjbGFzc05hbWU6IFwic2l0ZS1oZWFkZXJfX3RpdGxlXCJ9LCBcIkNvbG9yIFBhbmVcIilcblx0XHRcdClcblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBIZWFkZXI7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBDb2xvckFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0NvbG9yQWN0aW9ucycpO1xudmFyIGNvbG9yVXRpbHMgPSByZXF1aXJlKCcuLi8uLi91dGlscy9jb2xvclV0aWwnKTtcbnZhciBkb21VdGlscyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2RvbVV0aWwuanMnKTtcbnZhciBnZW5VdGlscyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2dlbmVyYWxVdGlsLmpzJyk7XG5cbnZhciBzaXplO1xudmFyIGFjdGl2ZSA9IGZhbHNlO1xudmFyIGxhc3RNb3ZlID0gMDtcbnZhciBtb3ZlVGhyb3R0bGUgPSAxO1xudmFyIHdyYXBwZXJTdHlsZSA9IHtcblx0ZGlzcGxheTogJ2lubGluZS1ibG9jaydcbn07XG52YXIgbWFya2VyU3R5bGUgPSB7XG5cdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuXHR3aWR0aDogJzJweCcsXG5cdGJhY2tncm91bmQ6ICdibGFjaycsXG5cdGxlZnQ6ICc1MCUnLFxuXHR0b3A6ICcwcHgnLFxuXHRtYXJnaW5MZWZ0OiAnLTFweCcsXG5cdHRyYW5zZm9ybU9yaWdpbjogJ2JvdHRvbSBjZW50ZXInLFxuXHRjdXJzb3I6ICdwb2ludGVyJ1xufTtcblxudmFyIENvbG9yUGFuZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJDb2xvclBhbmVcIixcblxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNhbnZhcyA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5jb2xvclBhbmVDYW52YXMpO1xuXHRcdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0c2l6ZSA9IHBhcnNlSW50KGRvbVV0aWxzLmdldFN0eWxlKHRoaXMuZ2V0RE9NTm9kZSgpLCAnd2lkdGgnKSk7XG5cdFx0Y2FudmFzLndpZHRoID0gc2l6ZTtcblx0XHRjYW52YXMuaGVpZ2h0ID0gc2l6ZTtcbiAgICBcdHRoaXMucGFpbnQoY29udGV4dCk7XG4gICAgXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb3B0aW1pemVkUmVzaXplJywgdGhpcy5yZXNpemUpO1xuXHR9LFxuXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb3B0aW1pemVkUmVzaXplJywgdGhpcy5yZXNpemUpO1xuXHR9LFxuXG5cdHJlc2l6ZTogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5TaXplID0gcGFyc2VJbnQoZG9tVXRpbHMuZ2V0U3R5bGUodGhpcy5nZXRET01Ob2RlKCksICd3aWR0aCcpKTtcblx0XHRpZiAoc2l6ZSAhPSBuU2l6ZSkge1xuXHRcdFx0c2l6ZSA9IG5TaXplO1xuXHRcdFx0dmFyIGNhbnZhcyA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5jb2xvclBhbmVDYW52YXMpO1xuXHRcdFx0Y2FudmFzLndpZHRoID0gc2l6ZTtcblx0XHRcdGNhbnZhcy5oZWlnaHQgPSBzaXplO1xuXHRcdFx0dmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0ICAgIFx0dGhpcy5wYWludChjb250ZXh0KTtcblx0XHR9XG5cdH0sXG5cblx0cGFpbnQ6IGZ1bmN0aW9uKGNvbnRleHQpIHtcblx0XHR2YXIgYml0bWFwID0gY29udGV4dC5nZXRJbWFnZURhdGEoMCwwLHNpemUsc2l6ZSk7XG5cdFx0dmFyIHZhbHVlID0gMTtcbiAgICAgICAgdmFyIHNhdHVyYXRpb24gPSAxO1xuXG5cdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCBzaXplOyB5KyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgc2l6ZTsgeCsrKSB7XG4gICAgICAgICAgICAgICAgLy8gb2Zmc2V0IGZvciB0aGUgNCBSR0JBIHZhbHVlcyBpbiB0aGUgZGF0YSBhcnJheVxuICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgPSA0ICogKCh5ICogc2l6ZSkgKyB4KTtcblxuICAgICAgICAgICAgICAgIHZhciBodWUgPSAxODAgKyBNYXRoLmF0YW4yKHkgLSBzaXplLzIsIHggLSBzaXplLzIpICogKDE4MCAvIE1hdGguUEkpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGhzdiA9IGNvbG9yVXRpbHMuaHN2MnJnYihodWUsIHNhdHVyYXRpb24sIHZhbHVlKTtcblxuICAgICAgICAgICAgICAgIC8vIGZpbGwgUkdCQSB2YWx1ZXNcbiAgICAgICAgICAgICAgICBiaXRtYXAuZGF0YVtvZmZzZXQgKyAwXSA9IGhzdlswXTtcbiAgICAgICAgICAgICAgICBiaXRtYXAuZGF0YVtvZmZzZXQgKyAxXSA9IGhzdlsxXTtcbiAgICAgICAgICAgICAgICBiaXRtYXAuZGF0YVtvZmZzZXQgKyAyXSA9IGhzdlsyXTtcbiAgICAgICAgICAgICAgICBiaXRtYXAuZGF0YVtvZmZzZXQgKyAzXSA9IDI1NTsgLy8gbm8gdHJhbnNwYXJlbmN5XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQucHV0SW1hZ2VEYXRhKGJpdG1hcCwgMCwgMCk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XG5cdFx0XHRcdGNsYXNzTmFtZTogXCJjb2xvci1wYW5lXCIsIFxuXHRcdFx0XHRzdHlsZTogd3JhcHBlclN0eWxlLCBcblx0XHRcdFx0b25Nb3VzZU1vdmU6IHRoaXMuX2hhbmRsZU1vdXNlTW92ZX0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIsIHtcblx0XHRcdFx0XHRpZDogXCJwaWNrZXJcIiwgXG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiBcImNvbG9yLXBhbmVfX2NhbnZhc1wiLCBcblx0XHRcdFx0XHRvbk1vdXNlRG93bjogdGhpcy5faGFuZGxlTW91c2VEb3duLCBcblx0XHRcdFx0XHRvbk1vdXNlTGVhdmU6IHRoaXMuX2hhbmRsZU1vdXNlTGVhdmUsIFxuXHRcdFx0XHRcdHJlZjogXCJjb2xvclBhbmVDYW52YXNcIn1cblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cblx0X2hhbmRsZU1vdXNlRG93bjogZnVuY3Rpb24oZG93bl9ldmVudCkge1xuXHRcdGFjdGl2ZSA9IHRydWU7XG5cdFx0dGhpcy5fc2V0Q29sb3IoZG93bl9ldmVudCk7XG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0dmFyIG1vdXNlTW92ZSA9IGZ1bmN0aW9uKG1vdmVfZXZlbnQpIHtcblx0XHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlTW92ZSk7XG5cdFx0XHR0aGF0Ll9zZXRDb2xvcihtb3ZlX2V2ZW50KTtcblx0XHR9O1xuXHRcdHZhciBtb3VzZVVwID0gZnVuY3Rpb24odXBfZXZlbnQpIHtcblx0XHRcdGFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcCk7XG5cdFx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlTW92ZSk7XG5cdFx0XHR0aGF0Ll9zZXRDb2xvcih1cF9ldmVudCk7XG5cdFx0fTtcblx0XHRkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwKTtcblx0XHRkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlTW92ZSk7XG5cdH0sXG5cblx0X2hhbmRsZU1vdXNlTGVhdmU6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYgKGFjdGl2ZSkge1xuXHRcdFx0dGhpcy5fc2V0Q29sb3IoZXZlbnQpO1xuXHRcdH1cblx0fSxcblxuXHRfaGFuZGxlTW91c2VNb3ZlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgXHRpZiAobm93ID4gbGFzdE1vdmUgKyBtb3ZlVGhyb3R0bGUgJiYgYWN0aXZlKSB7XG4gICAgICBcdFx0bGFzdE1vdmUgPSBub3c7XG4gICAgICBcdFx0dGhpcy5fc2V0Q29sb3IoZXZlbnQpO1xuICAgICAgXHR9XG5cdH0sXG5cblx0X3NldENvbG9yOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciBwb3MgPSBkb21VdGlscy5vZmZzZXQodGhpcy5nZXRET01Ob2RlKCkpO1xuXHRcdHZhciB4ID0gZXZlbnQucGFnZVggLSBwb3MubGVmdDtcblx0XHR2YXIgeSA9IGV2ZW50LnBhZ2VZIC0gcG9zLnRvcDtcblx0XHR2YXIgaHVlID0gMTgwICsgTWF0aC5hdGFuMih5IC0gc2l6ZS8yLCB4IC0gc2l6ZS8yKSAqICgxODAgLyBNYXRoLlBJKTtcblx0XHRDb2xvckFjdGlvbnMudXBkYXRlSHVlKCtodWUudG9GaXhlZCgyKSk7XG5cdH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sb3JQYW5lOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgY29sb3JVdGlscyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2NvbG9yVXRpbCcpO1xudmFyIGRvbVV0aWxzID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvZG9tVXRpbC5qcycpO1xudmFyIGdlblV0aWxzID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvZ2VuZXJhbFV0aWwuanMnKTtcbnZhciBDb2xvckFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0NvbG9yQWN0aW9ucycpO1xuXG52YXIgc2l6ZTtcbnZhciBwYWRkaW5nID0gMTA7XG52YXIgYWN0aXZlID0gZmFsc2U7XG52YXIgbGFzdE1vdmUgPSAwO1xudmFyIG1vdmVUaHJvdHRsZSA9IDE7XG52YXIgcGFpbnRpbmcgPSBmYWxzZTtcbnZhciBsYXN0SHVlO1xudmFyIHdyYXBwZXJTdHlsZSA9IHtcblx0ZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG5cdHBhZGRpbmc6IHBhZGRpbmcgKyAncHgnLFxuXHRib3hTaXppbmc6ICdjb250ZW50LWJveCcsXG5cdGJvcmRlclJhZGl1czogJzUwJSdcbn07XG52YXIgbW91c2VEb3duID0gZmFsc2U7XG52YXIgbW91c2VEb3duTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuXHRpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKCdjb2xvci1wYW5lX19jYW52YXMnKSA+PSAwKSB7XG5cdFx0bW91c2VEb3duID0gdHJ1ZTtcblx0fVxufTtcbnZhciBtb3N1ZVVwTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuXHRtb3VzZURvd24gPSBmYWxzZTtcbn07XG5cbnZhciBEaXNwbGF5UGFuZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJEaXNwbGF5UGFuZVwiLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGh1ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdHNhdHVyYXRpb246IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRsaWdodG5lc3M6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZFxuXHR9LFxuXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcblx0XHRzaXplID0gcGFyc2VJbnQoZG9tVXRpbHMuZ2V0U3R5bGUodGhpcy5nZXRET01Ob2RlKCksICd3aWR0aCcpKSsyO1xuXHRcdHZhciBjYW52YXMgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuc2hhZGVQYW5lQ2FudmFzKTtcblx0XHRjYW52YXMud2lkdGggPSBzaXplO1xuXHRcdGNhbnZhcy5oZWlnaHQgPSBzaXplO1xuXHRcdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgXHR0aGlzLnBhaW50KGNvbnRleHQpO1xuICAgIFx0bGFzdEh1ZSA9IHRoaXMucHJvcHMuaHVlO1xuXG4gICAgXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb3B0aW1pemVkUmVzaXplJywgdGhpcy5yZXNpemUpXG4gICAgXHRkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG1vdXNlRG93bkxpc3RlbmVyKTtcbiAgICBcdGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vc3VlVXBMaXN0ZW5lcik7XG5cdH0sXG5cblx0Y29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbihwcmV2UHJvcHMpIHtcblx0XHRpZiAoIW1vdXNlRG93biAmJiBsYXN0SHVlICE9IHRoaXMucHJvcHMuaHVlKSB7XG5cdFx0XHRsYXN0SHVlID0gdGhpcy5wcm9wcy5odWU7XG5cdFx0XHR2YXIgY29udGV4dCA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5zaGFkZVBhbmVDYW52YXMpLmdldENvbnRleHQoJzJkJyk7XG4gICAgXHRcdHRoaXMucGFpbnQoY29udGV4dCk7XG5cdFx0fVxuXHR9LFxuXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb3B0aW1pemVkUmVzaXplJywgdGhpcy5yZXNpemUpO1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG1vdXNlRG93bkxpc3RlbmVyKTtcbiAgICBcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3N1ZVVwTGlzdGVuZXIpO1xuXHR9LFxuXG5cdHJlc2l6ZTogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5TaXplID0gcGFyc2VJbnQoZG9tVXRpbHMuZ2V0U3R5bGUodGhpcy5nZXRET01Ob2RlKCksICd3aWR0aCcpKSsxO1xuXHRcdGlmIChzaXplICE9IG5TaXplKSB7XG5cdFx0XHRzaXplID0gblNpemU7XG5cdFx0XHR2YXIgY2FudmFzID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLnNoYWRlUGFuZUNhbnZhcyk7XG5cdFx0XHRjYW52YXMud2lkdGggPSBzaXplO1xuXHRcdFx0Y2FudmFzLmhlaWdodCA9IHNpemU7XG5cdFx0XHR2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHQgICAgXHR0aGlzLnBhaW50KGNvbnRleHQpO1xuXHRcdH1cblx0fSxcblxuXHRwYWludDogZnVuY3Rpb24oY29udGV4dCkge1xuXHRcdGlmICghcGFpbnRpbmcpIHtcblx0XHRcdHZhciBiaXRtYXAgPSBjb250ZXh0LmdldEltYWdlRGF0YSgwLDAsc2l6ZSxzaXplKTtcblx0XHRcdHZhciByID0gc2l6ZS8yO1xuXG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHNpemU7IHkrKykge1xuXHRcdFx0XHR2YXIgYzEgPSB5KnkgLSAyKnkqciArIHIqcjtcblx0XHRcdFx0dmFyIHgxID0gKDIqciAtIE1hdGguc3FydCg0KnIqci00KmMxKSkvMjtcblx0XHRcdFx0dmFyIHgyID0gKDIqciArIE1hdGguc3FydCg0KnIqci00KmMxKSkvMjtcblxuXHQgICAgXHRcdGZvciAodmFyIHggPSAwOyB4IDwgc2l6ZTsgeCsrKSB7XG5cblx0ICAgIFx0XHRcdGlmIChNYXRoLnNxcnQoKHgtcikqKHgtcikgKyAoeS1yKSooeS1yKSkgPiByKSB7XG5cdCAgICBcdFx0XHRcdGhzdiA9IFsyNTUsMjU1LDI1NV07XG5cdCAgICBcdFx0XHR9IGVsc2Uge1xuXHQgICAgXHRcdFx0XHR2YXIgYzIgPSAoIHgqeCAtIDIqeCpyICsgcipyKTtcblx0XHQgICAgXHRcdFx0dmFyIHkxID0gKDIqciAtIE1hdGguc3FydCg0KnIqci00KmMyKSkvMjtcblx0XHRcdFx0XHRcdHZhciB5MiA9ICgyKnIgKyBNYXRoLnNxcnQoNCpyKnItNCpjMikpLzI7XG5cblx0XHQgICAgXHRcdFx0dmFyIG9mZnNldCA9IDQgKiAoKHkgKiAoc2l6ZSkpICsgeCk7XG5cblx0XHQgICAgXHRcdFx0dmFyIGh1ZSA9IHRoaXMucHJvcHMuaHVlO1xuXHRcdCAgICBcdFx0XHR2YXIgc2F0dXJhdGlvbiA9ICh5LXkxKSAvICh5Mi15MSk7XG5cdFx0ICAgIFx0XHRcdHZhciBsaWdodG5lc3MgPSAoeC14MSkgLyAoeDIteDEpO1xuXHQgICAgXHRcdFx0XHR2YXIgaHN2ID0gY29sb3JVdGlscy5oc2wycmdiKGh1ZSwgc2F0dXJhdGlvbiwgbGlnaHRuZXNzKTtcblx0ICAgIFx0XHRcdH1cblxuXHQgICAgXHRcdFx0Yml0bWFwLmRhdGFbb2Zmc2V0ICsgMF0gPSBoc3ZbMF07XG5cdCAgICAgICAgICAgICAgICBiaXRtYXAuZGF0YVtvZmZzZXQgKyAxXSA9IGhzdlsxXTtcblx0ICAgICAgICAgICAgICAgIGJpdG1hcC5kYXRhW29mZnNldCArIDJdID0gaHN2WzJdO1xuXHQgICAgICAgICAgICAgICAgYml0bWFwLmRhdGFbb2Zmc2V0ICsgM10gPSAyNTU7IC8vIG5vIHRyYW5zcGFyZW5jeVxuXG5cdCAgICBcdFx0XG5cdCAgICAgICAgICAgfVxuXHQgICAgICAgfVxuXHQgICAgICAgIGNvbnRleHQucHV0SW1hZ2VEYXRhKGJpdG1hcCwgMCwgMCk7XG5cdCAgICAgICAgcGFpbnRpbmcgPSBmYWxzZTtcblx0ICAgIH1cblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBcInNoYWRlLXBhbmVcIiwgXG5cdFx0XHRcdHN0eWxlOiB3cmFwcGVyU3R5bGUsIFxuXHRcdFx0XHRvbk1vdXNlTW92ZTogdGhpcy5faGFuZGxlTW91c2VNb3ZlfSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzaGFkZS1wYW5lX193aW5kb3dcIn0sIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiwge1xuXHRcdFx0XHRcdFx0aWQ6IFwic2hhZGVcIiwgXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU6IFwic2hhZGUtcGFuZV9fY2FudmFzXCIsIFxuXHRcdFx0XHRcdFx0cmVmOiBcInNoYWRlUGFuZUNhbnZhc1wiLCBcblx0XHRcdFx0XHRcdG9uTW91c2VEb3duOiB0aGlzLl9oYW5kbGVNb3VzZURvd24sIFxuXHRcdFx0XHRcdFx0b25Nb3VzZUxlYXZlOiB0aGlzLl9oYW5kZU1vdXNlTGVhdmV9XG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblxuXHRfaGFuZGxlTW91c2VEb3duOiBmdW5jdGlvbihldmVudCkge1xuXHRcdGFjdGl2ZSA9IHRydWU7XG5cdFx0dGhpcy5fc2V0U2hhZGUoZXZlbnQpO1xuXHRcdHZhciBtb3VzZVVwID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRhY3RpdmUgPSBmYWxzZTtcblx0XHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXApO1xuXHRcdH07XG5cdFx0ZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcCk7XG5cdH0sXG5cblx0X2hhbmRsZU1vdXNlTGVhdmU6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYgKGFjdGl2ZSkge1xuXHRcdFx0dGhpcy5fc2V0U2hhZGUoZXZlbnQpO1xuXHRcdH1cblx0fSxcblxuXHRfaGFuZGxlTW91c2VNb3ZlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgXHRpZiAobm93ID4gbGFzdE1vdmUgKyBtb3ZlVGhyb3R0bGUgJiYgYWN0aXZlKSB7XG4gICAgICBcdFx0bGFzdE1vdmUgPSBub3c7XG4gICAgICBcdFx0dGhpcy5fc2V0U2hhZGUoZXZlbnQpO1xuICAgICAgXHR9XG5cdH0sXG5cblx0X3NldFNoYWRlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciBwb3MgPSBkb21VdGlscy5vZmZzZXQoUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLnNoYWRlUGFuZUNhbnZhcykpLFxuXHRcdFx0eCA9IGV2ZW50LnBhZ2VYIC0gcG9zLmxlZnQsXG5cdFx0XHR5ID0gZXZlbnQucGFnZVkgLSBwb3MudG9wLFxuXHRcdFx0ciA9IHNpemUvMjtcblxuXHRcdGlmIChNYXRoLnNxcnQoTWF0aC5wb3coeC1yLDIpICsgTWF0aC5wb3coeS1yLDIpKSA+IHIpe1xuXHRcdFx0aWYgKE1hdGguc3FydChNYXRoLnBvdyh4LXIsMikgKyBNYXRoLnBvdyh5LXIsMikpID4gcitwYWRkaW5nKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHZhciBtID0gKHktcikvKHgtciksXG5cdFx0XHRcdG5vcm0gPSBNYXRoLnNxcnQoMSArIG0qbSksXG5cdFx0XHRcdHNpZ24gPSB4IDwgciA/IC0xIDogMTtcblxuXHRcdFx0eCA9IHIgKyBzaWduKihyL25vcm0pO1xuXHRcdFx0eSA9IHIgKyBzaWduKihyKm0vbm9ybSk7XG5cdFx0fVxuXG5cdFx0dmFyIGMxID0geSp5IC0gMip5KnIgKyByKnIsXG5cdFx0XHR4MSA9ICgyKnIgLSBNYXRoLnNxcnQoNCpyKnItNCpjMSkpLzIsXG5cdFx0XHR4MiA9ICgyKnIgKyBNYXRoLnNxcnQoNCpyKnItNCpjMSkpLzIsXG5cdFx0XHRjMiA9ICggeCp4IC0gMip4KnIgKyByKnIpLFxuXHRcdFx0eTEgPSAoMipyIC0gTWF0aC5zcXJ0KDQqcipyLTQqYzIpKS8yLFxuXHRcdFx0eTIgPSAoMipyICsgTWF0aC5zcXJ0KDQqcipyLTQqYzIpKS8yO1xuXG5cdFx0dmFyIHNhdHVyYXRpb24gPSAoeS15MSkgLyAoeTIteTEpO1xuXHRcdHZhciBsaWdodG5lc3MgPSAoeC14MSkgLyAoeDIteDEpO1xuXHRcdENvbG9yQWN0aW9ucy51cGRhdGVTYXR1cmF0aW9uKCtzYXR1cmF0aW9uLnRvRml4ZWQoMikpO1xuXHRcdENvbG9yQWN0aW9ucy51cGRhdGVMaWdodG5lc3MoK2xpZ2h0bmVzcy50b0ZpeGVkKDIpKTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGxheVBhbmU7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBIc2xEaXNwbGF5ID0gcmVxdWlyZSgnLi9Ic2xEaXNwbGF5LnJlYWN0Jyk7XG52YXIgUmdiRGlzcGxheT0gcmVxdWlyZSgnLi9SZ2JEaXNwbGF5LnJlYWN0Jyk7XG52YXIgSGV4RGlzcGxheSA9IHJlcXVpcmUoJy4vSGV4RGlzcGxheS5yZWFjdCcpO1xudmFyIFRyYW5zcGFyZW5jeUlucHV0ID0gcmVxdWlyZSgnLi9UcmFuc3BhcmVuY3lJbnB1dC5yZWFjdCcpO1xudmFyIGNvbG9yVXRpbCA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2NvbG9yVXRpbCcpO1xuXG52YXIgc3R5bGUgPSB7XG5cdGJhY2tncm91bmRDb2xvcjogJydcbn1cblxudmFyIENvbnRyb2xQYW5lID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkNvbnRyb2xQYW5lXCIsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0aHVlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0c2F0dXJhdGlvbjogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdGxpZ2h0bmVzczogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdGFscGhhOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0YWxwaGFFbmFibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkXG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRzdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIycgKyBjb2xvclV0aWwuaHNsMmhleCh0aGlzLnByb3BzLmh1ZSwgdGhpcy5wcm9wcy5zYXR1cmF0aW9uLCB0aGlzLnByb3BzLmxpZ2h0bmVzcyk7XG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge3N0eWxlOiBzdHlsZSwgY2xhc3NOYW1lOiBcInBpY2tlci1pbnB1dHNcIn0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicGlja2VyLWlucHV0c19faW5uZXJcIn0sIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoSHNsRGlzcGxheSwge2NvbG9yOiBbdGhpcy5wcm9wcy5odWUsIHRoaXMucHJvcHMuc2F0dXJhdGlvbiwgdGhpcy5wcm9wcy5saWdodG5lc3NdfSksIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmdiRGlzcGxheSwge2NvbG9yOiBbdGhpcy5wcm9wcy5odWUsIHRoaXMucHJvcHMuc2F0dXJhdGlvbiwgdGhpcy5wcm9wcy5saWdodG5lc3NdLCBhbHBoYTogdGhpcy5wcm9wcy5hbHBoYSwgYWxwaGFFbmFibGVkOiB0aGlzLnByb3BzLmFscGhhRW5hYmxlZH0pLCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KEhleERpc3BsYXksIHtjb2xvcjogW3RoaXMucHJvcHMuaHVlLCB0aGlzLnByb3BzLnNhdHVyYXRpb24sIHRoaXMucHJvcHMubGlnaHRuZXNzXX0pLCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFRyYW5zcGFyZW5jeUlucHV0LCB7aGFzVHJhbnNwYXJlbmN5OiB0aGlzLnByb3BzLmFscGhhRW5hYmxlZCwgYWxwaGE6IHRoaXMucHJvcHMuYWxwaGF9KVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sUGFuZTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbnZhciBDb2xvckFjdGlvbnMgPSByZXF1aXJlKCcuLy4uLy4uL2FjdGlvbnMvQ29sb3JBY3Rpb25zJyk7XG52YXIgY29sb3JVdGlscyA9IHJlcXVpcmUoJy4vLi4vLi4vdXRpbHMvY29sb3JVdGlsJyk7XG52YXIgSGV4SW5wdXQgPSByZXF1aXJlKCcuL0hleElucHV0LnJlYWN0Jyk7XG5cblxudmFyIEhleERpc3BsYXkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiSGV4RGlzcGxheVwiLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMubnVtYmVyKS5pc1JlcXVpcmVkXG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0aXNFZGl0aW5nOiBmYWxzZVxuXHRcdH07XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgaGV4ID0gY29sb3JVdGlscy5oc2wyaGV4KHRoaXMucHJvcHMuY29sb3JbMF0sIHRoaXMucHJvcHMuY29sb3JbMV0sIHRoaXMucHJvcHMuY29sb3JbMl0pO1xuXHRcdHZhciBpbnB1dDtcblxuXHRcdGlmICh0aGlzLnN0YXRlLmlzRWRpdGluZykge1xuXHRcdFx0aW5wdXQgPSBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChIZXhJbnB1dCwge1xuXHRcdFx0XHRcdG9uU2F2ZTogdGhpcy5fb25TYXZlLCBcblx0XHRcdFx0XHRoZXg6IGhleH1cblx0XHRcdFx0KTtcblx0XHR9XG5cdFx0Ly9cblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XG5cdFx0XHRcdGNsYXNzTmFtZTogY2xhc3NOYW1lcygnY29sb3ItaW5wdXQnLCB7XG5cdFx0XHRcdFx0J2VkaXRpbmcnOiB0aGlzLnN0YXRlLmlzRWRpdGluZ1xuXHRcdFx0XHR9KX0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtvbkRvdWJsZUNsaWNrOiB0aGlzLl9vbkRvdWJsZUNsaWNrfSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbG9yLWlucHV0X19sYWJlbFwifSwgXCJIZXhcIiksIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb2xvci1pbnB1dF9fZGlzcGxheVwifSwgXCIjXCIsIGhleCApXG5cdFx0XHRcdCksIFxuXHRcdFx0XHRpbnB1dFxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cblx0X29uRG91YmxlQ2xpY2s6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe2lzRWRpdGluZzogdHJ1ZX0pO1xuXHR9LFxuXG5cdF9vblNhdmU6IGZ1bmN0aW9uKGhleCwga2VlcE9wZW4pIHtcblx0XHRDb2xvckFjdGlvbnMudXBkYXRlSGV4KGhleCk7XG5cdFx0aWYgKCFrZWVwT3Blbil7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtpc0VkaXRpbmc6IGZhbHNlfSk7XG5cdFx0fVxuXHR9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhleERpc3BsYXk7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBjb2xvclV0aWwgPSByZXF1aXJlKCcuLi8uLi91dGlscy9jb2xvclV0aWwnKTtcblxudmFyIEhleElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkhleElucHV0XCIsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0b25TYXZlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXHRcdGhleDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHRoaXMucHJvcHMuaGV4IHx8ICcnXG5cdFx0fTtcblx0fSxcblxuXHRjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKHByZXZQcm9wcykge1xuXHRcdGlmIChwcmV2UHJvcHMuaGV4ICE9IHRoaXMucHJvcHMuaGV4KSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0dmFsdWU6IHRoaXMucHJvcHMuaGV4XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0XHRcdFx0dmFsdWU6IHRoaXMuc3RhdGUudmFsdWUsIFxuXHRcdFx0XHRvbktleURvd246IHRoaXMuX2hhbmRsZUtleURvd24sIFxuXHRcdFx0XHRvbkNoYW5nZTogdGhpcy5fb25DaGFuZ2V9XG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblx0Ly9jb21tZW50XG5cdF9oYW5kbGVLZXlEb3duOiBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuXHRcdFx0dGhpcy5fc2F2ZSgpO1xuXHRcdH1cblx0fSxcblxuXHRfb25DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHR2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlXG5cdFx0fSwgdGhpcy5fY2hhbmdlQ2FsbGJhY2spO1xuXHR9LFxuXG5cdF9jaGFuZ2VDYWxsYmFjazogZnVuY3Rpb24oKXtcblx0XHRpZiAoY29sb3JVdGlsLmhleDJoc2wodGhpcy5zdGF0ZS52YWx1ZSkpe1xuXHRcdFx0dGhpcy5wcm9wcy5vblNhdmUodGhpcy5zdGF0ZS52YWx1ZSwgdHJ1ZSk7XG5cdFx0fVxuXHR9LFxuXG5cdF9zYXZlOiBmdW5jdGlvbigpIHtcblx0XHRpZiAoY29sb3JVdGlsLmhleDJoc2wodGhpcy5zdGF0ZS52YWx1ZSkpe1xuXHRcdFx0dGhpcy5wcm9wcy5vblNhdmUodGhpcy5zdGF0ZS52YWx1ZSk7XG5cdFx0fVxuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBIZXhJbnB1dDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbnZhciBDb2xvckFjdGlvbnMgPSByZXF1aXJlKCcuLy4uLy4uL2FjdGlvbnMvQ29sb3JBY3Rpb25zJyk7XG52YXIgSHNsSW5wdXQgPSByZXF1aXJlKCcuL0hzbElucHV0LnJlYWN0Jyk7XG52YXIgZ1V0aWwgPSByZXF1aXJlKCcuLy4uLy4uL3V0aWxzL2dlbmVyYWxVdGlsJyk7XG5cbnZhciBIc2xEaXNwbGF5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkhzbERpc3BsYXlcIixcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRjb2xvcjogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm51bWJlcikuaXNSZXF1aXJlZFxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGlzRWRpdGluZzogZmFsc2Vcblx0XHR9O1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGhzbCA9IHRoaXMucHJvcHMuY29sb3Jcblx0XHR2YXIgaW5wdXQ7XG5cblx0XHRpZiAodGhpcy5zdGF0ZS5pc0VkaXRpbmcpIHtcblx0XHRcdGlucHV0ID1cblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChIc2xJbnB1dCwge1xuXHRcdFx0XHRcdG9uU2F2ZTogdGhpcy5fb25TYXZlLCBcblx0XHRcdFx0XHRoOiBnVXRpbC5yb3VuZChoc2xbMF0pLCBcblx0XHRcdFx0XHRzOiBnVXRpbC5yb3VuZChoc2xbMV0pLCBcblx0XHRcdFx0XHRsOiBnVXRpbC5yb3VuZChoc2xbMl0pfVxuXHRcdFx0XHQpO1xuXHRcdH1cblx0XHQvL1xuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IGNsYXNzTmFtZXMoJ2NvbG9yLWlucHV0Jywge1xuXHRcdFx0XHQnZWRpdGluZyc6IHRoaXMuc3RhdGUuaXNFZGl0aW5nXG5cdFx0XHRcdH0pfSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge29uRG91YmxlQ2xpY2s6IHRoaXMuX29uRG91YmxlQ2xpY2t9LCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29sb3ItaW5wdXRfX2xhYmVsXCJ9LCBcIkhTTFwiKSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbG9yLWlucHV0X19kaXNwbGF5XCJ9LCBnVXRpbC5yb3VuZChoc2xbMF0pLCBcIiwgXCIsIGdVdGlsLnJvdW5kKGhzbFsxXSksIFwiLCBcIiwgZ1V0aWwucm91bmQoaHNsWzJdKSlcblx0XHRcdFx0KSwgXG5cdFx0XHRcdGlucHV0XG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblxuXHRfb25Eb3VibGVDbGljazogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7aXNFZGl0aW5nOiB0cnVlfSk7XG5cdH0sXG5cblx0X29uU2F2ZTogZnVuY3Rpb24oaHNsLCBrZWVwT3Blbikge1xuXHRcdENvbG9yQWN0aW9ucy51cGRhdGVIc2woaHNsKTtcblx0XHRpZiAoIWtlZXBPcGVuKXtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe2lzRWRpdGluZzogZmFsc2V9KTtcblx0XHR9XG5cdH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSHNsRGlzcGxheTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgSHNsSW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiSHNsSW5wdXRcIixcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRvblNhdmU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cdFx0aDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdHM6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRsOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRoOiB0aGlzLnByb3BzLmggfHwgMCxcblx0XHRcdHM6IHRoaXMucHJvcHMucyB8fCAwLFxuXHRcdFx0bDogdGhpcy5wcm9wcy5sIHx8IDBcblx0XHR9O1xuXHR9LFxuXG5cdGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24ocHJldlByb3BzKSB7XG5cdFx0aWYgKHByZXZQcm9wcy5oICE9IHRoaXMucHJvcHMuaCB8fCBwcmV2UHJvcHMucyAhPSB0aGlzLnByb3BzLnMgfHwgcHJldlByb3BzLmwgIT0gdGhpcy5wcm9wcy5sKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aDogdGhpcy5wcm9wcy5oLFxuXHRcdFx0XHRzOiB0aGlzLnByb3BzLnMsXG5cdFx0XHRcdGw6IHRoaXMucHJvcHMubFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJoc2wtaW5wdXRcIn0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge1xuXHRcdFx0XHRcdG1pbjogXCIwXCIsIFxuXHRcdFx0XHRcdG1heDogXCIzNjBcIiwgXG5cdFx0XHRcdFx0dHlwZTogXCJudW1iZXJcIiwgXG5cdFx0XHRcdFx0dmFsdWU6IHRoaXMuc3RhdGUuaCwgXG5cdFx0XHRcdFx0b25LZXlEb3duOiB0aGlzLl9oYW5kbGVLZXlEb3duLCBcblx0XHRcdFx0XHRvbkNoYW5nZTogdGhpcy5fb25DaGFuZ2UsIFxuXHRcdFx0XHRcdHJlZjogXCJoSW5wdXRcIn1cblx0XHRcdFx0KSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XG5cdFx0XHRcdFx0bWluOiBcIjBcIiwgXG5cdFx0XHRcdFx0bWF4OiBcIjFcIiwgXG5cdFx0XHRcdFx0c3RlcDogXCIuMVwiLCBcblx0XHRcdFx0XHR0eXBlOiBcIm51bWJlclwiLCBcblx0XHRcdFx0XHR2YWx1ZTogdGhpcy5zdGF0ZS5zLCBcblx0XHRcdFx0XHRvbktleURvd246IHRoaXMuX2hhbmRsZUtleURvd24sIFxuXHRcdFx0XHRcdG9uQ2hhbmdlOiB0aGlzLl9vbkNoYW5nZSwgXG5cdFx0XHRcdFx0cmVmOiBcInNJbnB1dFwifVxuXHRcdFx0XHQpLCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0XHRcdFx0XHRtaW46IFwiMFwiLCBcblx0XHRcdFx0XHRtYXg6IFwiMVwiLCBcblx0XHRcdFx0XHRzdGVwOiBcIi4xXCIsIFxuXHRcdFx0XHRcdHR5cGU6IFwibnVtYmVyXCIsIFxuXHRcdFx0XHRcdHZhbHVlOiB0aGlzLnN0YXRlLmwsIFxuXHRcdFx0XHRcdG9uS2V5RG93bjogdGhpcy5faGFuZGxlS2V5RG93biwgXG5cdFx0XHRcdFx0b25DaGFuZ2U6IHRoaXMuX29uQ2hhbmdlLCBcblx0XHRcdFx0XHRyZWY6IFwibElucHV0XCJ9XG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXHQvL2NvbW1lbnRcblx0X2hhbmRsZUtleURvd246IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG5cdFx0XHR0aGlzLl9zYXZlKCk7XG5cdFx0fVxuXHR9LFxuXG5cdF9vbkNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGg6IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5oSW5wdXQpLnZhbHVlQXNOdW1iZXIsXG5cdFx0XHRzOiBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuc0lucHV0KS52YWx1ZUFzTnVtYmVyLFxuXHRcdFx0bDogUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmxJbnB1dCkudmFsdWVBc051bWJlclxuXHRcdH0sIHRoaXMuX3NhdmUuYmluZCh0aGlzLCB0cnVlKSk7XG5cdH0sXG5cblx0X3NhdmU6IGZ1bmN0aW9uKGtlZXBPcGVuKSB7XG5cdFx0dGhpcy5wcm9wcy5vblNhdmUoW1xuXHRcdFx0TWF0aC5taW4oTWF0aC5tYXgodGhpcy5zdGF0ZS5oLCAwKSwgMzYwKSxcblx0XHRcdE1hdGgubWluKE1hdGgubWF4KHRoaXMuc3RhdGUucywgMCksIDEpLFxuXHRcdFx0TWF0aC5taW4oTWF0aC5tYXgodGhpcy5zdGF0ZS5sLCAwKSwgMSlcblx0XHRdLCBrZWVwT3Blbik7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhzbElucHV0OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIENvbG9yQWN0aW9ucyA9IHJlcXVpcmUoJy4vLi4vLi4vYWN0aW9ucy9Db2xvckFjdGlvbnMnKTtcbnZhciBjb2xvclV0aWxzID0gcmVxdWlyZSgnLi8uLi8uLi91dGlscy9jb2xvclV0aWwnKTtcbnZhciBnVXRpbCA9IHJlcXVpcmUoJy4vLi4vLi4vdXRpbHMvZ2VuZXJhbFV0aWwnKTtcbnZhciBSZ2JJbnB1dCA9IHJlcXVpcmUoJy4vUmdiSW5wdXQucmVhY3QnKTtcblxudmFyIFJnYkRpc3BsYXkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiUmdiRGlzcGxheVwiLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMubnVtYmVyKS5pc1JlcXVpcmVkLFxuXHRcdGFscGhhOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0YWxwaGFFbmFibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkXG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0aXNFZGl0aW5nOiBmYWxzZVxuXHRcdH07XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgcmdiID0gY29sb3JVdGlscy5oc2wycmdiKHRoaXMucHJvcHMuY29sb3JbMF0sIHRoaXMucHJvcHMuY29sb3JbMV0sIHRoaXMucHJvcHMuY29sb3JbMl0pO1xuXHRcdHZhciBpbnB1dDtcblxuXHRcdGlmICh0aGlzLnN0YXRlLmlzRWRpdGluZykge1xuXHRcdFx0aW5wdXQgPVxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFJnYklucHV0LCB7XG5cdFx0XHRcdFx0b25TYXZlOiB0aGlzLl9vblNhdmUsIFxuXHRcdFx0XHRcdHI6IGdVdGlsLnJvdW5kKHJnYlswXSksIFxuXHRcdFx0XHRcdGc6IGdVdGlsLnJvdW5kKHJnYlsxXSksIFxuXHRcdFx0XHRcdGI6IGdVdGlsLnJvdW5kKHJnYlsyXSksIFxuXHRcdFx0XHRcdGFscGhhOiB0aGlzLnByb3BzLmFscGhhLCBcblx0XHRcdFx0XHRhbHBoYUVuYWJsZWQ6IHRoaXMucHJvcHMuYWxwaGFFbmFibGVkfVxuXHRcdFx0XHQpO1xuXHRcdH1cblx0XHQvL1xuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IGNsYXNzTmFtZXMoJ2NvbG9yLWlucHV0Jywge1xuXHRcdFx0XHQnZWRpdGluZyc6IHRoaXMuc3RhdGUuaXNFZGl0aW5nXG5cdFx0XHRcdH0pfSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge29uRG91YmxlQ2xpY2s6IHRoaXMuX29uRG91YmxlQ2xpY2t9LCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29sb3ItaW5wdXRfX2xhYmVsXCJ9LCBcIlJHQlwiLCB0aGlzLnByb3BzLmFscGhhRW5hYmxlZCA/ICdhJyA6ICcnKSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbG9yLWlucHV0X19kaXNwbGF5XCJ9LCBcblx0XHRcdFx0XHRcdGdVdGlsLnJvdW5kKHJnYlswXSksIFwiLCBcIiwgZ1V0aWwucm91bmQocmdiWzFdKSwgXCIsIFwiLCBnVXRpbC5yb3VuZChyZ2JbMl0pLCB0aGlzLnByb3BzLmFscGhhRW5hYmxlZCA/ICcsICcrdGhpcy5wcm9wcy5hbHBoYSA6ICcnXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpLCBcblx0XHRcdFx0aW5wdXRcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXG5cdF9vbkRvdWJsZUNsaWNrOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtpc0VkaXRpbmc6IHRydWV9KTtcblx0fSxcblxuXHRfb25TYXZlOiBmdW5jdGlvbihyZ2IsIGtlZXBPcGVuKSB7XG5cdFx0Q29sb3JBY3Rpb25zLnVwZGF0ZVJnYihyZ2IpO1xuXHRcdGlmICgha2VlcE9wZW4pe1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7aXNFZGl0aW5nOiBmYWxzZX0pO1xuXHRcdH1cblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZ2JEaXNwbGF5OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIFJnYklucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlJnYklucHV0XCIsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0b25TYXZlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXHRcdHI6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRnOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0YjogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdGFscGhhOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0YWxwaGFFbmFibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkXG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cjogdGhpcy5wcm9wcy5yIHx8IDAsXG5cdFx0XHRnOiB0aGlzLnByb3BzLmcgfHwgMCxcblx0XHRcdGI6IHRoaXMucHJvcHMuYiB8fCAwLFxuXHRcdFx0YTogdGhpcy5wcm9wcy5hbHBoYSB8fCAwXG5cdFx0fTtcblx0fSxcblxuXHRjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKHByZXZQcm9wcykge1xuXHRcdGlmIChwcmV2UHJvcHMuciAhPSB0aGlzLnByb3BzLnIgfHwgcHJldlByb3BzLmcgIT0gdGhpcy5wcm9wcy5nIHx8IHByZXZQcm9wcy5iICE9IHRoaXMucHJvcHMuYikge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdHI6IHRoaXMucHJvcHMucixcblx0XHRcdFx0ZzogdGhpcy5wcm9wcy5nLFxuXHRcdFx0XHRiOiB0aGlzLnByb3BzLmIsXG5cdFx0XHRcdGE6IHRoaXMucHJvcHMuYWxwaGFcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IGNsYXNzTmFtZXMoXCJyZ2ItaW5wdXRcIiwge1wiYWxwaGEtZW5hYmxlZFwiOiB0aGlzLnByb3BzLmFscGhhRW5hYmxlZH0pfSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XG5cdFx0XHRcdFx0bWluOiBcIjBcIiwgXG5cdFx0XHRcdFx0bWF4OiBcIjI1NVwiLCBcblx0XHRcdFx0XHR0eXBlOiBcIm51bWJlclwiLCBcblx0XHRcdFx0XHR2YWx1ZTogdGhpcy5zdGF0ZS5yLCBcblx0XHRcdFx0XHRvbktleURvd246IHRoaXMuX2hhbmRsZUtleURvd24sIFxuXHRcdFx0XHRcdG9uQ2hhbmdlOiB0aGlzLl9vbkNoYW5nZSwgXG5cdFx0XHRcdFx0cmVmOiBcInJJbnB1dFwifVxuXHRcdFx0XHQpLCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0XHRcdFx0XHRtaW46IFwiMFwiLCBcblx0XHRcdFx0XHRtYXg6IFwiMjU1XCIsIFxuXHRcdFx0XHRcdHR5cGU6IFwibnVtYmVyXCIsIFxuXHRcdFx0XHRcdHZhbHVlOiB0aGlzLnN0YXRlLmcsIFxuXHRcdFx0XHRcdG9uS2V5RG93bjogdGhpcy5faGFuZGxlS2V5RG93biwgXG5cdFx0XHRcdFx0b25DaGFuZ2U6IHRoaXMuX29uQ2hhbmdlLCBcblx0XHRcdFx0XHRyZWY6IFwiZ0lucHV0XCJ9XG5cdFx0XHRcdCksIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge1xuXHRcdFx0XHRcdG1pbjogXCIwXCIsIFxuXHRcdFx0XHRcdG1heDogXCIyNTVcIiwgXG5cdFx0XHRcdFx0dHlwZTogXCJudW1iZXJcIiwgXG5cdFx0XHRcdFx0dmFsdWU6IHRoaXMuc3RhdGUuYiwgXG5cdFx0XHRcdFx0b25LZXlEb3duOiB0aGlzLl9oYW5kbGVLZXlEb3duLCBcblx0XHRcdFx0XHRvbkNoYW5nZTogdGhpcy5fb25DaGFuZ2UsIFxuXHRcdFx0XHRcdHJlZjogXCJiSW5wdXRcIn1cblx0XHRcdFx0KSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiBcInJnYi1pbnB1dF9fYWxwaGFcIiwgXG5cdFx0XHRcdFx0bWluOiBcIjBcIiwgXG5cdFx0XHRcdFx0bWF4OiBcIjFcIiwgXG5cdFx0XHRcdFx0dHlwZTogXCJudW1iZXJcIiwgXG5cdFx0XHRcdFx0c3RlcDogXCIuMVwiLCBcblx0XHRcdFx0XHR2YWx1ZTogdGhpcy5zdGF0ZS5hLCBcblx0XHRcdFx0XHRvbktleURvd246IHRoaXMuX2hhbmRsZUtleURvd24sIFxuXHRcdFx0XHRcdG9uQ2hhbmdlOiB0aGlzLl9vbkNoYW5nZSwgXG5cdFx0XHRcdFx0cmVmOiBcImFJbnB1dFwifVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblx0Ly9jb21tZW50XG5cdF9oYW5kbGVLZXlEb3duOiBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuXHRcdFx0dGhpcy5fc2F2ZSgpO1xuXHRcdH1cblx0fSxcblxuXHRfb25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0cjogUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLnJJbnB1dCkudmFsdWVBc051bWJlcixcblx0XHRcdGc6IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5nSW5wdXQpLnZhbHVlQXNOdW1iZXIsXG5cdFx0XHRiOiBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuYklucHV0KS52YWx1ZUFzTnVtYmVyLFxuXHRcdFx0YTogUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmFJbnB1dCkudmFsdWVBc051bWJlclxuXHRcdH0sIHRoaXMuX3NhdmUuYmluZCh0aGlzLCB0cnVlKSk7XG5cdH0sXG5cblx0X3NhdmU6IGZ1bmN0aW9uKGtlZXBPcGVuKSB7XG5cdFx0dGhpcy5wcm9wcy5vblNhdmUoW1xuXHRcdFx0TWF0aC5taW4oTWF0aC5tYXgodGhpcy5zdGF0ZS5yIHx8IDAsIDApLCAyNTUpLFxuXHRcdFx0TWF0aC5taW4oTWF0aC5tYXgodGhpcy5zdGF0ZS5nIHx8IDAsIDApLCAyNTUpLFxuXHRcdFx0TWF0aC5taW4oTWF0aC5tYXgodGhpcy5zdGF0ZS5iIHx8IDAsIDApLCAyNTUpLFxuXHRcdFx0TWF0aC5taW4oTWF0aC5tYXgodGhpcy5zdGF0ZS5hIHx8IDAsIDApLCAxKVxuXHRcdF0sIGtlZXBPcGVuKTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmdiSW5wdXQ7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xudmFyIENvbG9yQWN0aW9ucyA9IHJlcXVpcmUoJy4vLi4vLi4vYWN0aW9ucy9Db2xvckFjdGlvbnMnKTtcblxudmFyIFRyYW5zcGFyZW5jeUlucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRyYW5zcGFyZW5jeUlucHV0XCIsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0YWxwaGE6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRoYXNUcmFuc3BhcmVuY3k6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWRcblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRpc0VkaXRpbmc6IGZhbHNlLFxuXHRcdFx0aGFzVHJhbnNwYXJlbmN5OiB0aGlzLnByb3BzLmhhc1RyYW5zcGFyZW5jeSB8fCBmYWxzZSxcblx0XHRcdGFscGhhOiB0aGlzLnByb3BzLmFscGhhIHx8IDFcblx0XHR9O1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGlucHV0O1xuXHRcdHZhciBkaXNwbGF5O1xuXHRcdHZhciBjaGVja2VkO1xuXHRcdGlmICh0aGlzLnN0YXRlLmhhc1RyYW5zcGFyZW5jeSl7XG5cdFx0XHRpZiAodGhpcy5zdGF0ZS5pc0VkaXRpbmcpIHtcblx0XHRcdFx0aW5wdXQgPVxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XG5cdFx0XHRcdFx0XHR0eXBlOiBcIm51bWJlclwiLCBcblx0XHRcdFx0XHRcdG1pbjogXCIwXCIsIFxuXHRcdFx0XHRcdFx0bWF4OiBcIjFcIiwgXG5cdFx0XHRcdFx0XHRzdGVwOiBcIi4xXCIsIFxuXHRcdFx0XHRcdFx0dmFsdWU6IHRoaXMuc3RhdGUuYWxwaGEsIFxuXHRcdFx0XHRcdFx0b25LZXlEb3duOiB0aGlzLl9oYW5kbGVLZXlEb3duLCBcblx0XHRcdFx0XHRcdG9uQ2hhbmdlOiB0aGlzLl9vbkFscGhhQ2hhbmdlfVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9XG5cdFx0Ly9cblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBjbGFzc05hbWVzKCdjb2xvci1pbnB1dCcsICd0cmFuc3BhcmVuY3ktaW5wdXQnLCB7XG5cdFx0XHRcdCdlZGl0aW5nJzogdGhpcy5zdGF0ZS5pc0VkaXRpbmcsXG5cdFx0XHRcdCdlbmFibGVkJzogdGhpcy5zdGF0ZS5oYXNUcmFuc3BhcmVuY3lcblx0XHRcdFx0fSlcblx0XHRcdH0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29sb3ItaW5wdXRfX2xhYmVsXCJ9LCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7b25Eb3VibGVDbGljazogdGhpcy5fb25Eb3VibGVDbGlja30sIFwiVHJhbnNwYXJlbmN5XCIpLCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge1xuXHRcdFx0XHRcdFx0dHlwZTogXCJjaGVja2JveFwiLCBcblx0XHRcdFx0XHRcdG9uQ2hhbmdlOiB0aGlzLl9vbkVuYWJsZWRDaGFuZ2UsIFxuXHRcdFx0XHRcdFx0Y2hlY2tlZDogdGhpcy5zdGF0ZS5oYXNUcmFuc3BhcmVuY3l9XG5cdFx0XHRcdFx0IClcblx0XHRcdFx0KSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb2xvci1pbnB1dF9fZGlzcGxheVwiLCBvbkRvdWJsZUNsaWNrOiB0aGlzLl9vbkRvdWJsZUNsaWNrfSwgdGhpcy5wcm9wcy5hbHBoYSksIFxuXHRcdFx0XHRpbnB1dFxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cblx0X29uRG91YmxlQ2xpY2s6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLmhhc1RyYW5zcGFyZW5jeSl7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aXNFZGl0aW5nOiB0cnVlXG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cblx0X2hhbmRsZUtleURvd246IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG5cdFx0XHR0aGlzLl9zYXZlKCk7XG5cdFx0fVxuXHR9LFxuXG5cdF9vbkFscGhhQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0YWxwaGE6IGV2ZW50LnRhcmdldC52YWx1ZVxuXHRcdH0sIHRoaXMuX3NhdmUuYmluZCh0aGlzLHRydWUpKTtcblx0fSxcblxuXHRfb25FbmFibGVkQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLmhhc1RyYW5zcGFyZW5jeSkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzRWRpdGluZzogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdH1cblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGhhc1RyYW5zcGFyZW5jeTogIXRoaXMuc3RhdGUuaGFzVHJhbnNwYXJlbmN5XG5cdFx0fSwgdGhpcy5fc2F2ZUVuYWJsZWQpO1xuXHR9LFxuXG5cdF9zYXZlRW5hYmxlZDogZnVuY3Rpb24oKXtcblx0XHRDb2xvckFjdGlvbnMudXBkYXRlQWxwaGFFbmFibGVkKHRoaXMuc3RhdGUuaGFzVHJhbnNwYXJlbmN5KTtcblx0fSxcblxuXHRfc2F2ZTogZnVuY3Rpb24oa2VlcE9wZW4pIHtcblx0XHRDb2xvckFjdGlvbnMudXBkYXRlQWxwaGEodGhpcy5zdGF0ZS5hbHBoYSk7XG5cdFx0aWYgKCFrZWVwT3Blbikge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzRWRpdGluZzogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc3BhcmVuY3lJbnB1dDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgY29sb3JVdGlsID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvY29sb3JVdGlsJyk7XG52YXIgRGlzcGxheVRleHQgPSByZXF1aXJlKCcuL0Rpc3BsYXlUZXh0LnJlYWN0Jyk7XG5cbnZhciBzdHlsZSA9IHtcblx0YmFja2dyb3VuZENvbG9yOiAnJ1xufVxuXG52YXIgRGlzcGxheVBhbmUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiRGlzcGxheVBhbmVcIixcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRodWU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRzYXR1cmF0aW9uOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0bGlnaHRuZXNzOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0YWxwaGE6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRhbHBoYUVuYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWRcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjJyArIGNvbG9yVXRpbC5oc2wyaGV4KHRoaXMucHJvcHMuaHVlLCB0aGlzLnByb3BzLnNhdHVyYXRpb24sIHRoaXMucHJvcHMubGlnaHRuZXNzKTtcblx0XHRpZiAodGhpcy5wcm9wcy5hbHBoYUVuYWJsZWQpIHtcblx0XHRcdHN0eWxlLm9wYWNpdHkgPSB0aGlzLnByb3BzLmFscGhhO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZS5vcGFjaXR5ID0gMTtcblx0XHR9XG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xuXHRcdFx0XHRjbGFzc05hbWU6IGNsYXNzTmFtZXMoXCJwaWNrZXItZGlzcGxheVwiLHtcblx0XHRcdFx0XHQncGlja2VyLWRpc3BsYXlfX2RhcmsnIDogdGhpcy5wcm9wcy5saWdodG5lc3MgPD0gLjQ1XG5cdFx0XHRcdH0pfSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwaWNrZXItZGlzcGxheV9fYmFja2dyb3VuZC1pbWFnZVwifSksIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicGlja2VyLWRpc3BsYXlfX2lubmVyXCIsIHN0eWxlOiBzdHlsZX0sIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGlzcGxheVRleHQsIHtjb2xvcjogW3RoaXMucHJvcHMuaHVlLCB0aGlzLnByb3BzLnNhdHVyYXRpb24sIHRoaXMucHJvcHMubGlnaHRuZXNzXX0pXG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXNwbGF5UGFuZTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgY29sb3JVdGlsID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvY29sb3JVdGlsJyk7XG5cbnZhciBzdHlsZSA9IHtcblx0Y29sb3I6ICcnXG59XG52YXIgbGlnaHQgPSB0cnVlO1xuXG52YXIgRGlzcGxheVRleHQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiRGlzcGxheVRleHRcIixcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRjb2xvcjogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm51bWJlcikuaXNSZXF1aXJlZCxcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBoc2wgPSB0aGlzLnByb3BzLmNvbG9yO1xuXHRcdHZhciBoZXggPSBjb2xvclV0aWwuaHNsMmhleChoc2xbMF0sIGhzbFsxXSwgaHNsWzJdKTtcblx0XHRzdHlsZS5jb2xvciA9IGhzbFsyXSA+IC40NSA/ICcnIDogJyMnICsgaGV4O1xuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicGlja2VyLWRpc3BsYXlfX3RleHQgcGlja2VyLWRpc3BsYXlfX2Jsb2NrXCIsIHN0eWxlOiBzdHlsZX0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwge2NsYXNzTmFtZTogXCJzYW1wbGUtaGVhZGVyXCJ9LCBcIlNhbXBsZSBUZXh0XCIpLCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwge2NsYXNzTmFtZTogXCJzYW1wbGUtcGFyYWdyYXBoXCJ9LCBcIkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBBbWV0IHF1aSwgcGVyZmVyZW5kaXMhIE5paGlsIHF1aSBvbW5pcyBjb3Jwb3JpcyBkaWduaXNzaW1vcy4gUXVhcywgYWIgdml0YWUsIHJlcGVsbGVuZHVzIGRlbGVjdHVzIG51bGxhIG9mZmljaWlzIHBvc3NpbXVzIHVuZGUgZGlnbmlzc2ltb3Mgbm9iaXMgZGVzZXJ1bnQgbGF1ZGFudGl1bSwgcXVpc3F1YW0uXCIpXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXNwbGF5VGV4dDsiLCJ2YXIga2V5TWlycm9yID0gcmVxdWlyZSgna2V5bWlycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yKHtcbiAgSFVFX1VQREFURTogbnVsbCxcbiAgU0FUVVJBVElPTl9VUERBVEU6IG51bGwsXG4gIExJR0hUTkVTU19VUERBVEU6IG51bGwsXG4gIEFMUEhBX1VQREFURTogbnVsbCxcbiAgQUxQSEFfRU5BQkxFRF9VUERBVEU6IG51bGwsXG4gIEhFWF9VUERBVEU6IG51bGwsXG4gIFJHQl9VUERBVEU6IG51bGwsXG4gIEhTTF9VUERBVEU6IG51bGxcbn0pO1xuIiwiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQXBwRGlzcGF0Y2hlclxuICpcbiAqIEEgc2luZ2xldG9uIHRoYXQgb3BlcmF0ZXMgYXMgdGhlIGNlbnRyYWwgaHViIGZvciBhcHBsaWNhdGlvbiB1cGRhdGVzLlxuICovXG5cbnZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnZmx1eCcpLkRpc3BhdGNoZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IERpc3BhdGNoZXIoKTtcbiIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgQXBwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL0FwcC5qcycpO1xuY29uc29sZS5sb2coZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcHJvb3QnKSk7XG5SZWFjdC5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChBcHAsIG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwcm9vdCcpKTsiLCJ2YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBDb2xvckNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9Db2xvckNvbnN0YW50cycpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbnZhciBjb2xvclV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMvY29sb3JVdGlsJyk7XG5cbnZhciBDSEFOR0VfRVZFTlQgPSAnY2hhbmdlJztcblxudmFyIF9odWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMzYwKSxcbiAgICBfc2F0dXJhdGlvbiA9IDEsXG4gICAgX2xpZ2h0bmVzcyA9IC41LFxuICAgIF9hbHBoYSA9IC43NSxcbiAgICBfYWxwaGFFbmFibGVkID0gZmFsc2U7XG5cblxuZnVuY3Rpb24gdXBkYXRlSHVlKGh1ZSkge1xuICBfaHVlID0gaHVlO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTYXR1cmF0aW9uKHNhdCkge1xuICBfc2F0dXJhdGlvbiA9IHNhdDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlTGlnaHRuZXNzKGxpZ2h0KSB7XG4gIF9saWdodG5lc3MgPSBsaWdodDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQWxwaGEoYWxwaGEpIHtcbiAgX2FscGhhID0gYWxwaGE7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUFscGhhRW5hYmxlZChlbmFibGVkKSB7XG4gIF9hbHBoYUVuYWJsZWQgPSBlbmFibGVkO1xufVxuXG52YXIgQ29sb3JTdG9yZSA9IGFzc2lnbih7fSwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gIGdldEh1ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF9odWU7XG4gIH0sXG5cbiAgZ2V0U2F0dXJhdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF9zYXR1cmF0aW9uO1xuICB9LFxuXG4gIGdldExpZ2h0bmVzczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF9saWdodG5lc3M7XG4gIH0sXG5cbiAgZ2V0QWxwaGE6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfYWxwaGE7XG4gIH0sXG5cbiAgZ2V0QWxwaGFFbmFibGVkOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gX2FscGhhRW5hYmxlZDtcbiAgfSxcblxuICBlbWl0Q2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVtaXQoQ0hBTkdFX0VWRU5UKTtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIGFkZENoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHRoaXMub24oQ0hBTkdFX0VWRU5ULCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9XG59KTtcblxuLy8gUmVnaXN0ZXIgY2FsbGJhY2sgdG8gaGFuZGxlIGFsbCB1cGRhdGVzXG5BcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKGFjdGlvbikge1xuICAvL2NvbnNvbGUubG9nKCdDb2xvciBzdG9yZSBjYXRjaCBkaXNwYXRjaGVkIGFjdG9uJyk7XG5cbiAgc3dpdGNoKGFjdGlvbi5hY3Rpb25UeXBlKSB7XG4gICAgY2FzZSBDb2xvckNvbnN0YW50cy5IVUVfVVBEQVRFOlxuICAgICAgdmFyIGh1ZSA9IGFjdGlvbi5odWU7XG4gICAgICBpZiAodmFsaWRIdWUoK2h1ZSkpe1xuICAgICAgICB1cGRhdGVIdWUoK2h1ZSk7XG4gICAgICAgIENvbG9yU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBDb2xvckNvbnN0YW50cy5TQVRVUkFUSU9OX1VQREFURTpcbiAgICAgIHZhciBzYXQgPSBhY3Rpb24uc2F0dXJhdGlvbjtcbiAgICAgIGlmICh2YWxpZFNhdHVyYXRpb24oK3NhdCkpe1xuICAgICAgICB1cGRhdGVTYXR1cmF0aW9uKCtzYXQpO1xuICAgICAgICBDb2xvclN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQ29sb3JDb25zdGFudHMuTElHSFRORVNTX1VQREFURTpcbiAgICAgIHZhciBsaWdodCA9IGFjdGlvbi5saWdodG5lc3M7XG4gICAgICBpZiAodmFsaWRMaWdodG5lc3MoK2xpZ2h0KSl7XG4gICAgICAgIHVwZGF0ZUxpZ2h0bmVzcygrbGlnaHQpO1xuICAgICAgICBDb2xvclN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQ29sb3JDb25zdGFudHMuQUxQSEFfVVBEQVRFOlxuICAgICAgdmFyIGFscGhhID0gYWN0aW9uLmFscGhhO1xuICAgICAgaWYgKHZhbGlkQWxwaGEoK2FscGhhKSl7XG4gICAgICAgIHVwZGF0ZUFscGhhKCthbHBoYSk7XG4gICAgICAgIENvbG9yU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIENvbG9yQ29uc3RhbnRzLkFMUEhBX0VOQUJMRURfVVBEQVRFOlxuICAgICAgdmFyIGVuYWJsZWQgPSBhY3Rpb24uYWxwaGFFbmFibGVkO1xuICAgICAgaWYgKGVuYWJsZWQpe1xuICAgICAgICB1cGRhdGVBbHBoYUVuYWJsZWQodHJ1ZSk7XG4gICAgICAgIENvbG9yU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXBkYXRlQWxwaGFFbmFibGVkKGZhbHNlKTtcbiAgICAgICAgQ29sb3JTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgQ29sb3JDb25zdGFudHMuSEVYX1VQREFURTpcbiAgICAgIHZhciBoZXggPSBhY3Rpb24uaGV4O1xuICAgICAgdmFyIGhzbCA9IGNvbG9yVXRpbHMuaGV4MmhzbChoZXgpO1xuICAgICAgaWYgKGhzbCkge1xuICAgICAgICB1cGRhdGVIdWUoaHNsWzBdKTtcbiAgICAgICAgdXBkYXRlU2F0dXJhdGlvbihoc2xbMV0pO1xuICAgICAgICB1cGRhdGVMaWdodG5lc3MoaHNsWzJdKTtcbiAgICAgICAgQ29sb3JTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIENvbG9yQ29uc3RhbnRzLlJHQl9VUERBVEU6XG4gICAgICB2YXIgcmdiID0gYWN0aW9uLnJnYjtcbiAgICAgIHZhciBoc2wgPSBjb2xvclV0aWxzLnJnYjJoc2wocmdiWzBdLCByZ2JbMV0sIHJnYlsyXSk7XG4gICAgICB2YXIgYWxwaGEgPSByZ2JbM107XG4gICAgICBpZiAoaHNsKSB7XG4gICAgICAgIHVwZGF0ZUh1ZShoc2xbMF0pO1xuICAgICAgICB1cGRhdGVTYXR1cmF0aW9uKGhzbFsxXSk7XG4gICAgICAgIHVwZGF0ZUxpZ2h0bmVzcyhoc2xbMl0pO1xuICAgICAgICBDb2xvclN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgYWxwaGEgPT0gJ251bWJlcicgJiYgdmFsaWRBbHBoYSgrYWxwaGEpKSB7XG4gICAgICAgIHVwZGF0ZUFscGhhKCthbHBoYSk7XG4gICAgICAgIENvbG9yU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBDb2xvckNvbnN0YW50cy5IU0xfVVBEQVRFOlxuICAgICAgdmFyIGhzbCA9IGFjdGlvbi5oc2w7XG4gICAgICBpZiAoaHNsKSB7XG4gICAgICAgIHVwZGF0ZUh1ZShoc2xbMF0pO1xuICAgICAgICB1cGRhdGVTYXR1cmF0aW9uKGhzbFsxXSk7XG4gICAgICAgIHVwZGF0ZUxpZ2h0bmVzcyhoc2xbMl0pO1xuICAgICAgICBDb2xvclN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBubyBvcFxuICB9XG59KTtcblxuZnVuY3Rpb24gdmFsaWRIdWUoaHVlKSB7XG4gIGlmIChpc05hTihodWUpIHx8IGh1ZSA8IDAgfHwgaHVlID4gMzYwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkU2F0dXJhdGlvbihzYXQpIHtcbiAgaWYgKGlzTmFOKHNhdCkgfHwgc2F0IDwgMCB8fCBzYXQgPiAxKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkTGlnaHRuZXNzKGxpZ2h0KSB7XG4gIGlmIChpc05hTihsaWdodCkgfHwgbGlnaHQgPCAwIHx8IGxpZ2h0ID4gMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZEFscGhhKGFscGhhKSB7XG4gIGlmIChpc05hTihhbHBoYSkgfHwgYWxwaGEgPCAwIHx8IGFscGhhID4gMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbG9yU3RvcmU7XG4iLCJ2YXIgdXRpbHMgPSB7XG5cdGhzdjJyZ2I6IGZ1bmN0aW9uKGgscyx2KSB7XG5cdFx0dmFyIGMgPSB2ICogcztcblx0ICAgIHZhciBoMSA9IGggLyA2MDtcblx0ICAgIHZhciB4ID0gYyAqICgxIC0gTWF0aC5hYnMoKGgxICUgMikgLSAxKSk7XG5cdCAgICB2YXIgbSA9IHYgLSBjO1xuXHQgICAgdmFyIHJnYjtcblxuXHQgICAgaWYgKHR5cGVvZiBoID09ICd1bmRlZmluZWQnKSByZ2IgPSBbMCwgMCwgMF07XG5cdCAgICBlbHNlIGlmIChoMSA8IDEpIHJnYiA9IFtjLCB4LCAwXTtcblx0ICAgIGVsc2UgaWYgKGgxIDwgMikgcmdiID0gW3gsIGMsIDBdO1xuXHQgICAgZWxzZSBpZiAoaDEgPCAzKSByZ2IgPSBbMCwgYywgeF07XG5cdCAgICBlbHNlIGlmIChoMSA8IDQpIHJnYiA9IFswLCB4LCBjXTtcblx0ICAgIGVsc2UgaWYgKGgxIDwgNSkgcmdiID0gW3gsIDAsIGNdO1xuXHQgICAgZWxzZSBpZiAoaDEgPD0gNikgcmdiID0gW2MsIDAsIHhdO1xuXG5cdCAgICB2YXIgciA9IDI1NSAqIChyZ2JbMF0gKyBtKTtcblx0ICAgIHZhciBnID0gMjU1ICogKHJnYlsxXSArIG0pO1xuXHQgICAgdmFyIGIgPSAyNTUgKiAocmdiWzJdICsgbSk7XG5cdCAgICByZXR1cm4gWytyLnRvRml4ZWQoOCksICtnLnRvRml4ZWQoOCksICtiLnRvRml4ZWQoOCldO1xuXHR9LFxuXG5cdHJnYjJoc2w6IGZ1bmN0aW9uKHIsZyxiKSB7XG5cdFx0dmFyIHIxID0gKHIvMjU1KSxcblx0XHRcdGcxID0gKGcvMjU1KSxcblx0XHRcdGIxID0gKGIvMjU1KTtcblxuXHRcdHZhciBjTWF4ID0gTWF0aC5tYXgocjEsZzEsYjEpLFxuXHRcdFx0Y01pbiA9IE1hdGgubWluKHIxLGcxLGIxKSxcblx0XHRcdGRlbHRhID0gY01heCAtIGNNaW47XG5cdFx0dmFyIEgsUyxMO1xuXG5cdFx0aWYgKGRlbHRhID09PSAwKSB7XG5cdFx0XHRIID0gMDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3dpdGNoIChjTWF4KSB7XG5cdFx0XHRcdGNhc2UgKHIxKTpcblx0XHRcdFx0XHRIID0gNjAgKiAoKChnMS1iMSkvZGVsdGEpICUgNik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgKGcxKTpcblx0XHRcdFx0XHRIID0gNjAgKiAoKChiMS1yMSkvZGVsdGEpICsgMik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgKGIxKTpcblx0XHRcdFx0XHRIID0gNjAgKiAoKChyMS1nMSkvZGVsdGEpICsgNCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcblx0XHRpZiAoSDwwKSB7XG5cdFx0XHRIID0gMzYwIC0gTWF0aC5hYnMoSCk7XG5cdFx0fVxuXG5cdFx0TCA9IChjTWF4ICsgY01pbikvMjtcblxuXHRcdGlmIChkZWx0YSA9PSAwKSB7XG5cdFx0XHRTID0gMDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0UyA9IGRlbHRhLygxLU1hdGguYWJzKDIqTC0xKSk7XG5cdFx0fVxuXHRcdHJldHVybiBbK0gudG9GaXhlZCg4KSwrUy50b0ZpeGVkKDgpLCtMLnRvRml4ZWQoOCldXG5cdH0sXG5cblx0aHNsMnJnYjogZnVuY3Rpb24oaCxzLGwpIHtcblx0XHRoID0gaC8zNjA7XG5cdFx0dmFyIHIsIGcsIGI7XG5cblx0ICAgIGlmKHMgPT0gMCl7XG5cdCAgICAgICAgciA9IGcgPSBiID0gbDsgLy8gYWNocm9tYXRpY1xuXHQgICAgfWVsc2V7XG5cdCAgICAgICAgZnVuY3Rpb24gaHVlMnJnYihwLCBxLCB0KXtcblx0ICAgICAgICAgICAgaWYodCA8IDApIHQgKz0gMTtcblx0ICAgICAgICAgICAgaWYodCA+IDEpIHQgLT0gMTtcblx0ICAgICAgICAgICAgaWYodCA8IDEvNikgcmV0dXJuIHAgKyAocSAtIHApICogNiAqIHQ7XG5cdCAgICAgICAgICAgIGlmKHQgPCAxLzIpIHJldHVybiBxO1xuXHQgICAgICAgICAgICBpZih0IDwgMi8zKSByZXR1cm4gcCArIChxIC0gcCkgKiAoMi8zIC0gdCkgKiA2O1xuXHQgICAgICAgICAgICByZXR1cm4gcDtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgcSA9IGwgPCAwLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHM7XG5cdCAgICAgICAgdmFyIHAgPSAyICogbCAtIHE7XG5cdCAgICAgICAgciA9IGh1ZTJyZ2IocCwgcSwgaCArIDEvMyk7XG5cdCAgICAgICAgZyA9IGh1ZTJyZ2IocCwgcSwgaCk7XG5cdCAgICAgICAgYiA9IGh1ZTJyZ2IocCwgcSwgaCAtIDEvMyk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBbKyhyICogMjU1KS50b1ByZWNpc2lvbig4KSwgKyhnICogMjU1KS50b0ZpeGVkKDgpLCArKGIgKiAyNTUpLnRvRml4ZWQoOCldO1xuXHR9LFxuXG5cdGhzbDJoZXg6IGZ1bmN0aW9uKGgscyxsKSB7XG5cdFx0dmFyIHJnYiA9IHRoaXMuaHNsMnJnYihoLHMsbCk7XG5cdFx0cmV0dXJuICcnICsgY29tcG9uZW50VG9IZXgoTWF0aC5mbG9vcihyZ2JbMF0pKSArIGNvbXBvbmVudFRvSGV4KE1hdGguZmxvb3IocmdiWzFdKSkgKyBjb21wb25lbnRUb0hleChNYXRoLmZsb29yKHJnYlsyXSkpO1xuXHR9LFxuXG5cdGhleDJoc2w6IGZ1bmN0aW9uKGhleCkge1xuXHRcdHZhciByZXN1bHQgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcblxuXHRcdHJldHVybiByZXN1bHQgPyB0aGlzLnJnYjJoc2wocGFyc2VJbnQocmVzdWx0WzFdLCAxNiksIHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpLCBwYXJzZUludChyZXN1bHRbM10sIDE2KSkgOiBudWxsO1xuXHR9XG5cbn1cblxuZnVuY3Rpb24gY29tcG9uZW50VG9IZXgoYykge1xuXHR2YXIgaGV4ID0gYy50b1N0cmluZygxNik7XG4gICAgcmV0dXJuIGhleC5sZW5ndGggPT0gMSA/IFwiMFwiICsgaGV4IDogaGV4O1xufVxud2luZG93LmNvbG9yID0gdXRpbHM7XG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxzOyIsInZhciB1dGlscyA9IHtcblx0Lypcblx0KiBAcGFyYW0gZWxlbWVudDogZG9tIGVsZW1lbnRcblx0Ki9cblx0b2Zmc2V0OiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHZhciBib3VuZGluZ0NsaWVudFJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGg6IGJvdW5kaW5nQ2xpZW50UmVjdC53aWR0aCB8fCBlbGVtZW50LnByb3AoJ29mZnNldFdpZHRoJyksXG4gICAgICAgICAgICBoZWlnaHQ6IGJvdW5kaW5nQ2xpZW50UmVjdC5oZWlnaHQgfHwgZWxlbWVudC5wcm9wKCdvZmZzZXRIZWlnaHQnKSxcbiAgICAgICAgICAgIHRvcDogYm91bmRpbmdDbGllbnRSZWN0LnRvcCArICh3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCksXG4gICAgICAgICAgICBsZWZ0OiBib3VuZGluZ0NsaWVudFJlY3QubGVmdCArICh3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQpXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGdldFN0eWxlOiBmdW5jdGlvbiAoZWwsIGNzc3Byb3ApIHtcbiAgICAgICAgaWYgKGVsLmN1cnJlbnRTdHlsZSkgeyAvL0lFXG4gICAgICAgICAgICByZXR1cm4gZWwuY3VycmVudFN0eWxlW2Nzc3Byb3BdO1xuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpW2Nzc3Byb3BdO1xuICAgICAgICB9XG4gICAgICAgIC8vIGZpbmFsbHkgdHJ5IGFuZCBnZXQgaW5saW5lIHN0eWxlXG4gICAgICAgIHJldHVybiBlbC5zdHlsZVtjc3Nwcm9wXTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdXRpbHM7IiwidmFyIHV0aWxzID0ge1xuXHRkZWJvdW5jZTogZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG5cdFx0dmFyIHRpbWVvdXQ7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuXHRcdFx0dmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRpbWVvdXQgPSBudWxsO1xuXHRcdFx0XHRpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHRcdH07XG5cdFx0XHR2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcblx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0XHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcblx0XHRcdGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdH07XG5cdH0sXG5cdHJvdW5kOiBmdW5jdGlvbihuLCBkZWMpIHtcblx0XHRpZiAoZGVjaW1hbFBsYWNlcyhuKSA+IChkZWMgfHwgMikpe1xuXHRcdFx0cmV0dXJuIHBhcnNlRmxvYXQobi50b0ZpeGVkKGRlYyB8fCAyKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBuO1xuXHRcdH1cblx0fVxufTtcblxuZnVuY3Rpb24gZGVjaW1hbFBsYWNlcyhudW1iZXIpIHtcbiAgcmV0dXJuICgoK251bWJlcikudG9GaXhlZCgyMCkpLnJlcGxhY2UoL14tP1xcZCpcXC4/fDArJC9nLCAnJykubGVuZ3RoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxzOyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIi8qIVxuICBDb3B5cmlnaHQgKGMpIDIwMTUgSmVkIFdhdHNvbi5cbiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlIChNSVQpLCBzZWVcbiAgaHR0cDovL2plZHdhdHNvbi5naXRodWIuaW8vY2xhc3NuYW1lc1xuKi9cbi8qIGdsb2JhbCBkZWZpbmUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuXHRmdW5jdGlvbiBjbGFzc05hbWVzICgpIHtcblx0XHR2YXIgY2xhc3NlcyA9ICcnO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykgY29udGludWU7XG5cblx0XHRcdHZhciBhcmdUeXBlID0gdHlwZW9mIGFyZztcblxuXHRcdFx0aWYgKGFyZ1R5cGUgPT09ICdzdHJpbmcnIHx8IGFyZ1R5cGUgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsgYXJnO1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcblx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZyk7XG5cdFx0XHR9IGVsc2UgaWYgKGFyZ1R5cGUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGZvciAodmFyIGtleSBpbiBhcmcpIHtcblx0XHRcdFx0XHRpZiAoaGFzT3duLmNhbGwoYXJnLCBrZXkpICYmIGFyZ1trZXldKSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGtleTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY2xhc3Nlcy5zdWJzdHIoMSk7XG5cdH1cblxuXHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGNsYXNzTmFtZXM7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIHJlZ2lzdGVyIGFzICdjbGFzc25hbWVzJywgY29uc2lzdGVudCB3aXRoIG5wbSBwYWNrYWdlIG5hbWVcblx0XHRkZWZpbmUoJ2NsYXNzbmFtZXMnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gY2xhc3NOYW1lcztcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHR3aW5kb3cuY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXM7XG5cdH1cbn0oKSk7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ29uc3RydWN0cyBhbiBlbnVtZXJhdGlvbiB3aXRoIGtleXMgZXF1YWwgdG8gdGhlaXIgdmFsdWUuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogICB2YXIgQ09MT1JTID0ga2V5TWlycm9yKHtibHVlOiBudWxsLCByZWQ6IG51bGx9KTtcbiAqICAgdmFyIG15Q29sb3IgPSBDT0xPUlMuYmx1ZTtcbiAqICAgdmFyIGlzQ29sb3JWYWxpZCA9ICEhQ09MT1JTW215Q29sb3JdO1xuICpcbiAqIFRoZSBsYXN0IGxpbmUgY291bGQgbm90IGJlIHBlcmZvcm1lZCBpZiB0aGUgdmFsdWVzIG9mIHRoZSBnZW5lcmF0ZWQgZW51bSB3ZXJlXG4gKiBub3QgZXF1YWwgdG8gdGhlaXIga2V5cy5cbiAqXG4gKiAgIElucHV0OiAge2tleTE6IHZhbDEsIGtleTI6IHZhbDJ9XG4gKiAgIE91dHB1dDoge2tleTE6IGtleTEsIGtleTI6IGtleTJ9XG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9ialxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG52YXIga2V5TWlycm9yID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciByZXQgPSB7fTtcbiAgdmFyIGtleTtcbiAgaWYgKCEob2JqIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KG9iaikpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdrZXlNaXJyb3IoLi4uKTogQXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QuJyk7XG4gIH1cbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHJldFtrZXldID0ga2V5O1xuICB9XG4gIHJldHVybiByZXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcjtcbiJdfQ==
