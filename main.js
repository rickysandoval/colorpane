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
				React.createElement("h1", {className: "site-header__title"}, "Color thing")
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hY3Rpb25zL0NvbG9yQWN0aW9ucy5qcyIsImpzL2NvbXBvbmVudHMvQXBwLmpzIiwianMvY29tcG9uZW50cy9IZWFkZXIucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2NvbG9ycGFuZS9Db2xvclBhbmUucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2NvbG9ycGFuZS9TaGFkZVBhbmUucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2NvbnRyb2xzL0NvbnRyb2xQYW5lLnJlYWN0LmpzIiwianMvY29tcG9uZW50cy9jb250cm9scy9IZXhEaXNwbGF5LnJlYWN0LmpzIiwianMvY29tcG9uZW50cy9jb250cm9scy9IZXhJbnB1dC5yZWFjdC5qcyIsImpzL2NvbXBvbmVudHMvY29udHJvbHMvSHNsRGlzcGxheS5yZWFjdC5qcyIsImpzL2NvbXBvbmVudHMvY29udHJvbHMvSHNsSW5wdXQucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2NvbnRyb2xzL1JnYkRpc3BsYXkucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2NvbnRyb2xzL1JnYklucHV0LnJlYWN0LmpzIiwianMvY29tcG9uZW50cy9jb250cm9scy9UcmFuc3BhcmVuY3lJbnB1dC5yZWFjdC5qcyIsImpzL2NvbXBvbmVudHMvZGlzcGxheXBhbmUvRGlzcGxheVBhbmUucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2Rpc3BsYXlwYW5lL0Rpc3BsYXlUZXh0LnJlYWN0LmpzIiwianMvY29uc3RhbnRzL0NvbG9yQ29uc3RhbnRzLmpzIiwianMvZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyLmpzIiwianMvbWFpbi5qcyIsImpzL3N0b3Jlcy9Db2xvclN0b3JlLmpzIiwianMvdXRpbHMvY29sb3JVdGlsLmpzIiwianMvdXRpbHMvZG9tVXRpbC5qcyIsImpzL3V0aWxzL2dlbmVyYWxVdGlsLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9rZXltaXJyb3IvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBDb2xvckNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9Db2xvckNvbnN0YW50cycpO1xuXG52YXIgQ29sb3JBY3Rpb25zID0ge1xuXG4gIHVwZGF0ZVNhdHVyYXRpb246IGZ1bmN0aW9uKHNhdCkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogQ29sb3JDb25zdGFudHMuU0FUVVJBVElPTl9VUERBVEUsXG4gICAgICBzYXR1cmF0aW9uOiBzYXRcbiAgICB9KTtcbiAgfSxcblxuICB1cGRhdGVIdWU6IGZ1bmN0aW9uKGh1ZSkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogQ29sb3JDb25zdGFudHMuSFVFX1VQREFURSxcbiAgICAgIGh1ZTogaHVlXG4gICAgfSk7XG4gIH0sXG5cbiAgdXBkYXRlTGlnaHRuZXNzOiBmdW5jdGlvbihsaWdodCkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogQ29sb3JDb25zdGFudHMuTElHSFRORVNTX1VQREFURSxcbiAgICAgIGxpZ2h0bmVzczogbGlnaHRcbiAgICB9KTtcbiAgfSxcblxuICB1cGRhdGVBbHBoYTogZnVuY3Rpb24oYWxwaGEpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIGFjdGlvblR5cGU6IENvbG9yQ29uc3RhbnRzLkFMUEhBX1VQREFURSxcbiAgICAgIGFscGhhOiBhbHBoYVxuICAgIH0pO1xuICB9LFxuXG4gIHVwZGF0ZUFscGhhRW5hYmxlZDogZnVuY3Rpb24oZW5hYmxlZCkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogQ29sb3JDb25zdGFudHMuQUxQSEFfRU5BQkxFRF9VUERBVEUsXG4gICAgICBhbHBoYUVuYWJsZWQ6IGVuYWJsZWRcbiAgICB9KTtcbiAgfSxcblxuICB1cGRhdGVIZXg6IGZ1bmN0aW9uKGhleCkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogQ29sb3JDb25zdGFudHMuSEVYX1VQREFURSxcbiAgICAgIGhleDogaGV4XG4gICAgfSk7XG4gIH0sXG5cbiAgdXBkYXRlUmdiOiBmdW5jdGlvbihyZ2IpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIGFjdGlvblR5cGU6IENvbG9yQ29uc3RhbnRzLlJHQl9VUERBVEUsXG4gICAgICByZ2I6IHJnYlxuICAgIH0pO1xuICB9LFxuXG4gIHVwZGF0ZUhzbDogZnVuY3Rpb24oaHNsKSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICBhY3Rpb25UeXBlOiBDb2xvckNvbnN0YW50cy5IU0xfVVBEQVRFLFxuICAgICAgaHNsOiBoc2xcbiAgICB9KTtcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbG9yQWN0aW9ucztcbiIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBDb2xvclN0b3JlID0gcmVxdWlyZSgnLi8uLi9zdG9yZXMvQ29sb3JTdG9yZScpO1xudmFyIENvbG9yQWN0aW9ucyA9IHJlcXVpcmUoJy4vLi4vYWN0aW9ucy9Db2xvckFjdGlvbnMnKTtcblxudmFyIEhlYWRlciA9IHJlcXVpcmUoJy4vSGVhZGVyLnJlYWN0Jyk7XG52YXIgQ29sb3JQYW5lID0gcmVxdWlyZSgnLi9jb2xvcnBhbmUvQ29sb3JQYW5lLnJlYWN0Jyk7XG52YXIgU2hhZGVQYW5lID0gcmVxdWlyZSgnLi9jb2xvcnBhbmUvU2hhZGVQYW5lLnJlYWN0Jyk7XG52YXIgRGlzcGxheVBhbmUgPSByZXF1aXJlKCcuL2Rpc3BsYXlwYW5lL0Rpc3BsYXlQYW5lLnJlYWN0Jyk7XG52YXIgQ29udHJvbFBhbmUgPSByZXF1aXJlKCcuL2NvbnRyb2xzL0NvbnRyb2xQYW5lLnJlYWN0Jyk7XG5cbmZ1bmN0aW9uIGdldFN0YXRlKCkge1xuXHRyZXR1cm4ge1xuXHRcdHNhdHVyYXRpb246IENvbG9yU3RvcmUuZ2V0U2F0dXJhdGlvbigpLFxuXHRcdGh1ZTogQ29sb3JTdG9yZS5nZXRIdWUoKSxcblx0XHRsaWdodG5lc3M6IENvbG9yU3RvcmUuZ2V0TGlnaHRuZXNzKCksXG5cdFx0YWxwaGE6IENvbG9yU3RvcmUuZ2V0QWxwaGEoKSxcblx0XHRhbHBoYUVuYWJsZWQ6IENvbG9yU3RvcmUuZ2V0QWxwaGFFbmFibGVkKClcblx0fTtcbn1cblxudmFyIEFwcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJBcHBcIixcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBnZXRTdGF0ZSgpXG5cdH0sXG5cblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdENvbG9yU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuXHR9LFxuXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcblx0XHRDb2xvclN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic2l0ZS13cmFwcGVyXCJ9LCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChIZWFkZXIsIG51bGwpLCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcIm1haW5cIiwge2NsYXNzTmFtZTogXCJzaXRlLW1haW5cIn0sIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwaWNrZXItY29udHJvbHNcIn0sIFxuXHRcdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChDb250cm9sUGFuZSwge1xuXHRcdFx0XHRcdFx0XHRodWU6IHRoaXMuc3RhdGUuaHVlLCBcblx0XHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogdGhpcy5zdGF0ZS5zYXR1cmF0aW9uLCBcblx0XHRcdFx0XHRcdFx0bGlnaHRuZXNzOiB0aGlzLnN0YXRlLmxpZ2h0bmVzcywgXG5cdFx0XHRcdFx0XHRcdGFscGhhOiB0aGlzLnN0YXRlLmFscGhhLCBcblx0XHRcdFx0XHRcdFx0YWxwaGFFbmFibGVkOiB0aGlzLnN0YXRlLmFscGhhRW5hYmxlZH1cblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpLCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicGlja2VyLXdoZWVsXCJ9LCBcblx0XHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwaWNrZXItd2hlZWxfX3dyYXBwZXJcIn0sIFxuXHRcdFx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KENvbG9yUGFuZSwgbnVsbCksIFxuXHRcdFx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFNoYWRlUGFuZSwge1xuXHRcdFx0XHRcdFx0XHRcdGh1ZTogdGhpcy5zdGF0ZS5odWUsIFxuXHRcdFx0XHRcdFx0XHRcdHNhdHVyYXRpb246IHRoaXMuc3RhdGUuc2F0dXJhdGlvbiwgXG5cdFx0XHRcdFx0XHRcdFx0bGlnaHRuZXNzOiB0aGlzLnN0YXRlLmxpZ2h0bmVzc31cblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdCksIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGlzcGxheVBhbmUsIHtcblx0XHRcdFx0XHRcdGh1ZTogdGhpcy5zdGF0ZS5odWUsIFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogdGhpcy5zdGF0ZS5zYXR1cmF0aW9uLCBcblx0XHRcdFx0XHRcdGxpZ2h0bmVzczogdGhpcy5zdGF0ZS5saWdodG5lc3MsIFxuXHRcdFx0XHRcdFx0YWxwaGE6IHRoaXMuc3RhdGUuYWxwaGEsIFxuXHRcdFx0XHRcdFx0YWxwaGFFbmFibGVkOiB0aGlzLnN0YXRlLmFscGhhRW5hYmxlZH1cblx0XHRcdFx0XHQpXG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXG5cdF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZShnZXRTdGF0ZSgpKTtcblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHA7XG5cbjsoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRocm90dGxlID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgb2JqKSB7XG4gICAgICAgIHZhciBvYmogPSBvYmogfHwgd2luZG93O1xuICAgICAgICB2YXIgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICB2YXIgZnVuYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBvYmouZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQobmFtZSkpO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBvYmouYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBmdW5jKTtcbiAgICB9O1xuXG4gICAgLyogaW5pdCAtIHlvdSBjYW4gaW5pdCBhbnkgZXZlbnQgKi9cbiAgICB0aHJvdHRsZShcInJlc2l6ZVwiLCBcIm9wdGltaXplZFJlc2l6ZVwiKTtcbn0pKCk7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIEhlYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJIZWFkZXJcIixcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImhlYWRlclwiLCB7Y2xhc3NOYW1lOiBcInNpdGUtaGVhZGVyXCJ9LCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIHtjbGFzc05hbWU6IFwic2l0ZS1oZWFkZXJfX3RpdGxlXCJ9LCBcIkNvbG9yIHRoaW5nXCIpXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSGVhZGVyOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgQ29sb3JBY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9Db2xvckFjdGlvbnMnKTtcbnZhciBjb2xvclV0aWxzID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvY29sb3JVdGlsJyk7XG52YXIgZG9tVXRpbHMgPSByZXF1aXJlKCcuLi8uLi91dGlscy9kb21VdGlsLmpzJyk7XG52YXIgZ2VuVXRpbHMgPSByZXF1aXJlKCcuLi8uLi91dGlscy9nZW5lcmFsVXRpbC5qcycpO1xuXG52YXIgc2l6ZTtcbnZhciBhY3RpdmUgPSBmYWxzZTtcbnZhciBsYXN0TW92ZSA9IDA7XG52YXIgbW92ZVRocm90dGxlID0gMTtcbnZhciB3cmFwcGVyU3R5bGUgPSB7XG5cdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG59O1xudmFyIG1hcmtlclN0eWxlID0ge1xuXHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcblx0d2lkdGg6ICcycHgnLFxuXHRiYWNrZ3JvdW5kOiAnYmxhY2snLFxuXHRsZWZ0OiAnNTAlJyxcblx0dG9wOiAnMHB4Jyxcblx0bWFyZ2luTGVmdDogJy0xcHgnLFxuXHR0cmFuc2Zvcm1PcmlnaW46ICdib3R0b20gY2VudGVyJyxcblx0Y3Vyc29yOiAncG9pbnRlcidcbn07XG5cbnZhciBDb2xvclBhbmUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQ29sb3JQYW5lXCIsXG5cblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjYW52YXMgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuY29sb3JQYW5lQ2FudmFzKTtcblx0XHR2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdHNpemUgPSBwYXJzZUludChkb21VdGlscy5nZXRTdHlsZSh0aGlzLmdldERPTU5vZGUoKSwgJ3dpZHRoJykpO1xuXHRcdGNhbnZhcy53aWR0aCA9IHNpemU7XG5cdFx0Y2FudmFzLmhlaWdodCA9IHNpemU7XG4gICAgXHR0aGlzLnBhaW50KGNvbnRleHQpO1xuICAgIFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29wdGltaXplZFJlc2l6ZScsIHRoaXMucmVzaXplKTtcblx0fSxcblxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29wdGltaXplZFJlc2l6ZScsIHRoaXMucmVzaXplKTtcblx0fSxcblxuXHRyZXNpemU6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuU2l6ZSA9IHBhcnNlSW50KGRvbVV0aWxzLmdldFN0eWxlKHRoaXMuZ2V0RE9NTm9kZSgpLCAnd2lkdGgnKSk7XG5cdFx0aWYgKHNpemUgIT0gblNpemUpIHtcblx0XHRcdHNpemUgPSBuU2l6ZTtcblx0XHRcdHZhciBjYW52YXMgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuY29sb3JQYW5lQ2FudmFzKTtcblx0XHRcdGNhbnZhcy53aWR0aCA9IHNpemU7XG5cdFx0XHRjYW52YXMuaGVpZ2h0ID0gc2l6ZTtcblx0XHRcdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdCAgICBcdHRoaXMucGFpbnQoY29udGV4dCk7XG5cdFx0fVxuXHR9LFxuXG5cdHBhaW50OiBmdW5jdGlvbihjb250ZXh0KSB7XG5cdFx0dmFyIGJpdG1hcCA9IGNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsMCxzaXplLHNpemUpO1xuXHRcdHZhciB2YWx1ZSA9IDE7XG4gICAgICAgIHZhciBzYXR1cmF0aW9uID0gMTtcblxuXHRcdGZvciAodmFyIHkgPSAwOyB5IDwgc2l6ZTsgeSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHNpemU7IHgrKykge1xuICAgICAgICAgICAgICAgIC8vIG9mZnNldCBmb3IgdGhlIDQgUkdCQSB2YWx1ZXMgaW4gdGhlIGRhdGEgYXJyYXlcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gNCAqICgoeSAqIHNpemUpICsgeCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgaHVlID0gMTgwICsgTWF0aC5hdGFuMih5IC0gc2l6ZS8yLCB4IC0gc2l6ZS8yKSAqICgxODAgLyBNYXRoLlBJKTtcblxuICAgICAgICAgICAgICAgIHZhciBoc3YgPSBjb2xvclV0aWxzLmhzdjJyZ2IoaHVlLCBzYXR1cmF0aW9uLCB2YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBmaWxsIFJHQkEgdmFsdWVzXG4gICAgICAgICAgICAgICAgYml0bWFwLmRhdGFbb2Zmc2V0ICsgMF0gPSBoc3ZbMF07XG4gICAgICAgICAgICAgICAgYml0bWFwLmRhdGFbb2Zmc2V0ICsgMV0gPSBoc3ZbMV07XG4gICAgICAgICAgICAgICAgYml0bWFwLmRhdGFbb2Zmc2V0ICsgMl0gPSBoc3ZbMl07XG4gICAgICAgICAgICAgICAgYml0bWFwLmRhdGFbb2Zmc2V0ICsgM10gPSAyNTU7IC8vIG5vIHRyYW5zcGFyZW5jeVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0LnB1dEltYWdlRGF0YShiaXRtYXAsIDAsIDApO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xuXHRcdFx0XHRjbGFzc05hbWU6IFwiY29sb3ItcGFuZVwiLCBcblx0XHRcdFx0c3R5bGU6IHdyYXBwZXJTdHlsZSwgXG5cdFx0XHRcdG9uTW91c2VNb3ZlOiB0aGlzLl9oYW5kbGVNb3VzZU1vdmV9LCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiLCB7XG5cdFx0XHRcdFx0aWQ6IFwicGlja2VyXCIsIFxuXHRcdFx0XHRcdGNsYXNzTmFtZTogXCJjb2xvci1wYW5lX19jYW52YXNcIiwgXG5cdFx0XHRcdFx0b25Nb3VzZURvd246IHRoaXMuX2hhbmRsZU1vdXNlRG93biwgXG5cdFx0XHRcdFx0b25Nb3VzZUxlYXZlOiB0aGlzLl9oYW5kbGVNb3VzZUxlYXZlLCBcblx0XHRcdFx0XHRyZWY6IFwiY29sb3JQYW5lQ2FudmFzXCJ9XG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXG5cdF9oYW5kbGVNb3VzZURvd246IGZ1bmN0aW9uKGRvd25fZXZlbnQpIHtcblx0XHRhY3RpdmUgPSB0cnVlO1xuXHRcdHRoaXMuX3NldENvbG9yKGRvd25fZXZlbnQpO1xuXHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdHZhciBtb3VzZU1vdmUgPSBmdW5jdGlvbihtb3ZlX2V2ZW50KSB7XG5cdFx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZU1vdmUpO1xuXHRcdFx0dGhhdC5fc2V0Q29sb3IobW92ZV9ldmVudCk7XG5cdFx0fTtcblx0XHR2YXIgbW91c2VVcCA9IGZ1bmN0aW9uKHVwX2V2ZW50KSB7XG5cdFx0XHRhY3RpdmUgPSBmYWxzZTtcblx0XHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXApO1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZU1vdmUpO1xuXHRcdFx0dGhhdC5fc2V0Q29sb3IodXBfZXZlbnQpO1xuXHRcdH07XG5cdFx0ZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcCk7XG5cdFx0ZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZU1vdmUpO1xuXHR9LFxuXG5cdF9oYW5kbGVNb3VzZUxlYXZlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmIChhY3RpdmUpIHtcblx0XHRcdHRoaXMuX3NldENvbG9yKGV2ZW50KTtcblx0XHR9XG5cdH0sXG5cblx0X2hhbmRsZU1vdXNlTW92ZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgIFx0aWYgKG5vdyA+IGxhc3RNb3ZlICsgbW92ZVRocm90dGxlICYmIGFjdGl2ZSkge1xuICAgICAgXHRcdGxhc3RNb3ZlID0gbm93O1xuICAgICAgXHRcdHRoaXMuX3NldENvbG9yKGV2ZW50KTtcbiAgICAgIFx0fVxuXHR9LFxuXG5cdF9zZXRDb2xvcjogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgcG9zID0gZG9tVXRpbHMub2Zmc2V0KHRoaXMuZ2V0RE9NTm9kZSgpKTtcblx0XHR2YXIgeCA9IGV2ZW50LnBhZ2VYIC0gcG9zLmxlZnQ7XG5cdFx0dmFyIHkgPSBldmVudC5wYWdlWSAtIHBvcy50b3A7XG5cdFx0dmFyIGh1ZSA9IDE4MCArIE1hdGguYXRhbjIoeSAtIHNpemUvMiwgeCAtIHNpemUvMikgKiAoMTgwIC8gTWF0aC5QSSk7XG5cdFx0Q29sb3JBY3Rpb25zLnVwZGF0ZUh1ZSgraHVlLnRvRml4ZWQoMikpO1xuXHR9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbG9yUGFuZTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGNvbG9yVXRpbHMgPSByZXF1aXJlKCcuLi8uLi91dGlscy9jb2xvclV0aWwnKTtcbnZhciBkb21VdGlscyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2RvbVV0aWwuanMnKTtcbnZhciBnZW5VdGlscyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2dlbmVyYWxVdGlsLmpzJyk7XG52YXIgQ29sb3JBY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9Db2xvckFjdGlvbnMnKTtcblxudmFyIHNpemU7XG52YXIgcGFkZGluZyA9IDEwO1xudmFyIGFjdGl2ZSA9IGZhbHNlO1xudmFyIGxhc3RNb3ZlID0gMDtcbnZhciBtb3ZlVGhyb3R0bGUgPSAxO1xudmFyIHBhaW50aW5nID0gZmFsc2U7XG52YXIgbGFzdEh1ZTtcbnZhciB3cmFwcGVyU3R5bGUgPSB7XG5cdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuXHRwYWRkaW5nOiBwYWRkaW5nICsgJ3B4Jyxcblx0Ym94U2l6aW5nOiAnY29udGVudC1ib3gnLFxuXHRib3JkZXJSYWRpdXM6ICc1MCUnXG59O1xudmFyIG1vdXNlRG93biA9IGZhbHNlO1xudmFyIG1vdXNlRG93bkxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0aWYgKGV2ZW50LnRhcmdldC5jbGFzc05hbWUuaW5kZXhPZignY29sb3ItcGFuZV9fY2FudmFzJykgPj0gMCkge1xuXHRcdG1vdXNlRG93biA9IHRydWU7XG5cdH1cbn07XG52YXIgbW9zdWVVcExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0bW91c2VEb3duID0gZmFsc2U7XG59O1xuXG52YXIgRGlzcGxheVBhbmUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiRGlzcGxheVBhbmVcIixcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRodWU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRzYXR1cmF0aW9uOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0bGlnaHRuZXNzOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcblx0fSxcblxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG5cdFx0c2l6ZSA9IHBhcnNlSW50KGRvbVV0aWxzLmdldFN0eWxlKHRoaXMuZ2V0RE9NTm9kZSgpLCAnd2lkdGgnKSkrMjtcblx0XHR2YXIgY2FudmFzID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLnNoYWRlUGFuZUNhbnZhcyk7XG5cdFx0Y2FudmFzLndpZHRoID0gc2l6ZTtcblx0XHRjYW52YXMuaGVpZ2h0ID0gc2l6ZTtcblx0XHR2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIFx0dGhpcy5wYWludChjb250ZXh0KTtcbiAgICBcdGxhc3RIdWUgPSB0aGlzLnByb3BzLmh1ZTtcblxuICAgIFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29wdGltaXplZFJlc2l6ZScsIHRoaXMucmVzaXplKVxuICAgIFx0ZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBtb3VzZURvd25MaXN0ZW5lcik7XG4gICAgXHRkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3N1ZVVwTGlzdGVuZXIpO1xuXHR9LFxuXG5cdGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24ocHJldlByb3BzKSB7XG5cdFx0aWYgKCFtb3VzZURvd24gJiYgbGFzdEh1ZSAhPSB0aGlzLnByb3BzLmh1ZSkge1xuXHRcdFx0bGFzdEh1ZSA9IHRoaXMucHJvcHMuaHVlO1xuXHRcdFx0dmFyIGNvbnRleHQgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuc2hhZGVQYW5lQ2FudmFzKS5nZXRDb250ZXh0KCcyZCcpO1xuICAgIFx0XHR0aGlzLnBhaW50KGNvbnRleHQpO1xuXHRcdH1cblx0fSxcblxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29wdGltaXplZFJlc2l6ZScsIHRoaXMucmVzaXplKTtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBtb3VzZURvd25MaXN0ZW5lcik7XG4gICAgXHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW9zdWVVcExpc3RlbmVyKTtcblx0fSxcblxuXHRyZXNpemU6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuU2l6ZSA9IHBhcnNlSW50KGRvbVV0aWxzLmdldFN0eWxlKHRoaXMuZ2V0RE9NTm9kZSgpLCAnd2lkdGgnKSkrMTtcblx0XHRpZiAoc2l6ZSAhPSBuU2l6ZSkge1xuXHRcdFx0c2l6ZSA9IG5TaXplO1xuXHRcdFx0dmFyIGNhbnZhcyA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5zaGFkZVBhbmVDYW52YXMpO1xuXHRcdFx0Y2FudmFzLndpZHRoID0gc2l6ZTtcblx0XHRcdGNhbnZhcy5oZWlnaHQgPSBzaXplO1xuXHRcdFx0dmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0ICAgIFx0dGhpcy5wYWludChjb250ZXh0KTtcblx0XHR9XG5cdH0sXG5cblx0cGFpbnQ6IGZ1bmN0aW9uKGNvbnRleHQpIHtcblx0XHRpZiAoIXBhaW50aW5nKSB7XG5cdFx0XHR2YXIgYml0bWFwID0gY29udGV4dC5nZXRJbWFnZURhdGEoMCwwLHNpemUsc2l6ZSk7XG5cdFx0XHR2YXIgciA9IHNpemUvMjtcblxuXHRcdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCBzaXplOyB5KyspIHtcblx0XHRcdFx0dmFyIGMxID0geSp5IC0gMip5KnIgKyByKnI7XG5cdFx0XHRcdHZhciB4MSA9ICgyKnIgLSBNYXRoLnNxcnQoNCpyKnItNCpjMSkpLzI7XG5cdFx0XHRcdHZhciB4MiA9ICgyKnIgKyBNYXRoLnNxcnQoNCpyKnItNCpjMSkpLzI7XG5cblx0ICAgIFx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHNpemU7IHgrKykge1xuXG5cdCAgICBcdFx0XHRpZiAoTWF0aC5zcXJ0KCh4LXIpKih4LXIpICsgKHktcikqKHktcikpID4gcikge1xuXHQgICAgXHRcdFx0XHRoc3YgPSBbMjU1LDI1NSwyNTVdO1xuXHQgICAgXHRcdFx0fSBlbHNlIHtcblx0ICAgIFx0XHRcdFx0dmFyIGMyID0gKCB4KnggLSAyKngqciArIHIqcik7XG5cdFx0ICAgIFx0XHRcdHZhciB5MSA9ICgyKnIgLSBNYXRoLnNxcnQoNCpyKnItNCpjMikpLzI7XG5cdFx0XHRcdFx0XHR2YXIgeTIgPSAoMipyICsgTWF0aC5zcXJ0KDQqcipyLTQqYzIpKS8yO1xuXG5cdFx0ICAgIFx0XHRcdHZhciBvZmZzZXQgPSA0ICogKCh5ICogKHNpemUpKSArIHgpO1xuXG5cdFx0ICAgIFx0XHRcdHZhciBodWUgPSB0aGlzLnByb3BzLmh1ZTtcblx0XHQgICAgXHRcdFx0dmFyIHNhdHVyYXRpb24gPSAoeS15MSkgLyAoeTIteTEpO1xuXHRcdCAgICBcdFx0XHR2YXIgbGlnaHRuZXNzID0gKHgteDEpIC8gKHgyLXgxKTtcblx0ICAgIFx0XHRcdFx0dmFyIGhzdiA9IGNvbG9yVXRpbHMuaHNsMnJnYihodWUsIHNhdHVyYXRpb24sIGxpZ2h0bmVzcyk7XG5cdCAgICBcdFx0XHR9XG5cblx0ICAgIFx0XHRcdGJpdG1hcC5kYXRhW29mZnNldCArIDBdID0gaHN2WzBdO1xuXHQgICAgICAgICAgICAgICAgYml0bWFwLmRhdGFbb2Zmc2V0ICsgMV0gPSBoc3ZbMV07XG5cdCAgICAgICAgICAgICAgICBiaXRtYXAuZGF0YVtvZmZzZXQgKyAyXSA9IGhzdlsyXTtcblx0ICAgICAgICAgICAgICAgIGJpdG1hcC5kYXRhW29mZnNldCArIDNdID0gMjU1OyAvLyBubyB0cmFuc3BhcmVuY3lcblxuXHQgICAgXHRcdFxuXHQgICAgICAgICAgIH1cblx0ICAgICAgIH1cblx0ICAgICAgICBjb250ZXh0LnB1dEltYWdlRGF0YShiaXRtYXAsIDAsIDApO1xuXHQgICAgICAgIHBhaW50aW5nID0gZmFsc2U7XG5cdCAgICB9XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XG5cdFx0XHRcdGNsYXNzTmFtZTogXCJzaGFkZS1wYW5lXCIsIFxuXHRcdFx0XHRzdHlsZTogd3JhcHBlclN0eWxlLCBcblx0XHRcdFx0b25Nb3VzZU1vdmU6IHRoaXMuX2hhbmRsZU1vdXNlTW92ZX0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic2hhZGUtcGFuZV9fd2luZG93XCJ9LCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIsIHtcblx0XHRcdFx0XHRcdGlkOiBcInNoYWRlXCIsIFxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lOiBcInNoYWRlLXBhbmVfX2NhbnZhc1wiLCBcblx0XHRcdFx0XHRcdHJlZjogXCJzaGFkZVBhbmVDYW52YXNcIiwgXG5cdFx0XHRcdFx0XHRvbk1vdXNlRG93bjogdGhpcy5faGFuZGxlTW91c2VEb3duLCBcblx0XHRcdFx0XHRcdG9uTW91c2VMZWF2ZTogdGhpcy5faGFuZGVNb3VzZUxlYXZlfVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cblx0X2hhbmRsZU1vdXNlRG93bjogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRhY3RpdmUgPSB0cnVlO1xuXHRcdHRoaXMuX3NldFNoYWRlKGV2ZW50KTtcblx0XHR2YXIgbW91c2VVcCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0YWN0aXZlID0gZmFsc2U7XG5cdFx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwKTtcblx0XHR9O1xuXHRcdGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXApO1xuXHR9LFxuXG5cdF9oYW5kbGVNb3VzZUxlYXZlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmIChhY3RpdmUpIHtcblx0XHRcdHRoaXMuX3NldFNoYWRlKGV2ZW50KTtcblx0XHR9XG5cdH0sXG5cblx0X2hhbmRsZU1vdXNlTW92ZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgIFx0aWYgKG5vdyA+IGxhc3RNb3ZlICsgbW92ZVRocm90dGxlICYmIGFjdGl2ZSkge1xuICAgICAgXHRcdGxhc3RNb3ZlID0gbm93O1xuICAgICAgXHRcdHRoaXMuX3NldFNoYWRlKGV2ZW50KTtcbiAgICAgIFx0fVxuXHR9LFxuXG5cdF9zZXRTaGFkZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgcG9zID0gZG9tVXRpbHMub2Zmc2V0KFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5zaGFkZVBhbmVDYW52YXMpKSxcblx0XHRcdHggPSBldmVudC5wYWdlWCAtIHBvcy5sZWZ0LFxuXHRcdFx0eSA9IGV2ZW50LnBhZ2VZIC0gcG9zLnRvcCxcblx0XHRcdHIgPSBzaXplLzI7XG5cblx0XHRpZiAoTWF0aC5zcXJ0KE1hdGgucG93KHgtciwyKSArIE1hdGgucG93KHktciwyKSkgPiByKXtcblx0XHRcdGlmIChNYXRoLnNxcnQoTWF0aC5wb3coeC1yLDIpICsgTWF0aC5wb3coeS1yLDIpKSA+IHIrcGFkZGluZykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR2YXIgbSA9ICh5LXIpLyh4LXIpLFxuXHRcdFx0XHRub3JtID0gTWF0aC5zcXJ0KDEgKyBtKm0pLFxuXHRcdFx0XHRzaWduID0geCA8IHIgPyAtMSA6IDE7XG5cblx0XHRcdHggPSByICsgc2lnbiooci9ub3JtKTtcblx0XHRcdHkgPSByICsgc2lnbioociptL25vcm0pO1xuXHRcdH1cblxuXHRcdHZhciBjMSA9IHkqeSAtIDIqeSpyICsgcipyLFxuXHRcdFx0eDEgPSAoMipyIC0gTWF0aC5zcXJ0KDQqcipyLTQqYzEpKS8yLFxuXHRcdFx0eDIgPSAoMipyICsgTWF0aC5zcXJ0KDQqcipyLTQqYzEpKS8yLFxuXHRcdFx0YzIgPSAoIHgqeCAtIDIqeCpyICsgcipyKSxcblx0XHRcdHkxID0gKDIqciAtIE1hdGguc3FydCg0KnIqci00KmMyKSkvMixcblx0XHRcdHkyID0gKDIqciArIE1hdGguc3FydCg0KnIqci00KmMyKSkvMjtcblxuXHRcdHZhciBzYXR1cmF0aW9uID0gKHkteTEpIC8gKHkyLXkxKTtcblx0XHR2YXIgbGlnaHRuZXNzID0gKHgteDEpIC8gKHgyLXgxKTtcblx0XHRDb2xvckFjdGlvbnMudXBkYXRlU2F0dXJhdGlvbigrc2F0dXJhdGlvbi50b0ZpeGVkKDIpKTtcblx0XHRDb2xvckFjdGlvbnMudXBkYXRlTGlnaHRuZXNzKCtsaWdodG5lc3MudG9GaXhlZCgyKSk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BsYXlQYW5lOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgSHNsRGlzcGxheSA9IHJlcXVpcmUoJy4vSHNsRGlzcGxheS5yZWFjdCcpO1xudmFyIFJnYkRpc3BsYXk9IHJlcXVpcmUoJy4vUmdiRGlzcGxheS5yZWFjdCcpO1xudmFyIEhleERpc3BsYXkgPSByZXF1aXJlKCcuL0hleERpc3BsYXkucmVhY3QnKTtcbnZhciBUcmFuc3BhcmVuY3lJbnB1dCA9IHJlcXVpcmUoJy4vVHJhbnNwYXJlbmN5SW5wdXQucmVhY3QnKTtcbnZhciBjb2xvclV0aWwgPSByZXF1aXJlKCcuLi8uLi91dGlscy9jb2xvclV0aWwnKTtcblxudmFyIHN0eWxlID0ge1xuXHRiYWNrZ3JvdW5kQ29sb3I6ICcnXG59XG5cbnZhciBDb250cm9sUGFuZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJDb250cm9sUGFuZVwiLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGh1ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdHNhdHVyYXRpb246IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRsaWdodG5lc3M6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRhbHBoYTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdGFscGhhRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZFxuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0c3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyMnICsgY29sb3JVdGlsLmhzbDJoZXgodGhpcy5wcm9wcy5odWUsIHRoaXMucHJvcHMuc2F0dXJhdGlvbiwgdGhpcy5wcm9wcy5saWdodG5lc3MpO1xuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtzdHlsZTogc3R5bGUsIGNsYXNzTmFtZTogXCJwaWNrZXItaW5wdXRzXCJ9LCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBpY2tlci1pbnB1dHNfX2lubmVyXCJ9LCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KEhzbERpc3BsYXksIHtjb2xvcjogW3RoaXMucHJvcHMuaHVlLCB0aGlzLnByb3BzLnNhdHVyYXRpb24sIHRoaXMucHJvcHMubGlnaHRuZXNzXX0pLCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFJnYkRpc3BsYXksIHtjb2xvcjogW3RoaXMucHJvcHMuaHVlLCB0aGlzLnByb3BzLnNhdHVyYXRpb24sIHRoaXMucHJvcHMubGlnaHRuZXNzXSwgYWxwaGE6IHRoaXMucHJvcHMuYWxwaGEsIGFscGhhRW5hYmxlZDogdGhpcy5wcm9wcy5hbHBoYUVuYWJsZWR9KSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChIZXhEaXNwbGF5LCB7Y29sb3I6IFt0aGlzLnByb3BzLmh1ZSwgdGhpcy5wcm9wcy5zYXR1cmF0aW9uLCB0aGlzLnByb3BzLmxpZ2h0bmVzc119KSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChUcmFuc3BhcmVuY3lJbnB1dCwge2hhc1RyYW5zcGFyZW5jeTogdGhpcy5wcm9wcy5hbHBoYUVuYWJsZWQsIGFscGhhOiB0aGlzLnByb3BzLmFscGhhfSlcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cdH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbFBhbmU7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgQ29sb3JBY3Rpb25zID0gcmVxdWlyZSgnLi8uLi8uLi9hY3Rpb25zL0NvbG9yQWN0aW9ucycpO1xudmFyIGNvbG9yVXRpbHMgPSByZXF1aXJlKCcuLy4uLy4uL3V0aWxzL2NvbG9yVXRpbCcpO1xudmFyIEhleElucHV0ID0gcmVxdWlyZSgnLi9IZXhJbnB1dC5yZWFjdCcpO1xuXG5cbnZhciBIZXhEaXNwbGF5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkhleERpc3BsYXlcIixcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRjb2xvcjogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm51bWJlcikuaXNSZXF1aXJlZFxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGlzRWRpdGluZzogZmFsc2Vcblx0XHR9O1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGhleCA9IGNvbG9yVXRpbHMuaHNsMmhleCh0aGlzLnByb3BzLmNvbG9yWzBdLCB0aGlzLnByb3BzLmNvbG9yWzFdLCB0aGlzLnByb3BzLmNvbG9yWzJdKTtcblx0XHR2YXIgaW5wdXQ7XG5cblx0XHRpZiAodGhpcy5zdGF0ZS5pc0VkaXRpbmcpIHtcblx0XHRcdGlucHV0ID0gXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoSGV4SW5wdXQsIHtcblx0XHRcdFx0XHRvblNhdmU6IHRoaXMuX29uU2F2ZSwgXG5cdFx0XHRcdFx0aGV4OiBoZXh9XG5cdFx0XHRcdCk7XG5cdFx0fVxuXHRcdC8vXG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xuXHRcdFx0XHRjbGFzc05hbWU6IGNsYXNzTmFtZXMoJ2NvbG9yLWlucHV0Jywge1xuXHRcdFx0XHRcdCdlZGl0aW5nJzogdGhpcy5zdGF0ZS5pc0VkaXRpbmdcblx0XHRcdFx0fSl9LCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7b25Eb3VibGVDbGljazogdGhpcy5fb25Eb3VibGVDbGlja30sIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb2xvci1pbnB1dF9fbGFiZWxcIn0sIFwiSGV4XCIpLCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29sb3ItaW5wdXRfX2Rpc3BsYXlcIn0sIFwiI1wiLCBoZXggKVxuXHRcdFx0XHQpLCBcblx0XHRcdFx0aW5wdXRcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXG5cdF9vbkRvdWJsZUNsaWNrOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtpc0VkaXRpbmc6IHRydWV9KTtcblx0fSxcblxuXHRfb25TYXZlOiBmdW5jdGlvbihoZXgsIGtlZXBPcGVuKSB7XG5cdFx0Q29sb3JBY3Rpb25zLnVwZGF0ZUhleChoZXgpO1xuXHRcdGlmICgha2VlcE9wZW4pe1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7aXNFZGl0aW5nOiBmYWxzZX0pO1xuXHRcdH1cblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBIZXhEaXNwbGF5OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgY29sb3JVdGlsID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvY29sb3JVdGlsJyk7XG5cbnZhciBIZXhJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJIZXhJbnB1dFwiLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdG9uU2F2ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblx0XHRoZXg6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB0aGlzLnByb3BzLmhleCB8fCAnJ1xuXHRcdH07XG5cdH0sXG5cblx0Y29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbihwcmV2UHJvcHMpIHtcblx0XHRpZiAocHJldlByb3BzLmhleCAhPSB0aGlzLnByb3BzLmhleCkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdHZhbHVlOiB0aGlzLnByb3BzLmhleFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XG5cdFx0XHRcdHZhbHVlOiB0aGlzLnN0YXRlLnZhbHVlLCBcblx0XHRcdFx0b25LZXlEb3duOiB0aGlzLl9oYW5kbGVLZXlEb3duLCBcblx0XHRcdFx0b25DaGFuZ2U6IHRoaXMuX29uQ2hhbmdlfVxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cdC8vY29tbWVudFxuXHRfaGFuZGxlS2V5RG93bjogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcblx0XHRcdHRoaXMuX3NhdmUoKTtcblx0XHR9XG5cdH0sXG5cblx0X29uQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0dmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZVxuXHRcdH0sIHRoaXMuX2NoYW5nZUNhbGxiYWNrKTtcblx0fSxcblxuXHRfY2hhbmdlQ2FsbGJhY2s6IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKGNvbG9yVXRpbC5oZXgyaHNsKHRoaXMuc3RhdGUudmFsdWUpKXtcblx0XHRcdHRoaXMucHJvcHMub25TYXZlKHRoaXMuc3RhdGUudmFsdWUsIHRydWUpO1xuXHRcdH1cblx0fSxcblxuXHRfc2F2ZTogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKGNvbG9yVXRpbC5oZXgyaHNsKHRoaXMuc3RhdGUudmFsdWUpKXtcblx0XHRcdHRoaXMucHJvcHMub25TYXZlKHRoaXMuc3RhdGUudmFsdWUpO1xuXHRcdH1cblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSGV4SW5wdXQ7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgQ29sb3JBY3Rpb25zID0gcmVxdWlyZSgnLi8uLi8uLi9hY3Rpb25zL0NvbG9yQWN0aW9ucycpO1xudmFyIEhzbElucHV0ID0gcmVxdWlyZSgnLi9Ic2xJbnB1dC5yZWFjdCcpO1xudmFyIGdVdGlsID0gcmVxdWlyZSgnLi8uLi8uLi91dGlscy9nZW5lcmFsVXRpbCcpO1xuXG52YXIgSHNsRGlzcGxheSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJIc2xEaXNwbGF5XCIsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5udW1iZXIpLmlzUmVxdWlyZWRcblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRpc0VkaXRpbmc6IGZhbHNlXG5cdFx0fTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBoc2wgPSB0aGlzLnByb3BzLmNvbG9yXG5cdFx0dmFyIGlucHV0O1xuXG5cdFx0aWYgKHRoaXMuc3RhdGUuaXNFZGl0aW5nKSB7XG5cdFx0XHRpbnB1dCA9XG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoSHNsSW5wdXQsIHtcblx0XHRcdFx0XHRvblNhdmU6IHRoaXMuX29uU2F2ZSwgXG5cdFx0XHRcdFx0aDogZ1V0aWwucm91bmQoaHNsWzBdKSwgXG5cdFx0XHRcdFx0czogZ1V0aWwucm91bmQoaHNsWzFdKSwgXG5cdFx0XHRcdFx0bDogZ1V0aWwucm91bmQoaHNsWzJdKX1cblx0XHRcdFx0KTtcblx0XHR9XG5cdFx0Ly9cblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBjbGFzc05hbWVzKCdjb2xvci1pbnB1dCcsIHtcblx0XHRcdFx0J2VkaXRpbmcnOiB0aGlzLnN0YXRlLmlzRWRpdGluZ1xuXHRcdFx0XHR9KX0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtvbkRvdWJsZUNsaWNrOiB0aGlzLl9vbkRvdWJsZUNsaWNrfSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbG9yLWlucHV0X19sYWJlbFwifSwgXCJIU0xcIiksIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb2xvci1pbnB1dF9fZGlzcGxheVwifSwgZ1V0aWwucm91bmQoaHNsWzBdKSwgXCIsIFwiLCBnVXRpbC5yb3VuZChoc2xbMV0pLCBcIiwgXCIsIGdVdGlsLnJvdW5kKGhzbFsyXSkpXG5cdFx0XHRcdCksIFxuXHRcdFx0XHRpbnB1dFxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cblx0X29uRG91YmxlQ2xpY2s6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe2lzRWRpdGluZzogdHJ1ZX0pO1xuXHR9LFxuXG5cdF9vblNhdmU6IGZ1bmN0aW9uKGhzbCwga2VlcE9wZW4pIHtcblx0XHRDb2xvckFjdGlvbnMudXBkYXRlSHNsKGhzbCk7XG5cdFx0aWYgKCFrZWVwT3Blbil7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtpc0VkaXRpbmc6IGZhbHNlfSk7XG5cdFx0fVxuXHR9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhzbERpc3BsYXk7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIEhzbElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkhzbElucHV0XCIsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0b25TYXZlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXHRcdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRzOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0bDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0aDogdGhpcy5wcm9wcy5oIHx8IDAsXG5cdFx0XHRzOiB0aGlzLnByb3BzLnMgfHwgMCxcblx0XHRcdGw6IHRoaXMucHJvcHMubCB8fCAwXG5cdFx0fTtcblx0fSxcblxuXHRjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKHByZXZQcm9wcykge1xuXHRcdGlmIChwcmV2UHJvcHMuaCAhPSB0aGlzLnByb3BzLmggfHwgcHJldlByb3BzLnMgIT0gdGhpcy5wcm9wcy5zIHx8IHByZXZQcm9wcy5sICE9IHRoaXMucHJvcHMubCkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGg6IHRoaXMucHJvcHMuaCxcblx0XHRcdFx0czogdGhpcy5wcm9wcy5zLFxuXHRcdFx0XHRsOiB0aGlzLnByb3BzLmxcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiaHNsLWlucHV0XCJ9LCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0XHRcdFx0XHRtaW46IFwiMFwiLCBcblx0XHRcdFx0XHRtYXg6IFwiMzYwXCIsIFxuXHRcdFx0XHRcdHR5cGU6IFwibnVtYmVyXCIsIFxuXHRcdFx0XHRcdHZhbHVlOiB0aGlzLnN0YXRlLmgsIFxuXHRcdFx0XHRcdG9uS2V5RG93bjogdGhpcy5faGFuZGxlS2V5RG93biwgXG5cdFx0XHRcdFx0b25DaGFuZ2U6IHRoaXMuX29uQ2hhbmdlLCBcblx0XHRcdFx0XHRyZWY6IFwiaElucHV0XCJ9XG5cdFx0XHRcdCksIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge1xuXHRcdFx0XHRcdG1pbjogXCIwXCIsIFxuXHRcdFx0XHRcdG1heDogXCIxXCIsIFxuXHRcdFx0XHRcdHN0ZXA6IFwiLjFcIiwgXG5cdFx0XHRcdFx0dHlwZTogXCJudW1iZXJcIiwgXG5cdFx0XHRcdFx0dmFsdWU6IHRoaXMuc3RhdGUucywgXG5cdFx0XHRcdFx0b25LZXlEb3duOiB0aGlzLl9oYW5kbGVLZXlEb3duLCBcblx0XHRcdFx0XHRvbkNoYW5nZTogdGhpcy5fb25DaGFuZ2UsIFxuXHRcdFx0XHRcdHJlZjogXCJzSW5wdXRcIn1cblx0XHRcdFx0KSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XG5cdFx0XHRcdFx0bWluOiBcIjBcIiwgXG5cdFx0XHRcdFx0bWF4OiBcIjFcIiwgXG5cdFx0XHRcdFx0c3RlcDogXCIuMVwiLCBcblx0XHRcdFx0XHR0eXBlOiBcIm51bWJlclwiLCBcblx0XHRcdFx0XHR2YWx1ZTogdGhpcy5zdGF0ZS5sLCBcblx0XHRcdFx0XHRvbktleURvd246IHRoaXMuX2hhbmRsZUtleURvd24sIFxuXHRcdFx0XHRcdG9uQ2hhbmdlOiB0aGlzLl9vbkNoYW5nZSwgXG5cdFx0XHRcdFx0cmVmOiBcImxJbnB1dFwifVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblx0Ly9jb21tZW50XG5cdF9oYW5kbGVLZXlEb3duOiBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuXHRcdFx0dGhpcy5fc2F2ZSgpO1xuXHRcdH1cblx0fSxcblxuXHRfb25DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRoOiBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuaElucHV0KS52YWx1ZUFzTnVtYmVyLFxuXHRcdFx0czogUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLnNJbnB1dCkudmFsdWVBc051bWJlcixcblx0XHRcdGw6IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5sSW5wdXQpLnZhbHVlQXNOdW1iZXJcblx0XHR9LCB0aGlzLl9zYXZlLmJpbmQodGhpcywgdHJ1ZSkpO1xuXHR9LFxuXG5cdF9zYXZlOiBmdW5jdGlvbihrZWVwT3Blbikge1xuXHRcdHRoaXMucHJvcHMub25TYXZlKFtcblx0XHRcdE1hdGgubWluKE1hdGgubWF4KHRoaXMuc3RhdGUuaCwgMCksIDM2MCksXG5cdFx0XHRNYXRoLm1pbihNYXRoLm1heCh0aGlzLnN0YXRlLnMsIDApLCAxKSxcblx0XHRcdE1hdGgubWluKE1hdGgubWF4KHRoaXMuc3RhdGUubCwgMCksIDEpXG5cdFx0XSwga2VlcE9wZW4pO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBIc2xJbnB1dDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbnZhciBDb2xvckFjdGlvbnMgPSByZXF1aXJlKCcuLy4uLy4uL2FjdGlvbnMvQ29sb3JBY3Rpb25zJyk7XG52YXIgY29sb3JVdGlscyA9IHJlcXVpcmUoJy4vLi4vLi4vdXRpbHMvY29sb3JVdGlsJyk7XG52YXIgZ1V0aWwgPSByZXF1aXJlKCcuLy4uLy4uL3V0aWxzL2dlbmVyYWxVdGlsJyk7XG52YXIgUmdiSW5wdXQgPSByZXF1aXJlKCcuL1JnYklucHV0LnJlYWN0Jyk7XG5cbnZhciBSZ2JEaXNwbGF5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlJnYkRpc3BsYXlcIixcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRjb2xvcjogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm51bWJlcikuaXNSZXF1aXJlZCxcblx0XHRhbHBoYTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdGFscGhhRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZFxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGlzRWRpdGluZzogZmFsc2Vcblx0XHR9O1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHJnYiA9IGNvbG9yVXRpbHMuaHNsMnJnYih0aGlzLnByb3BzLmNvbG9yWzBdLCB0aGlzLnByb3BzLmNvbG9yWzFdLCB0aGlzLnByb3BzLmNvbG9yWzJdKTtcblx0XHR2YXIgaW5wdXQ7XG5cblx0XHRpZiAodGhpcy5zdGF0ZS5pc0VkaXRpbmcpIHtcblx0XHRcdGlucHV0ID1cblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChSZ2JJbnB1dCwge1xuXHRcdFx0XHRcdG9uU2F2ZTogdGhpcy5fb25TYXZlLCBcblx0XHRcdFx0XHRyOiBnVXRpbC5yb3VuZChyZ2JbMF0pLCBcblx0XHRcdFx0XHRnOiBnVXRpbC5yb3VuZChyZ2JbMV0pLCBcblx0XHRcdFx0XHRiOiBnVXRpbC5yb3VuZChyZ2JbMl0pLCBcblx0XHRcdFx0XHRhbHBoYTogdGhpcy5wcm9wcy5hbHBoYSwgXG5cdFx0XHRcdFx0YWxwaGFFbmFibGVkOiB0aGlzLnByb3BzLmFscGhhRW5hYmxlZH1cblx0XHRcdFx0KTtcblx0XHR9XG5cdFx0Ly9cblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBjbGFzc05hbWVzKCdjb2xvci1pbnB1dCcsIHtcblx0XHRcdFx0J2VkaXRpbmcnOiB0aGlzLnN0YXRlLmlzRWRpdGluZ1xuXHRcdFx0XHR9KX0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtvbkRvdWJsZUNsaWNrOiB0aGlzLl9vbkRvdWJsZUNsaWNrfSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbG9yLWlucHV0X19sYWJlbFwifSwgXCJSR0JcIiwgdGhpcy5wcm9wcy5hbHBoYUVuYWJsZWQgPyAnYScgOiAnJyksIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb2xvci1pbnB1dF9fZGlzcGxheVwifSwgXG5cdFx0XHRcdFx0XHRnVXRpbC5yb3VuZChyZ2JbMF0pLCBcIiwgXCIsIGdVdGlsLnJvdW5kKHJnYlsxXSksIFwiLCBcIiwgZ1V0aWwucm91bmQocmdiWzJdKSwgdGhpcy5wcm9wcy5hbHBoYUVuYWJsZWQgPyAnLCAnK3RoaXMucHJvcHMuYWxwaGEgOiAnJ1xuXHRcdFx0XHRcdClcblx0XHRcdFx0KSwgXG5cdFx0XHRcdGlucHV0XG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblxuXHRfb25Eb3VibGVDbGljazogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7aXNFZGl0aW5nOiB0cnVlfSk7XG5cdH0sXG5cblx0X29uU2F2ZTogZnVuY3Rpb24ocmdiLCBrZWVwT3Blbikge1xuXHRcdENvbG9yQWN0aW9ucy51cGRhdGVSZ2IocmdiKTtcblx0XHRpZiAoIWtlZXBPcGVuKXtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe2lzRWRpdGluZzogZmFsc2V9KTtcblx0XHR9XG5cdH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmdiRGlzcGxheTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbnZhciBSZ2JJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJSZ2JJbnB1dFwiLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdG9uU2F2ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblx0XHRyOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0ZzogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdGI6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRhbHBoYTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdGFscGhhRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZFxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHI6IHRoaXMucHJvcHMuciB8fCAwLFxuXHRcdFx0ZzogdGhpcy5wcm9wcy5nIHx8IDAsXG5cdFx0XHRiOiB0aGlzLnByb3BzLmIgfHwgMCxcblx0XHRcdGE6IHRoaXMucHJvcHMuYWxwaGEgfHwgMFxuXHRcdH07XG5cdH0sXG5cblx0Y29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbihwcmV2UHJvcHMpIHtcblx0XHRpZiAocHJldlByb3BzLnIgIT0gdGhpcy5wcm9wcy5yIHx8IHByZXZQcm9wcy5nICE9IHRoaXMucHJvcHMuZyB8fCBwcmV2UHJvcHMuYiAhPSB0aGlzLnByb3BzLmIpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRyOiB0aGlzLnByb3BzLnIsXG5cdFx0XHRcdGc6IHRoaXMucHJvcHMuZyxcblx0XHRcdFx0YjogdGhpcy5wcm9wcy5iLFxuXHRcdFx0XHRhOiB0aGlzLnByb3BzLmFscGhhXG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBjbGFzc05hbWVzKFwicmdiLWlucHV0XCIsIHtcImFscGhhLWVuYWJsZWRcIjogdGhpcy5wcm9wcy5hbHBoYUVuYWJsZWR9KX0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge1xuXHRcdFx0XHRcdG1pbjogXCIwXCIsIFxuXHRcdFx0XHRcdG1heDogXCIyNTVcIiwgXG5cdFx0XHRcdFx0dHlwZTogXCJudW1iZXJcIiwgXG5cdFx0XHRcdFx0dmFsdWU6IHRoaXMuc3RhdGUuciwgXG5cdFx0XHRcdFx0b25LZXlEb3duOiB0aGlzLl9oYW5kbGVLZXlEb3duLCBcblx0XHRcdFx0XHRvbkNoYW5nZTogdGhpcy5fb25DaGFuZ2UsIFxuXHRcdFx0XHRcdHJlZjogXCJySW5wdXRcIn1cblx0XHRcdFx0KSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XG5cdFx0XHRcdFx0bWluOiBcIjBcIiwgXG5cdFx0XHRcdFx0bWF4OiBcIjI1NVwiLCBcblx0XHRcdFx0XHR0eXBlOiBcIm51bWJlclwiLCBcblx0XHRcdFx0XHR2YWx1ZTogdGhpcy5zdGF0ZS5nLCBcblx0XHRcdFx0XHRvbktleURvd246IHRoaXMuX2hhbmRsZUtleURvd24sIFxuXHRcdFx0XHRcdG9uQ2hhbmdlOiB0aGlzLl9vbkNoYW5nZSwgXG5cdFx0XHRcdFx0cmVmOiBcImdJbnB1dFwifVxuXHRcdFx0XHQpLCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0XHRcdFx0XHRtaW46IFwiMFwiLCBcblx0XHRcdFx0XHRtYXg6IFwiMjU1XCIsIFxuXHRcdFx0XHRcdHR5cGU6IFwibnVtYmVyXCIsIFxuXHRcdFx0XHRcdHZhbHVlOiB0aGlzLnN0YXRlLmIsIFxuXHRcdFx0XHRcdG9uS2V5RG93bjogdGhpcy5faGFuZGxlS2V5RG93biwgXG5cdFx0XHRcdFx0b25DaGFuZ2U6IHRoaXMuX29uQ2hhbmdlLCBcblx0XHRcdFx0XHRyZWY6IFwiYklucHV0XCJ9XG5cdFx0XHRcdCksIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge1xuXHRcdFx0XHRcdGNsYXNzTmFtZTogXCJyZ2ItaW5wdXRfX2FscGhhXCIsIFxuXHRcdFx0XHRcdG1pbjogXCIwXCIsIFxuXHRcdFx0XHRcdG1heDogXCIxXCIsIFxuXHRcdFx0XHRcdHR5cGU6IFwibnVtYmVyXCIsIFxuXHRcdFx0XHRcdHN0ZXA6IFwiLjFcIiwgXG5cdFx0XHRcdFx0dmFsdWU6IHRoaXMuc3RhdGUuYSwgXG5cdFx0XHRcdFx0b25LZXlEb3duOiB0aGlzLl9oYW5kbGVLZXlEb3duLCBcblx0XHRcdFx0XHRvbkNoYW5nZTogdGhpcy5fb25DaGFuZ2UsIFxuXHRcdFx0XHRcdHJlZjogXCJhSW5wdXRcIn1cblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cdC8vY29tbWVudFxuXHRfaGFuZGxlS2V5RG93bjogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcblx0XHRcdHRoaXMuX3NhdmUoKTtcblx0XHR9XG5cdH0sXG5cblx0X29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdHI6IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5ySW5wdXQpLnZhbHVlQXNOdW1iZXIsXG5cdFx0XHRnOiBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuZ0lucHV0KS52YWx1ZUFzTnVtYmVyLFxuXHRcdFx0YjogUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmJJbnB1dCkudmFsdWVBc051bWJlcixcblx0XHRcdGE6IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5hSW5wdXQpLnZhbHVlQXNOdW1iZXJcblx0XHR9LCB0aGlzLl9zYXZlLmJpbmQodGhpcywgdHJ1ZSkpO1xuXHR9LFxuXG5cdF9zYXZlOiBmdW5jdGlvbihrZWVwT3Blbikge1xuXHRcdHRoaXMucHJvcHMub25TYXZlKFtcblx0XHRcdE1hdGgubWluKE1hdGgubWF4KHRoaXMuc3RhdGUuciB8fCAwLCAwKSwgMjU1KSxcblx0XHRcdE1hdGgubWluKE1hdGgubWF4KHRoaXMuc3RhdGUuZyB8fCAwLCAwKSwgMjU1KSxcblx0XHRcdE1hdGgubWluKE1hdGgubWF4KHRoaXMuc3RhdGUuYiB8fCAwLCAwKSwgMjU1KSxcblx0XHRcdE1hdGgubWluKE1hdGgubWF4KHRoaXMuc3RhdGUuYSB8fCAwLCAwKSwgMSlcblx0XHRdLCBrZWVwT3Blbik7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJnYklucHV0OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcbnZhciBDb2xvckFjdGlvbnMgPSByZXF1aXJlKCcuLy4uLy4uL2FjdGlvbnMvQ29sb3JBY3Rpb25zJyk7XG5cbnZhciBUcmFuc3BhcmVuY3lJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUcmFuc3BhcmVuY3lJbnB1dFwiLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGFscGhhOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0aGFzVHJhbnNwYXJlbmN5OiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkXG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0aXNFZGl0aW5nOiBmYWxzZSxcblx0XHRcdGhhc1RyYW5zcGFyZW5jeTogdGhpcy5wcm9wcy5oYXNUcmFuc3BhcmVuY3kgfHwgZmFsc2UsXG5cdFx0XHRhbHBoYTogdGhpcy5wcm9wcy5hbHBoYSB8fCAxXG5cdFx0fTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBpbnB1dDtcblx0XHR2YXIgZGlzcGxheTtcblx0XHR2YXIgY2hlY2tlZDtcblx0XHRpZiAodGhpcy5zdGF0ZS5oYXNUcmFuc3BhcmVuY3kpe1xuXHRcdFx0aWYgKHRoaXMuc3RhdGUuaXNFZGl0aW5nKSB7XG5cdFx0XHRcdGlucHV0ID1cblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge1xuXHRcdFx0XHRcdFx0dHlwZTogXCJudW1iZXJcIiwgXG5cdFx0XHRcdFx0XHRtaW46IFwiMFwiLCBcblx0XHRcdFx0XHRcdG1heDogXCIxXCIsIFxuXHRcdFx0XHRcdFx0c3RlcDogXCIuMVwiLCBcblx0XHRcdFx0XHRcdHZhbHVlOiB0aGlzLnN0YXRlLmFscGhhLCBcblx0XHRcdFx0XHRcdG9uS2V5RG93bjogdGhpcy5faGFuZGxlS2V5RG93biwgXG5cdFx0XHRcdFx0XHRvbkNoYW5nZTogdGhpcy5fb25BbHBoYUNoYW5nZX1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vXG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogY2xhc3NOYW1lcygnY29sb3ItaW5wdXQnLCAndHJhbnNwYXJlbmN5LWlucHV0Jywge1xuXHRcdFx0XHQnZWRpdGluZyc6IHRoaXMuc3RhdGUuaXNFZGl0aW5nLFxuXHRcdFx0XHQnZW5hYmxlZCc6IHRoaXMuc3RhdGUuaGFzVHJhbnNwYXJlbmN5XG5cdFx0XHRcdH0pXG5cdFx0XHR9LCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbG9yLWlucHV0X19sYWJlbFwifSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge29uRG91YmxlQ2xpY2s6IHRoaXMuX29uRG91YmxlQ2xpY2t9LCBcIlRyYW5zcGFyZW5jeVwiKSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0XHRcdFx0XHRcdHR5cGU6IFwiY2hlY2tib3hcIiwgXG5cdFx0XHRcdFx0XHRvbkNoYW5nZTogdGhpcy5fb25FbmFibGVkQ2hhbmdlLCBcblx0XHRcdFx0XHRcdGNoZWNrZWQ6IHRoaXMuc3RhdGUuaGFzVHJhbnNwYXJlbmN5fVxuXHRcdFx0XHRcdCApXG5cdFx0XHRcdCksIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29sb3ItaW5wdXRfX2Rpc3BsYXlcIiwgb25Eb3VibGVDbGljazogdGhpcy5fb25Eb3VibGVDbGlja30sIHRoaXMucHJvcHMuYWxwaGEpLCBcblx0XHRcdFx0aW5wdXRcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXG5cdF9vbkRvdWJsZUNsaWNrOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS5oYXNUcmFuc3BhcmVuY3kpe1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzRWRpdGluZzogdHJ1ZVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdF9oYW5kbGVLZXlEb3duOiBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuXHRcdFx0dGhpcy5fc2F2ZSgpO1xuXHRcdH1cblx0fSxcblxuXHRfb25BbHBoYUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGFscGhhOiBldmVudC50YXJnZXQudmFsdWVcblx0XHR9LCB0aGlzLl9zYXZlLmJpbmQodGhpcyx0cnVlKSk7XG5cdH0sXG5cblx0X29uRW5hYmxlZENoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS5oYXNUcmFuc3BhcmVuY3kpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc0VkaXRpbmc6IGZhbHNlXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRoYXNUcmFuc3BhcmVuY3k6ICF0aGlzLnN0YXRlLmhhc1RyYW5zcGFyZW5jeVxuXHRcdH0sIHRoaXMuX3NhdmVFbmFibGVkKTtcblx0fSxcblxuXHRfc2F2ZUVuYWJsZWQ6IGZ1bmN0aW9uKCl7XG5cdFx0Q29sb3JBY3Rpb25zLnVwZGF0ZUFscGhhRW5hYmxlZCh0aGlzLnN0YXRlLmhhc1RyYW5zcGFyZW5jeSk7XG5cdH0sXG5cblx0X3NhdmU6IGZ1bmN0aW9uKGtlZXBPcGVuKSB7XG5cdFx0Q29sb3JBY3Rpb25zLnVwZGF0ZUFscGhhKHRoaXMuc3RhdGUuYWxwaGEpO1xuXHRcdGlmICgha2VlcE9wZW4pIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc0VkaXRpbmc6IGZhbHNlXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNwYXJlbmN5SW5wdXQ7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xudmFyIGNvbG9yVXRpbCA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2NvbG9yVXRpbCcpO1xudmFyIERpc3BsYXlUZXh0ID0gcmVxdWlyZSgnLi9EaXNwbGF5VGV4dC5yZWFjdCcpO1xuXG52YXIgc3R5bGUgPSB7XG5cdGJhY2tncm91bmRDb2xvcjogJydcbn1cblxudmFyIERpc3BsYXlQYW5lID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkRpc3BsYXlQYW5lXCIsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0aHVlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0c2F0dXJhdGlvbjogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdGxpZ2h0bmVzczogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdGFscGhhOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0YWxwaGFFbmFibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkXG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRzdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIycgKyBjb2xvclV0aWwuaHNsMmhleCh0aGlzLnByb3BzLmh1ZSwgdGhpcy5wcm9wcy5zYXR1cmF0aW9uLCB0aGlzLnByb3BzLmxpZ2h0bmVzcyk7XG5cdFx0aWYgKHRoaXMucHJvcHMuYWxwaGFFbmFibGVkKSB7XG5cdFx0XHRzdHlsZS5vcGFjaXR5ID0gdGhpcy5wcm9wcy5hbHBoYTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGUub3BhY2l0eSA9IDE7XG5cdFx0fVxuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBjbGFzc05hbWVzKFwicGlja2VyLWRpc3BsYXlcIix7XG5cdFx0XHRcdFx0J3BpY2tlci1kaXNwbGF5X19kYXJrJyA6IHRoaXMucHJvcHMubGlnaHRuZXNzIDw9IC40NVxuXHRcdFx0XHR9KX0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicGlja2VyLWRpc3BsYXlfX2JhY2tncm91bmQtaW1hZ2VcIn0pLCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBpY2tlci1kaXNwbGF5X19pbm5lclwiLCBzdHlsZTogc3R5bGV9LCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KERpc3BsYXlUZXh0LCB7Y29sb3I6IFt0aGlzLnByb3BzLmh1ZSwgdGhpcy5wcm9wcy5zYXR1cmF0aW9uLCB0aGlzLnByb3BzLmxpZ2h0bmVzc119KVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGxheVBhbmU7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xudmFyIGNvbG9yVXRpbCA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2NvbG9yVXRpbCcpO1xuXG52YXIgc3R5bGUgPSB7XG5cdGNvbG9yOiAnJ1xufVxudmFyIGxpZ2h0ID0gdHJ1ZTtcblxudmFyIERpc3BsYXlUZXh0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkRpc3BsYXlUZXh0XCIsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5udW1iZXIpLmlzUmVxdWlyZWQsXG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgaHNsID0gdGhpcy5wcm9wcy5jb2xvcjtcblx0XHR2YXIgaGV4ID0gY29sb3JVdGlsLmhzbDJoZXgoaHNsWzBdLCBoc2xbMV0sIGhzbFsyXSk7XG5cdFx0c3R5bGUuY29sb3IgPSBoc2xbMl0gPiAuNDUgPyAnJyA6ICcjJyArIGhleDtcblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBpY2tlci1kaXNwbGF5X190ZXh0IHBpY2tlci1kaXNwbGF5X19ibG9ja1wiLCBzdHlsZTogc3R5bGV9LCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIHtjbGFzc05hbWU6IFwic2FtcGxlLWhlYWRlclwifSwgXCJTYW1wbGUgVGV4dFwiKSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHtjbGFzc05hbWU6IFwic2FtcGxlLXBhcmFncmFwaFwifSwgXCJMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gQW1ldCBxdWksIHBlcmZlcmVuZGlzISBOaWhpbCBxdWkgb21uaXMgY29ycG9yaXMgZGlnbmlzc2ltb3MuIFF1YXMsIGFiIHZpdGFlLCByZXBlbGxlbmR1cyBkZWxlY3R1cyBudWxsYSBvZmZpY2lpcyBwb3NzaW11cyB1bmRlIGRpZ25pc3NpbW9zIG5vYmlzIGRlc2VydW50IGxhdWRhbnRpdW0sIHF1aXNxdWFtLlwiKVxuXHRcdFx0KVxuXHRcdCk7XG5cdH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGxheVRleHQ7IiwidmFyIGtleU1pcnJvciA9IHJlcXVpcmUoJ2tleW1pcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcih7XG4gIEhVRV9VUERBVEU6IG51bGwsXG4gIFNBVFVSQVRJT05fVVBEQVRFOiBudWxsLFxuICBMSUdIVE5FU1NfVVBEQVRFOiBudWxsLFxuICBBTFBIQV9VUERBVEU6IG51bGwsXG4gIEFMUEhBX0VOQUJMRURfVVBEQVRFOiBudWxsLFxuICBIRVhfVVBEQVRFOiBudWxsLFxuICBSR0JfVVBEQVRFOiBudWxsLFxuICBIU0xfVVBEQVRFOiBudWxsXG59KTtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEFwcERpc3BhdGNoZXJcbiAqXG4gKiBBIHNpbmdsZXRvbiB0aGF0IG9wZXJhdGVzIGFzIHRoZSBjZW50cmFsIGh1YiBmb3IgYXBwbGljYXRpb24gdXBkYXRlcy5cbiAqL1xuXG52YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgnKS5EaXNwYXRjaGVyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBEaXNwYXRjaGVyKCk7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEFwcCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9BcHAuanMnKTtcbmNvbnNvbGUubG9nKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHByb290JykpO1xuUmVhY3QucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQXBwLCBudWxsKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcHJvb3QnKSk7IiwidmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgQ29sb3JDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvQ29sb3JDb25zdGFudHMnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG52YXIgY29sb3JVdGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL2NvbG9yVXRpbCcpO1xuXG52YXIgQ0hBTkdFX0VWRU5UID0gJ2NoYW5nZSc7XG5cbnZhciBfaHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjM2MCksXG4gICAgX3NhdHVyYXRpb24gPSAxLFxuICAgIF9saWdodG5lc3MgPSAuNSxcbiAgICBfYWxwaGEgPSAuNzUsXG4gICAgX2FscGhhRW5hYmxlZCA9IGZhbHNlO1xuXG5cbmZ1bmN0aW9uIHVwZGF0ZUh1ZShodWUpIHtcbiAgX2h1ZSA9IGh1ZTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlU2F0dXJhdGlvbihzYXQpIHtcbiAgX3NhdHVyYXRpb24gPSBzYXQ7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpZ2h0bmVzcyhsaWdodCkge1xuICBfbGlnaHRuZXNzID0gbGlnaHQ7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUFscGhhKGFscGhhKSB7XG4gIF9hbHBoYSA9IGFscGhhO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVBbHBoYUVuYWJsZWQoZW5hYmxlZCkge1xuICBfYWxwaGFFbmFibGVkID0gZW5hYmxlZDtcbn1cblxudmFyIENvbG9yU3RvcmUgPSBhc3NpZ24oe30sIEV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcblxuICBnZXRIdWU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfaHVlO1xuICB9LFxuXG4gIGdldFNhdHVyYXRpb246IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfc2F0dXJhdGlvbjtcbiAgfSxcblxuICBnZXRMaWdodG5lc3M6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfbGlnaHRuZXNzO1xuICB9LFxuXG4gIGdldEFscGhhOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gX2FscGhhO1xuICB9LFxuXG4gIGdldEFscGhhRW5hYmxlZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF9hbHBoYUVuYWJsZWQ7XG4gIH0sXG5cbiAgZW1pdENoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbWl0KENIQU5HRV9FVkVOVCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBhZGRDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihDSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgfVxufSk7XG5cbi8vIFJlZ2lzdGVyIGNhbGxiYWNrIHRvIGhhbmRsZSBhbGwgdXBkYXRlc1xuQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihhY3Rpb24pIHtcbiAgLy9jb25zb2xlLmxvZygnQ29sb3Igc3RvcmUgY2F0Y2ggZGlzcGF0Y2hlZCBhY3RvbicpO1xuXG4gIHN3aXRjaChhY3Rpb24uYWN0aW9uVHlwZSkge1xuICAgIGNhc2UgQ29sb3JDb25zdGFudHMuSFVFX1VQREFURTpcbiAgICAgIHZhciBodWUgPSBhY3Rpb24uaHVlO1xuICAgICAgaWYgKHZhbGlkSHVlKCtodWUpKXtcbiAgICAgICAgdXBkYXRlSHVlKCtodWUpO1xuICAgICAgICBDb2xvclN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQ29sb3JDb25zdGFudHMuU0FUVVJBVElPTl9VUERBVEU6XG4gICAgICB2YXIgc2F0ID0gYWN0aW9uLnNhdHVyYXRpb247XG4gICAgICBpZiAodmFsaWRTYXR1cmF0aW9uKCtzYXQpKXtcbiAgICAgICAgdXBkYXRlU2F0dXJhdGlvbigrc2F0KTtcbiAgICAgICAgQ29sb3JTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIENvbG9yQ29uc3RhbnRzLkxJR0hUTkVTU19VUERBVEU6XG4gICAgICB2YXIgbGlnaHQgPSBhY3Rpb24ubGlnaHRuZXNzO1xuICAgICAgaWYgKHZhbGlkTGlnaHRuZXNzKCtsaWdodCkpe1xuICAgICAgICB1cGRhdGVMaWdodG5lc3MoK2xpZ2h0KTtcbiAgICAgICAgQ29sb3JTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIENvbG9yQ29uc3RhbnRzLkFMUEhBX1VQREFURTpcbiAgICAgIHZhciBhbHBoYSA9IGFjdGlvbi5hbHBoYTtcbiAgICAgIGlmICh2YWxpZEFscGhhKCthbHBoYSkpe1xuICAgICAgICB1cGRhdGVBbHBoYSgrYWxwaGEpO1xuICAgICAgICBDb2xvclN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSBDb2xvckNvbnN0YW50cy5BTFBIQV9FTkFCTEVEX1VQREFURTpcbiAgICAgIHZhciBlbmFibGVkID0gYWN0aW9uLmFscGhhRW5hYmxlZDtcbiAgICAgIGlmIChlbmFibGVkKXtcbiAgICAgICAgdXBkYXRlQWxwaGFFbmFibGVkKHRydWUpO1xuICAgICAgICBDb2xvclN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVwZGF0ZUFscGhhRW5hYmxlZChmYWxzZSk7XG4gICAgICAgIENvbG9yU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIENvbG9yQ29uc3RhbnRzLkhFWF9VUERBVEU6XG4gICAgICB2YXIgaGV4ID0gYWN0aW9uLmhleDtcbiAgICAgIHZhciBoc2wgPSBjb2xvclV0aWxzLmhleDJoc2woaGV4KTtcbiAgICAgIGlmIChoc2wpIHtcbiAgICAgICAgdXBkYXRlSHVlKGhzbFswXSk7XG4gICAgICAgIHVwZGF0ZVNhdHVyYXRpb24oaHNsWzFdKTtcbiAgICAgICAgdXBkYXRlTGlnaHRuZXNzKGhzbFsyXSk7XG4gICAgICAgIENvbG9yU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBDb2xvckNvbnN0YW50cy5SR0JfVVBEQVRFOlxuICAgICAgdmFyIHJnYiA9IGFjdGlvbi5yZ2I7XG4gICAgICB2YXIgaHNsID0gY29sb3JVdGlscy5yZ2IyaHNsKHJnYlswXSwgcmdiWzFdLCByZ2JbMl0pO1xuICAgICAgdmFyIGFscGhhID0gcmdiWzNdO1xuICAgICAgaWYgKGhzbCkge1xuICAgICAgICB1cGRhdGVIdWUoaHNsWzBdKTtcbiAgICAgICAgdXBkYXRlU2F0dXJhdGlvbihoc2xbMV0pO1xuICAgICAgICB1cGRhdGVMaWdodG5lc3MoaHNsWzJdKTtcbiAgICAgICAgQ29sb3JTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGFscGhhID09ICdudW1iZXInICYmIHZhbGlkQWxwaGEoK2FscGhhKSkge1xuICAgICAgICB1cGRhdGVBbHBoYSgrYWxwaGEpO1xuICAgICAgICBDb2xvclN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQ29sb3JDb25zdGFudHMuSFNMX1VQREFURTpcbiAgICAgIHZhciBoc2wgPSBhY3Rpb24uaHNsO1xuICAgICAgaWYgKGhzbCkge1xuICAgICAgICB1cGRhdGVIdWUoaHNsWzBdKTtcbiAgICAgICAgdXBkYXRlU2F0dXJhdGlvbihoc2xbMV0pO1xuICAgICAgICB1cGRhdGVMaWdodG5lc3MoaHNsWzJdKTtcbiAgICAgICAgQ29sb3JTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgLy8gbm8gb3BcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIHZhbGlkSHVlKGh1ZSkge1xuICBpZiAoaXNOYU4oaHVlKSB8fCBodWUgPCAwIHx8IGh1ZSA+IDM2MCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZFNhdHVyYXRpb24oc2F0KSB7XG4gIGlmIChpc05hTihzYXQpIHx8IHNhdCA8IDAgfHwgc2F0ID4gMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZExpZ2h0bmVzcyhsaWdodCkge1xuICBpZiAoaXNOYU4obGlnaHQpIHx8IGxpZ2h0IDwgMCB8fCBsaWdodCA+IDEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRBbHBoYShhbHBoYSkge1xuICBpZiAoaXNOYU4oYWxwaGEpIHx8IGFscGhhIDwgMCB8fCBhbHBoYSA+IDEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xvclN0b3JlO1xuIiwidmFyIHV0aWxzID0ge1xuXHRoc3YycmdiOiBmdW5jdGlvbihoLHMsdikge1xuXHRcdHZhciBjID0gdiAqIHM7XG5cdCAgICB2YXIgaDEgPSBoIC8gNjA7XG5cdCAgICB2YXIgeCA9IGMgKiAoMSAtIE1hdGguYWJzKChoMSAlIDIpIC0gMSkpO1xuXHQgICAgdmFyIG0gPSB2IC0gYztcblx0ICAgIHZhciByZ2I7XG5cblx0ICAgIGlmICh0eXBlb2YgaCA9PSAndW5kZWZpbmVkJykgcmdiID0gWzAsIDAsIDBdO1xuXHQgICAgZWxzZSBpZiAoaDEgPCAxKSByZ2IgPSBbYywgeCwgMF07XG5cdCAgICBlbHNlIGlmIChoMSA8IDIpIHJnYiA9IFt4LCBjLCAwXTtcblx0ICAgIGVsc2UgaWYgKGgxIDwgMykgcmdiID0gWzAsIGMsIHhdO1xuXHQgICAgZWxzZSBpZiAoaDEgPCA0KSByZ2IgPSBbMCwgeCwgY107XG5cdCAgICBlbHNlIGlmIChoMSA8IDUpIHJnYiA9IFt4LCAwLCBjXTtcblx0ICAgIGVsc2UgaWYgKGgxIDw9IDYpIHJnYiA9IFtjLCAwLCB4XTtcblxuXHQgICAgdmFyIHIgPSAyNTUgKiAocmdiWzBdICsgbSk7XG5cdCAgICB2YXIgZyA9IDI1NSAqIChyZ2JbMV0gKyBtKTtcblx0ICAgIHZhciBiID0gMjU1ICogKHJnYlsyXSArIG0pO1xuXHQgICAgcmV0dXJuIFsrci50b0ZpeGVkKDgpLCArZy50b0ZpeGVkKDgpLCArYi50b0ZpeGVkKDgpXTtcblx0fSxcblxuXHRyZ2IyaHNsOiBmdW5jdGlvbihyLGcsYikge1xuXHRcdHZhciByMSA9IChyLzI1NSksXG5cdFx0XHRnMSA9IChnLzI1NSksXG5cdFx0XHRiMSA9IChiLzI1NSk7XG5cblx0XHR2YXIgY01heCA9IE1hdGgubWF4KHIxLGcxLGIxKSxcblx0XHRcdGNNaW4gPSBNYXRoLm1pbihyMSxnMSxiMSksXG5cdFx0XHRkZWx0YSA9IGNNYXggLSBjTWluO1xuXHRcdHZhciBILFMsTDtcblxuXHRcdGlmIChkZWx0YSA9PT0gMCkge1xuXHRcdFx0SCA9IDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN3aXRjaCAoY01heCkge1xuXHRcdFx0XHRjYXNlIChyMSk6XG5cdFx0XHRcdFx0SCA9IDYwICogKCgoZzEtYjEpL2RlbHRhKSAlIDYpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIChnMSk6XG5cdFx0XHRcdFx0SCA9IDYwICogKCgoYjEtcjEpL2RlbHRhKSArIDIpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIChiMSk6XG5cdFx0XHRcdFx0SCA9IDYwICogKCgocjEtZzEpL2RlbHRhKSArIDQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XG5cdFx0aWYgKEg8MCkge1xuXHRcdFx0SCA9IDM2MCAtIE1hdGguYWJzKEgpO1xuXHRcdH1cblxuXHRcdEwgPSAoY01heCArIGNNaW4pLzI7XG5cblx0XHRpZiAoZGVsdGEgPT0gMCkge1xuXHRcdFx0UyA9IDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdFMgPSBkZWx0YS8oMS1NYXRoLmFicygyKkwtMSkpO1xuXHRcdH1cblx0XHRyZXR1cm4gWytILnRvRml4ZWQoOCksK1MudG9GaXhlZCg4KSwrTC50b0ZpeGVkKDgpXVxuXHR9LFxuXG5cdGhzbDJyZ2I6IGZ1bmN0aW9uKGgscyxsKSB7XG5cdFx0aCA9IGgvMzYwO1xuXHRcdHZhciByLCBnLCBiO1xuXG5cdCAgICBpZihzID09IDApe1xuXHQgICAgICAgIHIgPSBnID0gYiA9IGw7IC8vIGFjaHJvbWF0aWNcblx0ICAgIH1lbHNle1xuXHQgICAgICAgIGZ1bmN0aW9uIGh1ZTJyZ2IocCwgcSwgdCl7XG5cdCAgICAgICAgICAgIGlmKHQgPCAwKSB0ICs9IDE7XG5cdCAgICAgICAgICAgIGlmKHQgPiAxKSB0IC09IDE7XG5cdCAgICAgICAgICAgIGlmKHQgPCAxLzYpIHJldHVybiBwICsgKHEgLSBwKSAqIDYgKiB0O1xuXHQgICAgICAgICAgICBpZih0IDwgMS8yKSByZXR1cm4gcTtcblx0ICAgICAgICAgICAgaWYodCA8IDIvMykgcmV0dXJuIHAgKyAocSAtIHApICogKDIvMyAtIHQpICogNjtcblx0ICAgICAgICAgICAgcmV0dXJuIHA7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIHEgPSBsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzO1xuXHQgICAgICAgIHZhciBwID0gMiAqIGwgLSBxO1xuXHQgICAgICAgIHIgPSBodWUycmdiKHAsIHEsIGggKyAxLzMpO1xuXHQgICAgICAgIGcgPSBodWUycmdiKHAsIHEsIGgpO1xuXHQgICAgICAgIGIgPSBodWUycmdiKHAsIHEsIGggLSAxLzMpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gWysociAqIDI1NSkudG9QcmVjaXNpb24oOCksICsoZyAqIDI1NSkudG9GaXhlZCg4KSwgKyhiICogMjU1KS50b0ZpeGVkKDgpXTtcblx0fSxcblxuXHRoc2wyaGV4OiBmdW5jdGlvbihoLHMsbCkge1xuXHRcdHZhciByZ2IgPSB0aGlzLmhzbDJyZ2IoaCxzLGwpO1xuXHRcdHJldHVybiAnJyArIGNvbXBvbmVudFRvSGV4KE1hdGguZmxvb3IocmdiWzBdKSkgKyBjb21wb25lbnRUb0hleChNYXRoLmZsb29yKHJnYlsxXSkpICsgY29tcG9uZW50VG9IZXgoTWF0aC5mbG9vcihyZ2JbMl0pKTtcblx0fSxcblxuXHRoZXgyaHNsOiBmdW5jdGlvbihoZXgpIHtcblx0XHR2YXIgcmVzdWx0ID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCk7XG5cblx0XHRyZXR1cm4gcmVzdWx0ID8gdGhpcy5yZ2IyaHNsKHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpLCBwYXJzZUludChyZXN1bHRbMl0sIDE2KSwgcGFyc2VJbnQocmVzdWx0WzNdLCAxNikpIDogbnVsbDtcblx0fVxuXG59XG5cbmZ1bmN0aW9uIGNvbXBvbmVudFRvSGV4KGMpIHtcblx0dmFyIGhleCA9IGMudG9TdHJpbmcoMTYpO1xuICAgIHJldHVybiBoZXgubGVuZ3RoID09IDEgPyBcIjBcIiArIGhleCA6IGhleDtcbn1cbndpbmRvdy5jb2xvciA9IHV0aWxzO1xubW9kdWxlLmV4cG9ydHMgPSB1dGlsczsiLCJ2YXIgdXRpbHMgPSB7XG5cdC8qXG5cdCogQHBhcmFtIGVsZW1lbnQ6IGRvbSBlbGVtZW50XG5cdCovXG5cdG9mZnNldDogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICB2YXIgYm91bmRpbmdDbGllbnRSZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdpZHRoOiBib3VuZGluZ0NsaWVudFJlY3Qud2lkdGggfHwgZWxlbWVudC5wcm9wKCdvZmZzZXRXaWR0aCcpLFxuICAgICAgICAgICAgaGVpZ2h0OiBib3VuZGluZ0NsaWVudFJlY3QuaGVpZ2h0IHx8IGVsZW1lbnQucHJvcCgnb2Zmc2V0SGVpZ2h0JyksXG4gICAgICAgICAgICB0b3A6IGJvdW5kaW5nQ2xpZW50UmVjdC50b3AgKyAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3ApLFxuICAgICAgICAgICAgbGVmdDogYm91bmRpbmdDbGllbnRSZWN0LmxlZnQgKyAod2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0KVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBnZXRTdHlsZTogZnVuY3Rpb24gKGVsLCBjc3Nwcm9wKSB7XG4gICAgICAgIGlmIChlbC5jdXJyZW50U3R5bGUpIHsgLy9JRVxuICAgICAgICAgICAgcmV0dXJuIGVsLmN1cnJlbnRTdHlsZVtjc3Nwcm9wXTtcbiAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKVtjc3Nwcm9wXTtcbiAgICAgICAgfVxuICAgICAgICAvLyBmaW5hbGx5IHRyeSBhbmQgZ2V0IGlubGluZSBzdHlsZVxuICAgICAgICByZXR1cm4gZWwuc3R5bGVbY3NzcHJvcF07XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxzOyIsInZhciB1dGlscyA9IHtcblx0ZGVib3VuY2U6IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuXHRcdHZhciB0aW1lb3V0O1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcblx0XHRcdHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aW1lb3V0ID0gbnVsbDtcblx0XHRcdFx0aWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdFx0XHR9O1xuXHRcdFx0dmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG5cdFx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG5cdFx0XHRpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHR9O1xuXHR9LFxuXHRyb3VuZDogZnVuY3Rpb24obiwgZGVjKSB7XG5cdFx0aWYgKGRlY2ltYWxQbGFjZXMobikgPiAoZGVjIHx8IDIpKXtcblx0XHRcdHJldHVybiBwYXJzZUZsb2F0KG4udG9GaXhlZChkZWMgfHwgMikpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbjtcblx0XHR9XG5cdH1cbn07XG5cbmZ1bmN0aW9uIGRlY2ltYWxQbGFjZXMobnVtYmVyKSB7XG4gIHJldHVybiAoKCtudW1iZXIpLnRvRml4ZWQoMjApKS5yZXBsYWNlKC9eLT9cXGQqXFwuP3wwKyQvZywgJycpLmxlbmd0aDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1dGlsczsiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCIvKiFcbiAgQ29weXJpZ2h0IChjKSAyMDE1IEplZCBXYXRzb24uXG4gIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTUlUKSwgc2VlXG4gIGh0dHA6Ly9qZWR3YXRzb24uZ2l0aHViLmlvL2NsYXNzbmFtZXNcbiovXG4vKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHk7XG5cblx0ZnVuY3Rpb24gY2xhc3NOYW1lcyAoKSB7XG5cdFx0dmFyIGNsYXNzZXMgPSAnJztcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYXJnID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0aWYgKCFhcmcpIGNvbnRpbnVlO1xuXG5cdFx0XHR2YXIgYXJnVHlwZSA9IHR5cGVvZiBhcmc7XG5cblx0XHRcdGlmIChhcmdUeXBlID09PSAnc3RyaW5nJyB8fCBhcmdUeXBlID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGFyZztcblx0XHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG5cdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsgY2xhc3NOYW1lcy5hcHBseShudWxsLCBhcmcpO1xuXHRcdFx0fSBlbHNlIGlmIChhcmdUeXBlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRcdFx0aWYgKGhhc093bi5jYWxsKGFyZywga2V5KSAmJiBhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBrZXk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsYXNzZXMuc3Vic3RyKDEpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGNsYXNzTmFtZXM7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LmNsYXNzTmFtZXMgPSBjbGFzc05hbWVzO1xuXHR9XG59KCkpO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE0IEZhY2Vib29rLCBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYW4gZW51bWVyYXRpb24gd2l0aCBrZXlzIGVxdWFsIHRvIHRoZWlyIHZhbHVlLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqICAgdmFyIENPTE9SUyA9IGtleU1pcnJvcih7Ymx1ZTogbnVsbCwgcmVkOiBudWxsfSk7XG4gKiAgIHZhciBteUNvbG9yID0gQ09MT1JTLmJsdWU7XG4gKiAgIHZhciBpc0NvbG9yVmFsaWQgPSAhIUNPTE9SU1tteUNvbG9yXTtcbiAqXG4gKiBUaGUgbGFzdCBsaW5lIGNvdWxkIG5vdCBiZSBwZXJmb3JtZWQgaWYgdGhlIHZhbHVlcyBvZiB0aGUgZ2VuZXJhdGVkIGVudW0gd2VyZVxuICogbm90IGVxdWFsIHRvIHRoZWlyIGtleXMuXG4gKlxuICogICBJbnB1dDogIHtrZXkxOiB2YWwxLCBrZXkyOiB2YWwyfVxuICogICBPdXRwdXQ6IHtrZXkxOiBrZXkxLCBrZXkyOiBrZXkyfVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xudmFyIGtleU1pcnJvciA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgcmV0ID0ge307XG4gIHZhciBrZXk7XG4gIGlmICghKG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopKSkge1xuICAgIHRocm93IG5ldyBFcnJvcigna2V5TWlycm9yKC4uLik6IEFyZ3VtZW50IG11c3QgYmUgYW4gb2JqZWN0LicpO1xuICB9XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXRba2V5XSA9IGtleTtcbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3I7XG4iXX0=
