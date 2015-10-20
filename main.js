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
			isEditing: false,
			isCopying: false
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
					'editing': this.state.isEditing,
					'copying': this.state.isCopying
				})}, 
				React.createElement("div", null, 
					React.createElement("div", {className: "color-input__label"}, "Hex", 
						React.createElement("span", {className: "color-input__copy-button", onClick: this._openCopy}, React.createElement("img", {src: "http://rickysandoval.github.io/colorpane/img/copy.png"})), 
						React.createElement("span", {
							className: "color-input__copy-text"}, 
							React.createElement("input", {
								value: '#' + hex, 
								onBlur: this._closeCopy, 
								ref: "copyText", readOnly: true})
						)
					), 

					React.createElement("div", {
						className: "color-input__display", 
						onDoubleClick: this._openEdit}, "#", hex )
				), 
				input
			)
		);
	},

	_closeCopy: function() {
		this.setState({isCopying: false});
	},

	_openCopy: function() {
		console.log('open copy');
		var input = React.findDOMNode(this.refs.copyText);
		if (!this.state.isCopying) {
			this.setState({isCopying: true});
			setTimeout(function(){
				input.focus();
				input.select();
			});
		}
		setTimeout(function(){
			input.select();
		});
	},

	_openEdit: function() {
		this.setState({isEditing: true});
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
			isEditing: false,
			isCopying: false
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
				'editing': this.state.isEditing,
				'copying': this.state.isCopying
				})}, 
				React.createElement("div", null, 
					React.createElement("div", {className: "color-input__label"}, 
						"RGB", this.props.alphaEnabled ? 'a' : '', 
						React.createElement("span", {className: "color-input__copy-button", onClick: this._openCopy}, React.createElement("img", {src: "http://rickysandoval.github.io/colorpane/img/copy.png"})), 
						React.createElement("span", {
							className: "color-input__copy-text"}, 
							React.createElement("input", {
								value: this._printRgb(rgb), 
								onBlur: this._closeCopy, 
								ref: "copyText", readOnly: true})
						)
					), 
					React.createElement("div", {
						className: "color-input__display", 
						onDoubleClick: this._openEdit}, 
						gUtil.round(rgb[0]), ", ", gUtil.round(rgb[1]), ", ", gUtil.round(rgb[2]), this.props.alphaEnabled ? ', '+this.props.alpha : ''
					)
				), 
				input
			)
		);
	},

	_closeCopy: function() {
		this.setState({isCopying: false});
	},

	_openCopy: function() {
		var input = React.findDOMNode(this.refs.copyText);
		if (!this.state.isCopying) {
			this.setState({isCopying: true});
			setTimeout(function(){
				input.focus();
				input.select();
			});
		}
		setTimeout(function(){
			input.select();
		});
	},

	_openEdit: function() {
		this.setState({isEditing: true});
	},

	_printRgb: function(rgb) {
		var text = 'rgb' + 
					(this.props.alphaEnabled ? 'a' : '') + 
					'(' + gUtil.round(rgb[0]) + ',' +
					gUtil.round(rgb[1]) + ',' +
					gUtil.round(rgb[2]) + 
					(this.props.alphaEnabled ? (', ' +this.props.alpha) : '') + ')';
		return text;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hY3Rpb25zL0NvbG9yQWN0aW9ucy5qcyIsImpzL2NvbXBvbmVudHMvQXBwLmpzIiwianMvY29tcG9uZW50cy9IZWFkZXIucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2NvbG9ycGFuZS9Db2xvclBhbmUucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2NvbG9ycGFuZS9TaGFkZVBhbmUucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2NvbnRyb2xzL0NvbnRyb2xQYW5lLnJlYWN0LmpzIiwianMvY29tcG9uZW50cy9jb250cm9scy9IZXhEaXNwbGF5LnJlYWN0LmpzIiwianMvY29tcG9uZW50cy9jb250cm9scy9IZXhJbnB1dC5yZWFjdC5qcyIsImpzL2NvbXBvbmVudHMvY29udHJvbHMvSHNsRGlzcGxheS5yZWFjdC5qcyIsImpzL2NvbXBvbmVudHMvY29udHJvbHMvSHNsSW5wdXQucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2NvbnRyb2xzL1JnYkRpc3BsYXkucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2NvbnRyb2xzL1JnYklucHV0LnJlYWN0LmpzIiwianMvY29tcG9uZW50cy9jb250cm9scy9UcmFuc3BhcmVuY3lJbnB1dC5yZWFjdC5qcyIsImpzL2NvbXBvbmVudHMvZGlzcGxheXBhbmUvRGlzcGxheVBhbmUucmVhY3QuanMiLCJqcy9jb21wb25lbnRzL2Rpc3BsYXlwYW5lL0Rpc3BsYXlUZXh0LnJlYWN0LmpzIiwianMvY29uc3RhbnRzL0NvbG9yQ29uc3RhbnRzLmpzIiwianMvZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyLmpzIiwianMvbWFpbi5qcyIsImpzL3N0b3Jlcy9Db2xvclN0b3JlLmpzIiwianMvdXRpbHMvY29sb3JVdGlsLmpzIiwianMvdXRpbHMvZG9tVXRpbC5qcyIsImpzL3V0aWxzL2dlbmVyYWxVdGlsLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9rZXltaXJyb3IvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIENvbG9yQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL0NvbG9yQ29uc3RhbnRzJyk7XG5cbnZhciBDb2xvckFjdGlvbnMgPSB7XG5cbiAgdXBkYXRlU2F0dXJhdGlvbjogZnVuY3Rpb24oc2F0KSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICBhY3Rpb25UeXBlOiBDb2xvckNvbnN0YW50cy5TQVRVUkFUSU9OX1VQREFURSxcbiAgICAgIHNhdHVyYXRpb246IHNhdFxuICAgIH0pO1xuICB9LFxuXG4gIHVwZGF0ZUh1ZTogZnVuY3Rpb24oaHVlKSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICBhY3Rpb25UeXBlOiBDb2xvckNvbnN0YW50cy5IVUVfVVBEQVRFLFxuICAgICAgaHVlOiBodWVcbiAgICB9KTtcbiAgfSxcblxuICB1cGRhdGVMaWdodG5lc3M6IGZ1bmN0aW9uKGxpZ2h0KSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICBhY3Rpb25UeXBlOiBDb2xvckNvbnN0YW50cy5MSUdIVE5FU1NfVVBEQVRFLFxuICAgICAgbGlnaHRuZXNzOiBsaWdodFxuICAgIH0pO1xuICB9LFxuXG4gIHVwZGF0ZUFscGhhOiBmdW5jdGlvbihhbHBoYSkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogQ29sb3JDb25zdGFudHMuQUxQSEFfVVBEQVRFLFxuICAgICAgYWxwaGE6IGFscGhhXG4gICAgfSk7XG4gIH0sXG5cbiAgdXBkYXRlQWxwaGFFbmFibGVkOiBmdW5jdGlvbihlbmFibGVkKSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICBhY3Rpb25UeXBlOiBDb2xvckNvbnN0YW50cy5BTFBIQV9FTkFCTEVEX1VQREFURSxcbiAgICAgIGFscGhhRW5hYmxlZDogZW5hYmxlZFxuICAgIH0pO1xuICB9LFxuXG4gIHVwZGF0ZUhleDogZnVuY3Rpb24oaGV4KSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICBhY3Rpb25UeXBlOiBDb2xvckNvbnN0YW50cy5IRVhfVVBEQVRFLFxuICAgICAgaGV4OiBoZXhcbiAgICB9KTtcbiAgfSxcblxuICB1cGRhdGVSZ2I6IGZ1bmN0aW9uKHJnYikge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogQ29sb3JDb25zdGFudHMuUkdCX1VQREFURSxcbiAgICAgIHJnYjogcmdiXG4gICAgfSk7XG4gIH0sXG5cbiAgdXBkYXRlSHNsOiBmdW5jdGlvbihoc2wpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIGFjdGlvblR5cGU6IENvbG9yQ29uc3RhbnRzLkhTTF9VUERBVEUsXG4gICAgICBoc2w6IGhzbFxuICAgIH0pO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sb3JBY3Rpb25zO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIENvbG9yU3RvcmUgPSByZXF1aXJlKCcuLy4uL3N0b3Jlcy9Db2xvclN0b3JlJyk7XG52YXIgQ29sb3JBY3Rpb25zID0gcmVxdWlyZSgnLi8uLi9hY3Rpb25zL0NvbG9yQWN0aW9ucycpO1xuXG52YXIgSGVhZGVyID0gcmVxdWlyZSgnLi9IZWFkZXIucmVhY3QnKTtcbnZhciBDb2xvclBhbmUgPSByZXF1aXJlKCcuL2NvbG9ycGFuZS9Db2xvclBhbmUucmVhY3QnKTtcbnZhciBTaGFkZVBhbmUgPSByZXF1aXJlKCcuL2NvbG9ycGFuZS9TaGFkZVBhbmUucmVhY3QnKTtcbnZhciBEaXNwbGF5UGFuZSA9IHJlcXVpcmUoJy4vZGlzcGxheXBhbmUvRGlzcGxheVBhbmUucmVhY3QnKTtcbnZhciBDb250cm9sUGFuZSA9IHJlcXVpcmUoJy4vY29udHJvbHMvQ29udHJvbFBhbmUucmVhY3QnKTtcblxuZnVuY3Rpb24gZ2V0U3RhdGUoKSB7XG5cdHJldHVybiB7XG5cdFx0c2F0dXJhdGlvbjogQ29sb3JTdG9yZS5nZXRTYXR1cmF0aW9uKCksXG5cdFx0aHVlOiBDb2xvclN0b3JlLmdldEh1ZSgpLFxuXHRcdGxpZ2h0bmVzczogQ29sb3JTdG9yZS5nZXRMaWdodG5lc3MoKSxcblx0XHRhbHBoYTogQ29sb3JTdG9yZS5nZXRBbHBoYSgpLFxuXHRcdGFscGhhRW5hYmxlZDogQ29sb3JTdG9yZS5nZXRBbHBoYUVuYWJsZWQoKVxuXHR9O1xufVxuXG52YXIgQXBwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkFwcFwiLFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGdldFN0YXRlKClcblx0fSxcblxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG5cdFx0Q29sb3JTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG5cdH0sXG5cblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdENvbG9yU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzaXRlLXdyYXBwZXJcIn0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KEhlYWRlciwgbnVsbCksIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwibWFpblwiLCB7Y2xhc3NOYW1lOiBcInNpdGUtbWFpblwifSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBpY2tlci1jb250cm9sc1wifSwgXG5cdFx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KENvbnRyb2xQYW5lLCB7XG5cdFx0XHRcdFx0XHRcdGh1ZTogdGhpcy5zdGF0ZS5odWUsIFxuXHRcdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiB0aGlzLnN0YXRlLnNhdHVyYXRpb24sIFxuXHRcdFx0XHRcdFx0XHRsaWdodG5lc3M6IHRoaXMuc3RhdGUubGlnaHRuZXNzLCBcblx0XHRcdFx0XHRcdFx0YWxwaGE6IHRoaXMuc3RhdGUuYWxwaGEsIFxuXHRcdFx0XHRcdFx0XHRhbHBoYUVuYWJsZWQ6IHRoaXMuc3RhdGUuYWxwaGFFbmFibGVkfVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdCksIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwaWNrZXItd2hlZWxcIn0sIFxuXHRcdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBpY2tlci13aGVlbF9fd3JhcHBlclwifSwgXG5cdFx0XHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sb3JQYW5lLCBudWxsKSwgXG5cdFx0XHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2hhZGVQYW5lLCB7XG5cdFx0XHRcdFx0XHRcdFx0aHVlOiB0aGlzLnN0YXRlLmh1ZSwgXG5cdFx0XHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogdGhpcy5zdGF0ZS5zYXR1cmF0aW9uLCBcblx0XHRcdFx0XHRcdFx0XHRsaWdodG5lc3M6IHRoaXMuc3RhdGUubGlnaHRuZXNzfVxuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChEaXNwbGF5UGFuZSwge1xuXHRcdFx0XHRcdFx0aHVlOiB0aGlzLnN0YXRlLmh1ZSwgXG5cdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiB0aGlzLnN0YXRlLnNhdHVyYXRpb24sIFxuXHRcdFx0XHRcdFx0bGlnaHRuZXNzOiB0aGlzLnN0YXRlLmxpZ2h0bmVzcywgXG5cdFx0XHRcdFx0XHRhbHBoYTogdGhpcy5zdGF0ZS5hbHBoYSwgXG5cdFx0XHRcdFx0XHRhbHBoYUVuYWJsZWQ6IHRoaXMuc3RhdGUuYWxwaGFFbmFibGVkfVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cblx0X29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNldFN0YXRlKGdldFN0YXRlKCkpO1xuXHR9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcDtcblxuOyhmdW5jdGlvbigpIHtcbiAgICB2YXIgdGhyb3R0bGUgPSBmdW5jdGlvbih0eXBlLCBuYW1lLCBvYmopIHtcbiAgICAgICAgdmFyIG9iaiA9IG9iaiB8fCB3aW5kb3c7XG4gICAgICAgIHZhciBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHZhciBmdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAocnVubmluZykgeyByZXR1cm47IH1cbiAgICAgICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG9iai5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChuYW1lKSk7XG4gICAgICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIG9iai5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGZ1bmMpO1xuICAgIH07XG5cbiAgICAvKiBpbml0IC0geW91IGNhbiBpbml0IGFueSBldmVudCAqL1xuICAgIHRocm90dGxlKFwicmVzaXplXCIsIFwib3B0aW1pemVkUmVzaXplXCIpO1xufSkoKTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgSGVhZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkhlYWRlclwiLFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaGVhZGVyXCIsIHtjbGFzc05hbWU6IFwic2l0ZS1oZWFkZXJcIn0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwge2NsYXNzTmFtZTogXCJzaXRlLWhlYWRlcl9fdGl0bGVcIn0sIFwiQ29sb3IgUGFuZVwiKVxuXHRcdFx0KVxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhlYWRlcjsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIENvbG9yQWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQ29sb3JBY3Rpb25zJyk7XG52YXIgY29sb3JVdGlscyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2NvbG9yVXRpbCcpO1xudmFyIGRvbVV0aWxzID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvZG9tVXRpbC5qcycpO1xudmFyIGdlblV0aWxzID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvZ2VuZXJhbFV0aWwuanMnKTtcblxudmFyIHNpemU7XG52YXIgYWN0aXZlID0gZmFsc2U7XG52YXIgbGFzdE1vdmUgPSAwO1xudmFyIG1vdmVUaHJvdHRsZSA9IDE7XG52YXIgd3JhcHBlclN0eWxlID0ge1xuXHRkaXNwbGF5OiAnaW5saW5lLWJsb2NrJ1xufTtcbnZhciBtYXJrZXJTdHlsZSA9IHtcblx0cG9zaXRpb246ICdhYnNvbHV0ZScsXG5cdHdpZHRoOiAnMnB4Jyxcblx0YmFja2dyb3VuZDogJ2JsYWNrJyxcblx0bGVmdDogJzUwJScsXG5cdHRvcDogJzBweCcsXG5cdG1hcmdpbkxlZnQ6ICctMXB4Jyxcblx0dHJhbnNmb3JtT3JpZ2luOiAnYm90dG9tIGNlbnRlcicsXG5cdGN1cnNvcjogJ3BvaW50ZXInXG59O1xuXG52YXIgQ29sb3JQYW5lID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkNvbG9yUGFuZVwiLFxuXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcblx0XHR2YXIgY2FudmFzID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmNvbG9yUGFuZUNhbnZhcyk7XG5cdFx0dmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRzaXplID0gcGFyc2VJbnQoZG9tVXRpbHMuZ2V0U3R5bGUodGhpcy5nZXRET01Ob2RlKCksICd3aWR0aCcpKTtcblx0XHRjYW52YXMud2lkdGggPSBzaXplO1xuXHRcdGNhbnZhcy5oZWlnaHQgPSBzaXplO1xuICAgIFx0dGhpcy5wYWludChjb250ZXh0KTtcbiAgICBcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcHRpbWl6ZWRSZXNpemUnLCB0aGlzLnJlc2l6ZSk7XG5cdH0sXG5cblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdvcHRpbWl6ZWRSZXNpemUnLCB0aGlzLnJlc2l6ZSk7XG5cdH0sXG5cblx0cmVzaXplOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgblNpemUgPSBwYXJzZUludChkb21VdGlscy5nZXRTdHlsZSh0aGlzLmdldERPTU5vZGUoKSwgJ3dpZHRoJykpO1xuXHRcdGlmIChzaXplICE9IG5TaXplKSB7XG5cdFx0XHRzaXplID0gblNpemU7XG5cdFx0XHR2YXIgY2FudmFzID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmNvbG9yUGFuZUNhbnZhcyk7XG5cdFx0XHRjYW52YXMud2lkdGggPSBzaXplO1xuXHRcdFx0Y2FudmFzLmhlaWdodCA9IHNpemU7XG5cdFx0XHR2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHQgICAgXHR0aGlzLnBhaW50KGNvbnRleHQpO1xuXHRcdH1cblx0fSxcblxuXHRwYWludDogZnVuY3Rpb24oY29udGV4dCkge1xuXHRcdHZhciBiaXRtYXAgPSBjb250ZXh0LmdldEltYWdlRGF0YSgwLDAsc2l6ZSxzaXplKTtcblx0XHR2YXIgdmFsdWUgPSAxO1xuICAgICAgICB2YXIgc2F0dXJhdGlvbiA9IDE7XG5cblx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHNpemU7IHkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBzaXplOyB4KyspIHtcbiAgICAgICAgICAgICAgICAvLyBvZmZzZXQgZm9yIHRoZSA0IFJHQkEgdmFsdWVzIGluIHRoZSBkYXRhIGFycmF5XG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldCA9IDQgKiAoKHkgKiBzaXplKSArIHgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGh1ZSA9IDE4MCArIE1hdGguYXRhbjIoeSAtIHNpemUvMiwgeCAtIHNpemUvMikgKiAoMTgwIC8gTWF0aC5QSSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgaHN2ID0gY29sb3JVdGlscy5oc3YycmdiKGh1ZSwgc2F0dXJhdGlvbiwgdmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgLy8gZmlsbCBSR0JBIHZhbHVlc1xuICAgICAgICAgICAgICAgIGJpdG1hcC5kYXRhW29mZnNldCArIDBdID0gaHN2WzBdO1xuICAgICAgICAgICAgICAgIGJpdG1hcC5kYXRhW29mZnNldCArIDFdID0gaHN2WzFdO1xuICAgICAgICAgICAgICAgIGJpdG1hcC5kYXRhW29mZnNldCArIDJdID0gaHN2WzJdO1xuICAgICAgICAgICAgICAgIGJpdG1hcC5kYXRhW29mZnNldCArIDNdID0gMjU1OyAvLyBubyB0cmFuc3BhcmVuY3lcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5wdXRJbWFnZURhdGEoYml0bWFwLCAwLCAwKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBcImNvbG9yLXBhbmVcIiwgXG5cdFx0XHRcdHN0eWxlOiB3cmFwcGVyU3R5bGUsIFxuXHRcdFx0XHRvbk1vdXNlTW92ZTogdGhpcy5faGFuZGxlTW91c2VNb3ZlfSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiwge1xuXHRcdFx0XHRcdGlkOiBcInBpY2tlclwiLCBcblx0XHRcdFx0XHRjbGFzc05hbWU6IFwiY29sb3ItcGFuZV9fY2FudmFzXCIsIFxuXHRcdFx0XHRcdG9uTW91c2VEb3duOiB0aGlzLl9oYW5kbGVNb3VzZURvd24sIFxuXHRcdFx0XHRcdG9uTW91c2VMZWF2ZTogdGhpcy5faGFuZGxlTW91c2VMZWF2ZSwgXG5cdFx0XHRcdFx0cmVmOiBcImNvbG9yUGFuZUNhbnZhc1wifVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblxuXHRfaGFuZGxlTW91c2VEb3duOiBmdW5jdGlvbihkb3duX2V2ZW50KSB7XG5cdFx0YWN0aXZlID0gdHJ1ZTtcblx0XHR0aGlzLl9zZXRDb2xvcihkb3duX2V2ZW50KTtcblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHR2YXIgbW91c2VNb3ZlID0gZnVuY3Rpb24obW92ZV9ldmVudCkge1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VNb3ZlKTtcblx0XHRcdHRoYXQuX3NldENvbG9yKG1vdmVfZXZlbnQpO1xuXHRcdH07XG5cdFx0dmFyIG1vdXNlVXAgPSBmdW5jdGlvbih1cF9ldmVudCkge1xuXHRcdFx0YWN0aXZlID0gZmFsc2U7XG5cdFx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwKTtcblx0XHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2VNb3ZlKTtcblx0XHRcdHRoYXQuX3NldENvbG9yKHVwX2V2ZW50KTtcblx0XHR9O1xuXHRcdGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXApO1xuXHRcdGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2VNb3ZlKTtcblx0fSxcblxuXHRfaGFuZGxlTW91c2VMZWF2ZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRpZiAoYWN0aXZlKSB7XG5cdFx0XHR0aGlzLl9zZXRDb2xvcihldmVudCk7XG5cdFx0fVxuXHR9LFxuXG5cdF9oYW5kbGVNb3VzZU1vdmU6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgICBcdGlmIChub3cgPiBsYXN0TW92ZSArIG1vdmVUaHJvdHRsZSAmJiBhY3RpdmUpIHtcbiAgICAgIFx0XHRsYXN0TW92ZSA9IG5vdztcbiAgICAgIFx0XHR0aGlzLl9zZXRDb2xvcihldmVudCk7XG4gICAgICBcdH1cblx0fSxcblxuXHRfc2V0Q29sb3I6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHBvcyA9IGRvbVV0aWxzLm9mZnNldCh0aGlzLmdldERPTU5vZGUoKSk7XG5cdFx0dmFyIHggPSBldmVudC5wYWdlWCAtIHBvcy5sZWZ0O1xuXHRcdHZhciB5ID0gZXZlbnQucGFnZVkgLSBwb3MudG9wO1xuXHRcdHZhciBodWUgPSAxODAgKyBNYXRoLmF0YW4yKHkgLSBzaXplLzIsIHggLSBzaXplLzIpICogKDE4MCAvIE1hdGguUEkpO1xuXHRcdENvbG9yQWN0aW9ucy51cGRhdGVIdWUoK2h1ZS50b0ZpeGVkKDIpKTtcblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb2xvclBhbmU7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBjb2xvclV0aWxzID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvY29sb3JVdGlsJyk7XG52YXIgZG9tVXRpbHMgPSByZXF1aXJlKCcuLi8uLi91dGlscy9kb21VdGlsLmpzJyk7XG52YXIgZ2VuVXRpbHMgPSByZXF1aXJlKCcuLi8uLi91dGlscy9nZW5lcmFsVXRpbC5qcycpO1xudmFyIENvbG9yQWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQ29sb3JBY3Rpb25zJyk7XG5cbnZhciBzaXplO1xudmFyIHBhZGRpbmcgPSAxMDtcbnZhciBhY3RpdmUgPSBmYWxzZTtcbnZhciBsYXN0TW92ZSA9IDA7XG52YXIgbW92ZVRocm90dGxlID0gMTtcbnZhciBwYWludGluZyA9IGZhbHNlO1xudmFyIGxhc3RIdWU7XG52YXIgd3JhcHBlclN0eWxlID0ge1xuXHRkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcblx0cGFkZGluZzogcGFkZGluZyArICdweCcsXG5cdGJveFNpemluZzogJ2NvbnRlbnQtYm94Jyxcblx0Ym9yZGVyUmFkaXVzOiAnNTAlJ1xufTtcbnZhciBtb3VzZURvd24gPSBmYWxzZTtcbnZhciBtb3VzZURvd25MaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdGlmIChldmVudC50YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ2NvbG9yLXBhbmVfX2NhbnZhcycpID49IDApIHtcblx0XHRtb3VzZURvd24gPSB0cnVlO1xuXHR9XG59O1xudmFyIG1vc3VlVXBMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdG1vdXNlRG93biA9IGZhbHNlO1xufTtcblxudmFyIERpc3BsYXlQYW5lID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkRpc3BsYXlQYW5lXCIsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0aHVlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0c2F0dXJhdGlvbjogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdGxpZ2h0bmVzczogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG5cdH0sXG5cblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHNpemUgPSBwYXJzZUludChkb21VdGlscy5nZXRTdHlsZSh0aGlzLmdldERPTU5vZGUoKSwgJ3dpZHRoJykpKzI7XG5cdFx0dmFyIGNhbnZhcyA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5zaGFkZVBhbmVDYW52YXMpO1xuXHRcdGNhbnZhcy53aWR0aCA9IHNpemU7XG5cdFx0Y2FudmFzLmhlaWdodCA9IHNpemU7XG5cdFx0dmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBcdHRoaXMucGFpbnQoY29udGV4dCk7XG4gICAgXHRsYXN0SHVlID0gdGhpcy5wcm9wcy5odWU7XG5cbiAgICBcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcHRpbWl6ZWRSZXNpemUnLCB0aGlzLnJlc2l6ZSlcbiAgICBcdGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgbW91c2VEb3duTGlzdGVuZXIpO1xuICAgIFx0ZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW9zdWVVcExpc3RlbmVyKTtcblx0fSxcblxuXHRjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKHByZXZQcm9wcykge1xuXHRcdGlmICghbW91c2VEb3duICYmIGxhc3RIdWUgIT0gdGhpcy5wcm9wcy5odWUpIHtcblx0XHRcdGxhc3RIdWUgPSB0aGlzLnByb3BzLmh1ZTtcblx0XHRcdHZhciBjb250ZXh0ID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLnNoYWRlUGFuZUNhbnZhcykuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBcdFx0dGhpcy5wYWludChjb250ZXh0KTtcblx0XHR9XG5cdH0sXG5cblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdvcHRpbWl6ZWRSZXNpemUnLCB0aGlzLnJlc2l6ZSk7XG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgbW91c2VEb3duTGlzdGVuZXIpO1xuICAgIFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vc3VlVXBMaXN0ZW5lcik7XG5cdH0sXG5cblx0cmVzaXplOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgblNpemUgPSBwYXJzZUludChkb21VdGlscy5nZXRTdHlsZSh0aGlzLmdldERPTU5vZGUoKSwgJ3dpZHRoJykpKzE7XG5cdFx0aWYgKHNpemUgIT0gblNpemUpIHtcblx0XHRcdHNpemUgPSBuU2l6ZTtcblx0XHRcdHZhciBjYW52YXMgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuc2hhZGVQYW5lQ2FudmFzKTtcblx0XHRcdGNhbnZhcy53aWR0aCA9IHNpemU7XG5cdFx0XHRjYW52YXMuaGVpZ2h0ID0gc2l6ZTtcblx0XHRcdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdCAgICBcdHRoaXMucGFpbnQoY29udGV4dCk7XG5cdFx0fVxuXHR9LFxuXG5cdHBhaW50OiBmdW5jdGlvbihjb250ZXh0KSB7XG5cdFx0aWYgKCFwYWludGluZykge1xuXHRcdFx0dmFyIGJpdG1hcCA9IGNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsMCxzaXplLHNpemUpO1xuXHRcdFx0dmFyIHIgPSBzaXplLzI7XG5cblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgc2l6ZTsgeSsrKSB7XG5cdFx0XHRcdHZhciBjMSA9IHkqeSAtIDIqeSpyICsgcipyO1xuXHRcdFx0XHR2YXIgeDEgPSAoMipyIC0gTWF0aC5zcXJ0KDQqcipyLTQqYzEpKS8yO1xuXHRcdFx0XHR2YXIgeDIgPSAoMipyICsgTWF0aC5zcXJ0KDQqcipyLTQqYzEpKS8yO1xuXG5cdCAgICBcdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBzaXplOyB4KyspIHtcblxuXHQgICAgXHRcdFx0aWYgKE1hdGguc3FydCgoeC1yKSooeC1yKSArICh5LXIpKih5LXIpKSA+IHIpIHtcblx0ICAgIFx0XHRcdFx0aHN2ID0gWzI1NSwyNTUsMjU1XTtcblx0ICAgIFx0XHRcdH0gZWxzZSB7XG5cdCAgICBcdFx0XHRcdHZhciBjMiA9ICggeCp4IC0gMip4KnIgKyByKnIpO1xuXHRcdCAgICBcdFx0XHR2YXIgeTEgPSAoMipyIC0gTWF0aC5zcXJ0KDQqcipyLTQqYzIpKS8yO1xuXHRcdFx0XHRcdFx0dmFyIHkyID0gKDIqciArIE1hdGguc3FydCg0KnIqci00KmMyKSkvMjtcblxuXHRcdCAgICBcdFx0XHR2YXIgb2Zmc2V0ID0gNCAqICgoeSAqIChzaXplKSkgKyB4KTtcblxuXHRcdCAgICBcdFx0XHR2YXIgaHVlID0gdGhpcy5wcm9wcy5odWU7XG5cdFx0ICAgIFx0XHRcdHZhciBzYXR1cmF0aW9uID0gKHkteTEpIC8gKHkyLXkxKTtcblx0XHQgICAgXHRcdFx0dmFyIGxpZ2h0bmVzcyA9ICh4LXgxKSAvICh4Mi14MSk7XG5cdCAgICBcdFx0XHRcdHZhciBoc3YgPSBjb2xvclV0aWxzLmhzbDJyZ2IoaHVlLCBzYXR1cmF0aW9uLCBsaWdodG5lc3MpO1xuXHQgICAgXHRcdFx0fVxuXG5cdCAgICBcdFx0XHRiaXRtYXAuZGF0YVtvZmZzZXQgKyAwXSA9IGhzdlswXTtcblx0ICAgICAgICAgICAgICAgIGJpdG1hcC5kYXRhW29mZnNldCArIDFdID0gaHN2WzFdO1xuXHQgICAgICAgICAgICAgICAgYml0bWFwLmRhdGFbb2Zmc2V0ICsgMl0gPSBoc3ZbMl07XG5cdCAgICAgICAgICAgICAgICBiaXRtYXAuZGF0YVtvZmZzZXQgKyAzXSA9IDI1NTsgLy8gbm8gdHJhbnNwYXJlbmN5XG5cblx0ICAgIFx0XHRcblx0ICAgICAgICAgICB9XG5cdCAgICAgICB9XG5cdCAgICAgICAgY29udGV4dC5wdXRJbWFnZURhdGEoYml0bWFwLCAwLCAwKTtcblx0ICAgICAgICBwYWludGluZyA9IGZhbHNlO1xuXHQgICAgfVxuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xuXHRcdFx0XHRjbGFzc05hbWU6IFwic2hhZGUtcGFuZVwiLCBcblx0XHRcdFx0c3R5bGU6IHdyYXBwZXJTdHlsZSwgXG5cdFx0XHRcdG9uTW91c2VNb3ZlOiB0aGlzLl9oYW5kbGVNb3VzZU1vdmV9LCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInNoYWRlLXBhbmVfX3dpbmRvd1wifSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiLCB7XG5cdFx0XHRcdFx0XHRpZDogXCJzaGFkZVwiLCBcblx0XHRcdFx0XHRcdGNsYXNzTmFtZTogXCJzaGFkZS1wYW5lX19jYW52YXNcIiwgXG5cdFx0XHRcdFx0XHRyZWY6IFwic2hhZGVQYW5lQ2FudmFzXCIsIFxuXHRcdFx0XHRcdFx0b25Nb3VzZURvd246IHRoaXMuX2hhbmRsZU1vdXNlRG93biwgXG5cdFx0XHRcdFx0XHRvbk1vdXNlTGVhdmU6IHRoaXMuX2hhbmRlTW91c2VMZWF2ZX1cblx0XHRcdFx0XHQpXG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXG5cdF9oYW5kbGVNb3VzZURvd246IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0YWN0aXZlID0gdHJ1ZTtcblx0XHR0aGlzLl9zZXRTaGFkZShldmVudCk7XG5cdFx0dmFyIG1vdXNlVXAgPSBmdW5jdGlvbigpIHtcblx0XHRcdGFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcCk7XG5cdFx0fTtcblx0XHRkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwKTtcblx0fSxcblxuXHRfaGFuZGxlTW91c2VMZWF2ZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRpZiAoYWN0aXZlKSB7XG5cdFx0XHR0aGlzLl9zZXRTaGFkZShldmVudCk7XG5cdFx0fVxuXHR9LFxuXG5cdF9oYW5kbGVNb3VzZU1vdmU6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgICBcdGlmIChub3cgPiBsYXN0TW92ZSArIG1vdmVUaHJvdHRsZSAmJiBhY3RpdmUpIHtcbiAgICAgIFx0XHRsYXN0TW92ZSA9IG5vdztcbiAgICAgIFx0XHR0aGlzLl9zZXRTaGFkZShldmVudCk7XG4gICAgICBcdH1cblx0fSxcblxuXHRfc2V0U2hhZGU6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHBvcyA9IGRvbVV0aWxzLm9mZnNldChSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuc2hhZGVQYW5lQ2FudmFzKSksXG5cdFx0XHR4ID0gZXZlbnQucGFnZVggLSBwb3MubGVmdCxcblx0XHRcdHkgPSBldmVudC5wYWdlWSAtIHBvcy50b3AsXG5cdFx0XHRyID0gc2l6ZS8yO1xuXG5cdFx0aWYgKE1hdGguc3FydChNYXRoLnBvdyh4LXIsMikgKyBNYXRoLnBvdyh5LXIsMikpID4gcil7XG5cdFx0XHRpZiAoTWF0aC5zcXJ0KE1hdGgucG93KHgtciwyKSArIE1hdGgucG93KHktciwyKSkgPiByK3BhZGRpbmcpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dmFyIG0gPSAoeS1yKS8oeC1yKSxcblx0XHRcdFx0bm9ybSA9IE1hdGguc3FydCgxICsgbSptKSxcblx0XHRcdFx0c2lnbiA9IHggPCByID8gLTEgOiAxO1xuXG5cdFx0XHR4ID0gciArIHNpZ24qKHIvbm9ybSk7XG5cdFx0XHR5ID0gciArIHNpZ24qKHIqbS9ub3JtKTtcblx0XHR9XG5cblx0XHR2YXIgYzEgPSB5KnkgLSAyKnkqciArIHIqcixcblx0XHRcdHgxID0gKDIqciAtIE1hdGguc3FydCg0KnIqci00KmMxKSkvMixcblx0XHRcdHgyID0gKDIqciArIE1hdGguc3FydCg0KnIqci00KmMxKSkvMixcblx0XHRcdGMyID0gKCB4KnggLSAyKngqciArIHIqciksXG5cdFx0XHR5MSA9ICgyKnIgLSBNYXRoLnNxcnQoNCpyKnItNCpjMikpLzIsXG5cdFx0XHR5MiA9ICgyKnIgKyBNYXRoLnNxcnQoNCpyKnItNCpjMikpLzI7XG5cblx0XHR2YXIgc2F0dXJhdGlvbiA9ICh5LXkxKSAvICh5Mi15MSk7XG5cdFx0dmFyIGxpZ2h0bmVzcyA9ICh4LXgxKSAvICh4Mi14MSk7XG5cdFx0Q29sb3JBY3Rpb25zLnVwZGF0ZVNhdHVyYXRpb24oK3NhdHVyYXRpb24udG9GaXhlZCgyKSk7XG5cdFx0Q29sb3JBY3Rpb25zLnVwZGF0ZUxpZ2h0bmVzcygrbGlnaHRuZXNzLnRvRml4ZWQoMikpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXNwbGF5UGFuZTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEhzbERpc3BsYXkgPSByZXF1aXJlKCcuL0hzbERpc3BsYXkucmVhY3QnKTtcbnZhciBSZ2JEaXNwbGF5PSByZXF1aXJlKCcuL1JnYkRpc3BsYXkucmVhY3QnKTtcbnZhciBIZXhEaXNwbGF5ID0gcmVxdWlyZSgnLi9IZXhEaXNwbGF5LnJlYWN0Jyk7XG52YXIgVHJhbnNwYXJlbmN5SW5wdXQgPSByZXF1aXJlKCcuL1RyYW5zcGFyZW5jeUlucHV0LnJlYWN0Jyk7XG52YXIgY29sb3JVdGlsID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvY29sb3JVdGlsJyk7XG5cbnZhciBzdHlsZSA9IHtcblx0YmFja2dyb3VuZENvbG9yOiAnJ1xufVxuXG52YXIgQ29udHJvbFBhbmUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQ29udHJvbFBhbmVcIixcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRodWU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRzYXR1cmF0aW9uOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0bGlnaHRuZXNzOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0YWxwaGE6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRhbHBoYUVuYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWRcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjJyArIGNvbG9yVXRpbC5oc2wyaGV4KHRoaXMucHJvcHMuaHVlLCB0aGlzLnByb3BzLnNhdHVyYXRpb24sIHRoaXMucHJvcHMubGlnaHRuZXNzKTtcblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7c3R5bGU6IHN0eWxlLCBjbGFzc05hbWU6IFwicGlja2VyLWlucHV0c1wifSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwaWNrZXItaW5wdXRzX19pbm5lclwifSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChIc2xEaXNwbGF5LCB7Y29sb3I6IFt0aGlzLnByb3BzLmh1ZSwgdGhpcy5wcm9wcy5zYXR1cmF0aW9uLCB0aGlzLnByb3BzLmxpZ2h0bmVzc119KSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChSZ2JEaXNwbGF5LCB7Y29sb3I6IFt0aGlzLnByb3BzLmh1ZSwgdGhpcy5wcm9wcy5zYXR1cmF0aW9uLCB0aGlzLnByb3BzLmxpZ2h0bmVzc10sIGFscGhhOiB0aGlzLnByb3BzLmFscGhhLCBhbHBoYUVuYWJsZWQ6IHRoaXMucHJvcHMuYWxwaGFFbmFibGVkfSksIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoSGV4RGlzcGxheSwge2NvbG9yOiBbdGhpcy5wcm9wcy5odWUsIHRoaXMucHJvcHMuc2F0dXJhdGlvbiwgdGhpcy5wcm9wcy5saWdodG5lc3NdfSksIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHJhbnNwYXJlbmN5SW5wdXQsIHtoYXNUcmFuc3BhcmVuY3k6IHRoaXMucHJvcHMuYWxwaGFFbmFibGVkLCBhbHBoYTogdGhpcy5wcm9wcy5hbHBoYX0pXG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xQYW5lOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIENvbG9yQWN0aW9ucyA9IHJlcXVpcmUoJy4vLi4vLi4vYWN0aW9ucy9Db2xvckFjdGlvbnMnKTtcbnZhciBjb2xvclV0aWxzID0gcmVxdWlyZSgnLi8uLi8uLi91dGlscy9jb2xvclV0aWwnKTtcbnZhciBIZXhJbnB1dCA9IHJlcXVpcmUoJy4vSGV4SW5wdXQucmVhY3QnKTtcblxuXG52YXIgSGV4RGlzcGxheSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJIZXhEaXNwbGF5XCIsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5udW1iZXIpLmlzUmVxdWlyZWRcblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRpc0VkaXRpbmc6IGZhbHNlLFxuXHRcdFx0aXNDb3B5aW5nOiBmYWxzZVxuXHRcdH07XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgaGV4ID0gY29sb3JVdGlscy5oc2wyaGV4KHRoaXMucHJvcHMuY29sb3JbMF0sIHRoaXMucHJvcHMuY29sb3JbMV0sIHRoaXMucHJvcHMuY29sb3JbMl0pO1xuXHRcdHZhciBpbnB1dDtcblxuXHRcdGlmICh0aGlzLnN0YXRlLmlzRWRpdGluZykge1xuXHRcdFx0aW5wdXQgPSBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChIZXhJbnB1dCwge1xuXHRcdFx0XHRcdG9uU2F2ZTogdGhpcy5fb25TYXZlLCBcblx0XHRcdFx0XHRoZXg6IGhleH1cblx0XHRcdFx0KTtcblx0XHR9XG5cdFx0Ly9cblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XG5cdFx0XHRcdGNsYXNzTmFtZTogY2xhc3NOYW1lcygnY29sb3ItaW5wdXQnLCB7XG5cdFx0XHRcdFx0J2VkaXRpbmcnOiB0aGlzLnN0YXRlLmlzRWRpdGluZyxcblx0XHRcdFx0XHQnY29weWluZyc6IHRoaXMuc3RhdGUuaXNDb3B5aW5nXG5cdFx0XHRcdH0pfSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbG9yLWlucHV0X19sYWJlbFwifSwgXCJIZXhcIiwgXG5cdFx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcImNvbG9yLWlucHV0X19jb3B5LWJ1dHRvblwiLCBvbkNsaWNrOiB0aGlzLl9vcGVuQ29weX0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwge3NyYzogXCJodHRwOi8vcmlja3lzYW5kb3ZhbC5naXRodWIuaW8vY29sb3JwYW5lL2ltZy9jb3B5LnBuZ1wifSkpLCBcblx0XHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtcblx0XHRcdFx0XHRcdFx0Y2xhc3NOYW1lOiBcImNvbG9yLWlucHV0X19jb3B5LXRleHRcIn0sIFxuXHRcdFx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlOiAnIycgKyBoZXgsIFxuXHRcdFx0XHRcdFx0XHRcdG9uQmx1cjogdGhpcy5fY2xvc2VDb3B5LCBcblx0XHRcdFx0XHRcdFx0XHRyZWY6IFwiY29weVRleHRcIiwgcmVhZE9ubHk6IHRydWV9KVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdCksIFxuXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XG5cdFx0XHRcdFx0XHRjbGFzc05hbWU6IFwiY29sb3ItaW5wdXRfX2Rpc3BsYXlcIiwgXG5cdFx0XHRcdFx0XHRvbkRvdWJsZUNsaWNrOiB0aGlzLl9vcGVuRWRpdH0sIFwiI1wiLCBoZXggKVxuXHRcdFx0XHQpLCBcblx0XHRcdFx0aW5wdXRcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXG5cdF9jbG9zZUNvcHk6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe2lzQ29weWluZzogZmFsc2V9KTtcblx0fSxcblxuXHRfb3BlbkNvcHk6IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnNvbGUubG9nKCdvcGVuIGNvcHknKTtcblx0XHR2YXIgaW5wdXQgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuY29weVRleHQpO1xuXHRcdGlmICghdGhpcy5zdGF0ZS5pc0NvcHlpbmcpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe2lzQ29weWluZzogdHJ1ZX0pO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRpbnB1dC5mb2N1cygpO1xuXHRcdFx0XHRpbnB1dC5zZWxlY3QoKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRpbnB1dC5zZWxlY3QoKTtcblx0XHR9KTtcblx0fSxcblxuXHRfb3BlbkVkaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe2lzRWRpdGluZzogdHJ1ZX0pO1xuXHR9LFxuXG5cdF9vbkRvdWJsZUNsaWNrOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtpc0VkaXRpbmc6IHRydWV9KTtcblx0fSxcblxuXHRfb25TYXZlOiBmdW5jdGlvbihoZXgsIGtlZXBPcGVuKSB7XG5cdFx0Q29sb3JBY3Rpb25zLnVwZGF0ZUhleChoZXgpO1xuXHRcdGlmICgha2VlcE9wZW4pe1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7aXNFZGl0aW5nOiBmYWxzZX0pO1xuXHRcdH1cblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBIZXhEaXNwbGF5OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgY29sb3JVdGlsID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvY29sb3JVdGlsJyk7XG5cbnZhciBIZXhJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJIZXhJbnB1dFwiLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdG9uU2F2ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblx0XHRoZXg6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB0aGlzLnByb3BzLmhleCB8fCAnJ1xuXHRcdH07XG5cdH0sXG5cblx0Y29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbihwcmV2UHJvcHMpIHtcblx0XHRpZiAocHJldlByb3BzLmhleCAhPSB0aGlzLnByb3BzLmhleCkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdHZhbHVlOiB0aGlzLnByb3BzLmhleFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XG5cdFx0XHRcdHZhbHVlOiB0aGlzLnN0YXRlLnZhbHVlLCBcblx0XHRcdFx0b25LZXlEb3duOiB0aGlzLl9oYW5kbGVLZXlEb3duLCBcblx0XHRcdFx0b25DaGFuZ2U6IHRoaXMuX29uQ2hhbmdlfVxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cdC8vY29tbWVudFxuXHRfaGFuZGxlS2V5RG93bjogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcblx0XHRcdHRoaXMuX3NhdmUoKTtcblx0XHR9XG5cdH0sXG5cblx0X29uQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0dmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZVxuXHRcdH0sIHRoaXMuX2NoYW5nZUNhbGxiYWNrKTtcblx0fSxcblxuXHRfY2hhbmdlQ2FsbGJhY2s6IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKGNvbG9yVXRpbC5oZXgyaHNsKHRoaXMuc3RhdGUudmFsdWUpKXtcblx0XHRcdHRoaXMucHJvcHMub25TYXZlKHRoaXMuc3RhdGUudmFsdWUsIHRydWUpO1xuXHRcdH1cblx0fSxcblxuXHRfc2F2ZTogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKGNvbG9yVXRpbC5oZXgyaHNsKHRoaXMuc3RhdGUudmFsdWUpKXtcblx0XHRcdHRoaXMucHJvcHMub25TYXZlKHRoaXMuc3RhdGUudmFsdWUpO1xuXHRcdH1cblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSGV4SW5wdXQ7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgQ29sb3JBY3Rpb25zID0gcmVxdWlyZSgnLi8uLi8uLi9hY3Rpb25zL0NvbG9yQWN0aW9ucycpO1xudmFyIEhzbElucHV0ID0gcmVxdWlyZSgnLi9Ic2xJbnB1dC5yZWFjdCcpO1xudmFyIGdVdGlsID0gcmVxdWlyZSgnLi8uLi8uLi91dGlscy9nZW5lcmFsVXRpbCcpO1xuXG52YXIgSHNsRGlzcGxheSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJIc2xEaXNwbGF5XCIsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5udW1iZXIpLmlzUmVxdWlyZWRcblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRpc0VkaXRpbmc6IGZhbHNlXG5cdFx0fTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBoc2wgPSB0aGlzLnByb3BzLmNvbG9yXG5cdFx0dmFyIGlucHV0O1xuXG5cdFx0aWYgKHRoaXMuc3RhdGUuaXNFZGl0aW5nKSB7XG5cdFx0XHRpbnB1dCA9XG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoSHNsSW5wdXQsIHtcblx0XHRcdFx0XHRvblNhdmU6IHRoaXMuX29uU2F2ZSwgXG5cdFx0XHRcdFx0aDogZ1V0aWwucm91bmQoaHNsWzBdKSwgXG5cdFx0XHRcdFx0czogZ1V0aWwucm91bmQoaHNsWzFdKSwgXG5cdFx0XHRcdFx0bDogZ1V0aWwucm91bmQoaHNsWzJdKX1cblx0XHRcdFx0KTtcblx0XHR9XG5cdFx0Ly9cblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBjbGFzc05hbWVzKCdjb2xvci1pbnB1dCcsIHtcblx0XHRcdFx0J2VkaXRpbmcnOiB0aGlzLnN0YXRlLmlzRWRpdGluZ1xuXHRcdFx0XHR9KX0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtvbkRvdWJsZUNsaWNrOiB0aGlzLl9vbkRvdWJsZUNsaWNrfSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbG9yLWlucHV0X19sYWJlbFwifSwgXCJIU0xcIiksIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb2xvci1pbnB1dF9fZGlzcGxheVwifSwgZ1V0aWwucm91bmQoaHNsWzBdKSwgXCIsIFwiLCBnVXRpbC5yb3VuZChoc2xbMV0pLCBcIiwgXCIsIGdVdGlsLnJvdW5kKGhzbFsyXSkpXG5cdFx0XHRcdCksIFxuXHRcdFx0XHRpbnB1dFxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cblx0X29uRG91YmxlQ2xpY2s6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe2lzRWRpdGluZzogdHJ1ZX0pO1xuXHR9LFxuXG5cdF9vblNhdmU6IGZ1bmN0aW9uKGhzbCwga2VlcE9wZW4pIHtcblx0XHRDb2xvckFjdGlvbnMudXBkYXRlSHNsKGhzbCk7XG5cdFx0aWYgKCFrZWVwT3Blbil7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtpc0VkaXRpbmc6IGZhbHNlfSk7XG5cdFx0fVxuXHR9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhzbERpc3BsYXk7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIEhzbElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkhzbElucHV0XCIsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0b25TYXZlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXHRcdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRzOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0bDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0aDogdGhpcy5wcm9wcy5oIHx8IDAsXG5cdFx0XHRzOiB0aGlzLnByb3BzLnMgfHwgMCxcblx0XHRcdGw6IHRoaXMucHJvcHMubCB8fCAwXG5cdFx0fTtcblx0fSxcblxuXHRjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKHByZXZQcm9wcykge1xuXHRcdGlmIChwcmV2UHJvcHMuaCAhPSB0aGlzLnByb3BzLmggfHwgcHJldlByb3BzLnMgIT0gdGhpcy5wcm9wcy5zIHx8IHByZXZQcm9wcy5sICE9IHRoaXMucHJvcHMubCkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGg6IHRoaXMucHJvcHMuaCxcblx0XHRcdFx0czogdGhpcy5wcm9wcy5zLFxuXHRcdFx0XHRsOiB0aGlzLnByb3BzLmxcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiaHNsLWlucHV0XCJ9LCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0XHRcdFx0XHRtaW46IFwiMFwiLCBcblx0XHRcdFx0XHRtYXg6IFwiMzYwXCIsIFxuXHRcdFx0XHRcdHR5cGU6IFwibnVtYmVyXCIsIFxuXHRcdFx0XHRcdHZhbHVlOiB0aGlzLnN0YXRlLmgsIFxuXHRcdFx0XHRcdG9uS2V5RG93bjogdGhpcy5faGFuZGxlS2V5RG93biwgXG5cdFx0XHRcdFx0b25DaGFuZ2U6IHRoaXMuX29uQ2hhbmdlLCBcblx0XHRcdFx0XHRyZWY6IFwiaElucHV0XCJ9XG5cdFx0XHRcdCksIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge1xuXHRcdFx0XHRcdG1pbjogXCIwXCIsIFxuXHRcdFx0XHRcdG1heDogXCIxXCIsIFxuXHRcdFx0XHRcdHN0ZXA6IFwiLjFcIiwgXG5cdFx0XHRcdFx0dHlwZTogXCJudW1iZXJcIiwgXG5cdFx0XHRcdFx0dmFsdWU6IHRoaXMuc3RhdGUucywgXG5cdFx0XHRcdFx0b25LZXlEb3duOiB0aGlzLl9oYW5kbGVLZXlEb3duLCBcblx0XHRcdFx0XHRvbkNoYW5nZTogdGhpcy5fb25DaGFuZ2UsIFxuXHRcdFx0XHRcdHJlZjogXCJzSW5wdXRcIn1cblx0XHRcdFx0KSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XG5cdFx0XHRcdFx0bWluOiBcIjBcIiwgXG5cdFx0XHRcdFx0bWF4OiBcIjFcIiwgXG5cdFx0XHRcdFx0c3RlcDogXCIuMVwiLCBcblx0XHRcdFx0XHR0eXBlOiBcIm51bWJlclwiLCBcblx0XHRcdFx0XHR2YWx1ZTogdGhpcy5zdGF0ZS5sLCBcblx0XHRcdFx0XHRvbktleURvd246IHRoaXMuX2hhbmRsZUtleURvd24sIFxuXHRcdFx0XHRcdG9uQ2hhbmdlOiB0aGlzLl9vbkNoYW5nZSwgXG5cdFx0XHRcdFx0cmVmOiBcImxJbnB1dFwifVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblx0Ly9jb21tZW50XG5cdF9oYW5kbGVLZXlEb3duOiBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuXHRcdFx0dGhpcy5fc2F2ZSgpO1xuXHRcdH1cblx0fSxcblxuXHRfb25DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRoOiBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuaElucHV0KS52YWx1ZUFzTnVtYmVyLFxuXHRcdFx0czogUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLnNJbnB1dCkudmFsdWVBc051bWJlcixcblx0XHRcdGw6IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5sSW5wdXQpLnZhbHVlQXNOdW1iZXJcblx0XHR9LCB0aGlzLl9zYXZlLmJpbmQodGhpcywgdHJ1ZSkpO1xuXHR9LFxuXG5cdF9zYXZlOiBmdW5jdGlvbihrZWVwT3Blbikge1xuXHRcdHRoaXMucHJvcHMub25TYXZlKFtcblx0XHRcdE1hdGgubWluKE1hdGgubWF4KHRoaXMuc3RhdGUuaCwgMCksIDM2MCksXG5cdFx0XHRNYXRoLm1pbihNYXRoLm1heCh0aGlzLnN0YXRlLnMsIDApLCAxKSxcblx0XHRcdE1hdGgubWluKE1hdGgubWF4KHRoaXMuc3RhdGUubCwgMCksIDEpXG5cdFx0XSwga2VlcE9wZW4pO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBIc2xJbnB1dDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbnZhciBDb2xvckFjdGlvbnMgPSByZXF1aXJlKCcuLy4uLy4uL2FjdGlvbnMvQ29sb3JBY3Rpb25zJyk7XG52YXIgY29sb3JVdGlscyA9IHJlcXVpcmUoJy4vLi4vLi4vdXRpbHMvY29sb3JVdGlsJyk7XG52YXIgZ1V0aWwgPSByZXF1aXJlKCcuLy4uLy4uL3V0aWxzL2dlbmVyYWxVdGlsJyk7XG52YXIgUmdiSW5wdXQgPSByZXF1aXJlKCcuL1JnYklucHV0LnJlYWN0Jyk7XG5cbnZhciBSZ2JEaXNwbGF5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlJnYkRpc3BsYXlcIixcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRjb2xvcjogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm51bWJlcikuaXNSZXF1aXJlZCxcblx0XHRhbHBoYTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdGFscGhhRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZFxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGlzRWRpdGluZzogZmFsc2UsXG5cdFx0XHRpc0NvcHlpbmc6IGZhbHNlXG5cdFx0fTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciByZ2IgPSBjb2xvclV0aWxzLmhzbDJyZ2IodGhpcy5wcm9wcy5jb2xvclswXSwgdGhpcy5wcm9wcy5jb2xvclsxXSwgdGhpcy5wcm9wcy5jb2xvclsyXSk7XG5cdFx0dmFyIGlucHV0O1xuXG5cdFx0aWYgKHRoaXMuc3RhdGUuaXNFZGl0aW5nKSB7XG5cdFx0XHRpbnB1dCA9XG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmdiSW5wdXQsIHtcblx0XHRcdFx0XHRvblNhdmU6IHRoaXMuX29uU2F2ZSwgXG5cdFx0XHRcdFx0cjogZ1V0aWwucm91bmQocmdiWzBdKSwgXG5cdFx0XHRcdFx0ZzogZ1V0aWwucm91bmQocmdiWzFdKSwgXG5cdFx0XHRcdFx0YjogZ1V0aWwucm91bmQocmdiWzJdKSwgXG5cdFx0XHRcdFx0YWxwaGE6IHRoaXMucHJvcHMuYWxwaGEsIFxuXHRcdFx0XHRcdGFscGhhRW5hYmxlZDogdGhpcy5wcm9wcy5hbHBoYUVuYWJsZWR9XG5cdFx0XHRcdCk7XG5cdFx0fVxuXHRcdC8vXG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogY2xhc3NOYW1lcygnY29sb3ItaW5wdXQnLCB7XG5cdFx0XHRcdCdlZGl0aW5nJzogdGhpcy5zdGF0ZS5pc0VkaXRpbmcsXG5cdFx0XHRcdCdjb3B5aW5nJzogdGhpcy5zdGF0ZS5pc0NvcHlpbmdcblx0XHRcdFx0fSl9LCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29sb3ItaW5wdXRfX2xhYmVsXCJ9LCBcblx0XHRcdFx0XHRcdFwiUkdCXCIsIHRoaXMucHJvcHMuYWxwaGFFbmFibGVkID8gJ2EnIDogJycsIFxuXHRcdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJjb2xvci1pbnB1dF9fY29weS1idXR0b25cIiwgb25DbGljazogdGhpcy5fb3BlbkNvcHl9LCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHtzcmM6IFwiaHR0cDovL3JpY2t5c2FuZG92YWwuZ2l0aHViLmlvL2NvbG9ycGFuZS9pbWcvY29weS5wbmdcIn0pKSwgXG5cdFx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7XG5cdFx0XHRcdFx0XHRcdGNsYXNzTmFtZTogXCJjb2xvci1pbnB1dF9fY29weS10ZXh0XCJ9LCBcblx0XHRcdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogdGhpcy5fcHJpbnRSZ2IocmdiKSwgXG5cdFx0XHRcdFx0XHRcdFx0b25CbHVyOiB0aGlzLl9jbG9zZUNvcHksIFxuXHRcdFx0XHRcdFx0XHRcdHJlZjogXCJjb3B5VGV4dFwiLCByZWFkT25seTogdHJ1ZX0pXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XG5cdFx0XHRcdFx0XHRjbGFzc05hbWU6IFwiY29sb3ItaW5wdXRfX2Rpc3BsYXlcIiwgXG5cdFx0XHRcdFx0XHRvbkRvdWJsZUNsaWNrOiB0aGlzLl9vcGVuRWRpdH0sIFxuXHRcdFx0XHRcdFx0Z1V0aWwucm91bmQocmdiWzBdKSwgXCIsIFwiLCBnVXRpbC5yb3VuZChyZ2JbMV0pLCBcIiwgXCIsIGdVdGlsLnJvdW5kKHJnYlsyXSksIHRoaXMucHJvcHMuYWxwaGFFbmFibGVkID8gJywgJyt0aGlzLnByb3BzLmFscGhhIDogJydcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCksIFxuXHRcdFx0XHRpbnB1dFxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cblx0X2Nsb3NlQ29weTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7aXNDb3B5aW5nOiBmYWxzZX0pO1xuXHR9LFxuXG5cdF9vcGVuQ29weTogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGlucHV0ID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmNvcHlUZXh0KTtcblx0XHRpZiAoIXRoaXMuc3RhdGUuaXNDb3B5aW5nKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtpc0NvcHlpbmc6IHRydWV9KTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0aW5wdXQuZm9jdXMoKTtcblx0XHRcdFx0aW5wdXQuc2VsZWN0KCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0aW5wdXQuc2VsZWN0KCk7XG5cdFx0fSk7XG5cdH0sXG5cblx0X29wZW5FZGl0OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtpc0VkaXRpbmc6IHRydWV9KTtcblx0fSxcblxuXHRfcHJpbnRSZ2I6IGZ1bmN0aW9uKHJnYikge1xuXHRcdHZhciB0ZXh0ID0gJ3JnYicgKyBcblx0XHRcdFx0XHQodGhpcy5wcm9wcy5hbHBoYUVuYWJsZWQgPyAnYScgOiAnJykgKyBcblx0XHRcdFx0XHQnKCcgKyBnVXRpbC5yb3VuZChyZ2JbMF0pICsgJywnICtcblx0XHRcdFx0XHRnVXRpbC5yb3VuZChyZ2JbMV0pICsgJywnICtcblx0XHRcdFx0XHRnVXRpbC5yb3VuZChyZ2JbMl0pICsgXG5cdFx0XHRcdFx0KHRoaXMucHJvcHMuYWxwaGFFbmFibGVkID8gKCcsICcgK3RoaXMucHJvcHMuYWxwaGEpIDogJycpICsgJyknO1xuXHRcdHJldHVybiB0ZXh0O1xuXHR9LFxuXG5cdF9vblNhdmU6IGZ1bmN0aW9uKHJnYiwga2VlcE9wZW4pIHtcblx0XHRDb2xvckFjdGlvbnMudXBkYXRlUmdiKHJnYik7XG5cdFx0aWYgKCFrZWVwT3Blbil7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtpc0VkaXRpbmc6IGZhbHNlfSk7XG5cdFx0fVxuXHR9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJnYkRpc3BsYXk7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgUmdiSW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiUmdiSW5wdXRcIixcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRvblNhdmU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cdFx0cjogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdGc6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRiOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cdFx0YWxwaGE6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRhbHBoYUVuYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWRcblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyOiB0aGlzLnByb3BzLnIgfHwgMCxcblx0XHRcdGc6IHRoaXMucHJvcHMuZyB8fCAwLFxuXHRcdFx0YjogdGhpcy5wcm9wcy5iIHx8IDAsXG5cdFx0XHRhOiB0aGlzLnByb3BzLmFscGhhIHx8IDBcblx0XHR9O1xuXHR9LFxuXG5cdGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24ocHJldlByb3BzKSB7XG5cdFx0aWYgKHByZXZQcm9wcy5yICE9IHRoaXMucHJvcHMuciB8fCBwcmV2UHJvcHMuZyAhPSB0aGlzLnByb3BzLmcgfHwgcHJldlByb3BzLmIgIT0gdGhpcy5wcm9wcy5iKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0cjogdGhpcy5wcm9wcy5yLFxuXHRcdFx0XHRnOiB0aGlzLnByb3BzLmcsXG5cdFx0XHRcdGI6IHRoaXMucHJvcHMuYixcblx0XHRcdFx0YTogdGhpcy5wcm9wcy5hbHBoYVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogY2xhc3NOYW1lcyhcInJnYi1pbnB1dFwiLCB7XCJhbHBoYS1lbmFibGVkXCI6IHRoaXMucHJvcHMuYWxwaGFFbmFibGVkfSl9LCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0XHRcdFx0XHRtaW46IFwiMFwiLCBcblx0XHRcdFx0XHRtYXg6IFwiMjU1XCIsIFxuXHRcdFx0XHRcdHR5cGU6IFwibnVtYmVyXCIsIFxuXHRcdFx0XHRcdHZhbHVlOiB0aGlzLnN0YXRlLnIsIFxuXHRcdFx0XHRcdG9uS2V5RG93bjogdGhpcy5faGFuZGxlS2V5RG93biwgXG5cdFx0XHRcdFx0b25DaGFuZ2U6IHRoaXMuX29uQ2hhbmdlLCBcblx0XHRcdFx0XHRyZWY6IFwicklucHV0XCJ9XG5cdFx0XHRcdCksIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge1xuXHRcdFx0XHRcdG1pbjogXCIwXCIsIFxuXHRcdFx0XHRcdG1heDogXCIyNTVcIiwgXG5cdFx0XHRcdFx0dHlwZTogXCJudW1iZXJcIiwgXG5cdFx0XHRcdFx0dmFsdWU6IHRoaXMuc3RhdGUuZywgXG5cdFx0XHRcdFx0b25LZXlEb3duOiB0aGlzLl9oYW5kbGVLZXlEb3duLCBcblx0XHRcdFx0XHRvbkNoYW5nZTogdGhpcy5fb25DaGFuZ2UsIFxuXHRcdFx0XHRcdHJlZjogXCJnSW5wdXRcIn1cblx0XHRcdFx0KSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XG5cdFx0XHRcdFx0bWluOiBcIjBcIiwgXG5cdFx0XHRcdFx0bWF4OiBcIjI1NVwiLCBcblx0XHRcdFx0XHR0eXBlOiBcIm51bWJlclwiLCBcblx0XHRcdFx0XHR2YWx1ZTogdGhpcy5zdGF0ZS5iLCBcblx0XHRcdFx0XHRvbktleURvd246IHRoaXMuX2hhbmRsZUtleURvd24sIFxuXHRcdFx0XHRcdG9uQ2hhbmdlOiB0aGlzLl9vbkNoYW5nZSwgXG5cdFx0XHRcdFx0cmVmOiBcImJJbnB1dFwifVxuXHRcdFx0XHQpLCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0XHRcdFx0XHRjbGFzc05hbWU6IFwicmdiLWlucHV0X19hbHBoYVwiLCBcblx0XHRcdFx0XHRtaW46IFwiMFwiLCBcblx0XHRcdFx0XHRtYXg6IFwiMVwiLCBcblx0XHRcdFx0XHR0eXBlOiBcIm51bWJlclwiLCBcblx0XHRcdFx0XHRzdGVwOiBcIi4xXCIsIFxuXHRcdFx0XHRcdHZhbHVlOiB0aGlzLnN0YXRlLmEsIFxuXHRcdFx0XHRcdG9uS2V5RG93bjogdGhpcy5faGFuZGxlS2V5RG93biwgXG5cdFx0XHRcdFx0b25DaGFuZ2U6IHRoaXMuX29uQ2hhbmdlLCBcblx0XHRcdFx0XHRyZWY6IFwiYUlucHV0XCJ9XG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXHQvL2NvbW1lbnRcblx0X2hhbmRsZUtleURvd246IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG5cdFx0XHR0aGlzLl9zYXZlKCk7XG5cdFx0fVxuXHR9LFxuXG5cdF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRyOiBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMucklucHV0KS52YWx1ZUFzTnVtYmVyLFxuXHRcdFx0ZzogUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmdJbnB1dCkudmFsdWVBc051bWJlcixcblx0XHRcdGI6IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5iSW5wdXQpLnZhbHVlQXNOdW1iZXIsXG5cdFx0XHRhOiBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuYUlucHV0KS52YWx1ZUFzTnVtYmVyXG5cdFx0fSwgdGhpcy5fc2F2ZS5iaW5kKHRoaXMsIHRydWUpKTtcblx0fSxcblxuXHRfc2F2ZTogZnVuY3Rpb24oa2VlcE9wZW4pIHtcblx0XHR0aGlzLnByb3BzLm9uU2F2ZShbXG5cdFx0XHRNYXRoLm1pbihNYXRoLm1heCh0aGlzLnN0YXRlLnIgfHwgMCwgMCksIDI1NSksXG5cdFx0XHRNYXRoLm1pbihNYXRoLm1heCh0aGlzLnN0YXRlLmcgfHwgMCwgMCksIDI1NSksXG5cdFx0XHRNYXRoLm1pbihNYXRoLm1heCh0aGlzLnN0YXRlLmIgfHwgMCwgMCksIDI1NSksXG5cdFx0XHRNYXRoLm1pbihNYXRoLm1heCh0aGlzLnN0YXRlLmEgfHwgMCwgMCksIDEpXG5cdFx0XSwga2VlcE9wZW4pO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZ2JJbnB1dDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgQ29sb3JBY3Rpb25zID0gcmVxdWlyZSgnLi8uLi8uLi9hY3Rpb25zL0NvbG9yQWN0aW9ucycpO1xuXG52YXIgVHJhbnNwYXJlbmN5SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVHJhbnNwYXJlbmN5SW5wdXRcIixcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRhbHBoYTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdGhhc1RyYW5zcGFyZW5jeTogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZFxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGlzRWRpdGluZzogZmFsc2UsXG5cdFx0XHRoYXNUcmFuc3BhcmVuY3k6IHRoaXMucHJvcHMuaGFzVHJhbnNwYXJlbmN5IHx8IGZhbHNlLFxuXHRcdFx0YWxwaGE6IHRoaXMucHJvcHMuYWxwaGEgfHwgMVxuXHRcdH07XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgaW5wdXQ7XG5cdFx0dmFyIGRpc3BsYXk7XG5cdFx0dmFyIGNoZWNrZWQ7XG5cdFx0aWYgKHRoaXMuc3RhdGUuaGFzVHJhbnNwYXJlbmN5KXtcblx0XHRcdGlmICh0aGlzLnN0YXRlLmlzRWRpdGluZykge1xuXHRcdFx0XHRpbnB1dCA9XG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0XHRcdFx0XHRcdHR5cGU6IFwibnVtYmVyXCIsIFxuXHRcdFx0XHRcdFx0bWluOiBcIjBcIiwgXG5cdFx0XHRcdFx0XHRtYXg6IFwiMVwiLCBcblx0XHRcdFx0XHRcdHN0ZXA6IFwiLjFcIiwgXG5cdFx0XHRcdFx0XHR2YWx1ZTogdGhpcy5zdGF0ZS5hbHBoYSwgXG5cdFx0XHRcdFx0XHRvbktleURvd246IHRoaXMuX2hhbmRsZUtleURvd24sIFxuXHRcdFx0XHRcdFx0b25DaGFuZ2U6IHRoaXMuX29uQWxwaGFDaGFuZ2V9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvL1xuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IGNsYXNzTmFtZXMoJ2NvbG9yLWlucHV0JywgJ3RyYW5zcGFyZW5jeS1pbnB1dCcsIHtcblx0XHRcdFx0J2VkaXRpbmcnOiB0aGlzLnN0YXRlLmlzRWRpdGluZyxcblx0XHRcdFx0J2VuYWJsZWQnOiB0aGlzLnN0YXRlLmhhc1RyYW5zcGFyZW5jeVxuXHRcdFx0XHR9KVxuXHRcdFx0fSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb2xvci1pbnB1dF9fbGFiZWxcIn0sIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtvbkRvdWJsZUNsaWNrOiB0aGlzLl9vbkRvdWJsZUNsaWNrfSwgXCJUcmFuc3BhcmVuY3lcIiksIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XG5cdFx0XHRcdFx0XHR0eXBlOiBcImNoZWNrYm94XCIsIFxuXHRcdFx0XHRcdFx0b25DaGFuZ2U6IHRoaXMuX29uRW5hYmxlZENoYW5nZSwgXG5cdFx0XHRcdFx0XHRjaGVja2VkOiB0aGlzLnN0YXRlLmhhc1RyYW5zcGFyZW5jeX1cblx0XHRcdFx0XHQgKVxuXHRcdFx0XHQpLCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbG9yLWlucHV0X19kaXNwbGF5XCIsIG9uRG91YmxlQ2xpY2s6IHRoaXMuX29uRG91YmxlQ2xpY2t9LCB0aGlzLnByb3BzLmFscGhhKSwgXG5cdFx0XHRcdGlucHV0XG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblxuXHRfb25Eb3VibGVDbGljazogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUuaGFzVHJhbnNwYXJlbmN5KXtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc0VkaXRpbmc6IHRydWVcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRfaGFuZGxlS2V5RG93bjogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcblx0XHRcdHRoaXMuX3NhdmUoKTtcblx0XHR9XG5cdH0sXG5cblx0X29uQWxwaGFDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRhbHBoYTogZXZlbnQudGFyZ2V0LnZhbHVlXG5cdFx0fSwgdGhpcy5fc2F2ZS5iaW5kKHRoaXMsdHJ1ZSkpO1xuXHR9LFxuXG5cdF9vbkVuYWJsZWRDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUuaGFzVHJhbnNwYXJlbmN5KSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aXNFZGl0aW5nOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0aGFzVHJhbnNwYXJlbmN5OiAhdGhpcy5zdGF0ZS5oYXNUcmFuc3BhcmVuY3lcblx0XHR9LCB0aGlzLl9zYXZlRW5hYmxlZCk7XG5cdH0sXG5cblx0X3NhdmVFbmFibGVkOiBmdW5jdGlvbigpe1xuXHRcdENvbG9yQWN0aW9ucy51cGRhdGVBbHBoYUVuYWJsZWQodGhpcy5zdGF0ZS5oYXNUcmFuc3BhcmVuY3kpO1xuXHR9LFxuXG5cdF9zYXZlOiBmdW5jdGlvbihrZWVwT3Blbikge1xuXHRcdENvbG9yQWN0aW9ucy51cGRhdGVBbHBoYSh0aGlzLnN0YXRlLmFscGhhKTtcblx0XHRpZiAoIWtlZXBPcGVuKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aXNFZGl0aW5nOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zcGFyZW5jeUlucHV0OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcbnZhciBjb2xvclV0aWwgPSByZXF1aXJlKCcuLi8uLi91dGlscy9jb2xvclV0aWwnKTtcbnZhciBEaXNwbGF5VGV4dCA9IHJlcXVpcmUoJy4vRGlzcGxheVRleHQucmVhY3QnKTtcblxudmFyIHN0eWxlID0ge1xuXHRiYWNrZ3JvdW5kQ29sb3I6ICcnXG59XG5cbnZhciBEaXNwbGF5UGFuZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJEaXNwbGF5UGFuZVwiLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGh1ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdHNhdHVyYXRpb246IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRsaWdodG5lc3M6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHRhbHBoYTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXHRcdGFscGhhRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZFxuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0c3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyMnICsgY29sb3JVdGlsLmhzbDJoZXgodGhpcy5wcm9wcy5odWUsIHRoaXMucHJvcHMuc2F0dXJhdGlvbiwgdGhpcy5wcm9wcy5saWdodG5lc3MpO1xuXHRcdGlmICh0aGlzLnByb3BzLmFscGhhRW5hYmxlZCkge1xuXHRcdFx0c3R5bGUub3BhY2l0eSA9IHRoaXMucHJvcHMuYWxwaGE7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlLm9wYWNpdHkgPSAxO1xuXHRcdH1cblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XG5cdFx0XHRcdGNsYXNzTmFtZTogY2xhc3NOYW1lcyhcInBpY2tlci1kaXNwbGF5XCIse1xuXHRcdFx0XHRcdCdwaWNrZXItZGlzcGxheV9fZGFyaycgOiB0aGlzLnByb3BzLmxpZ2h0bmVzcyA8PSAuNDVcblx0XHRcdFx0fSl9LCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBpY2tlci1kaXNwbGF5X19iYWNrZ3JvdW5kLWltYWdlXCJ9KSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwaWNrZXItZGlzcGxheV9faW5uZXJcIiwgc3R5bGU6IHN0eWxlfSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChEaXNwbGF5VGV4dCwge2NvbG9yOiBbdGhpcy5wcm9wcy5odWUsIHRoaXMucHJvcHMuc2F0dXJhdGlvbiwgdGhpcy5wcm9wcy5saWdodG5lc3NdfSlcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BsYXlQYW5lOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcbnZhciBjb2xvclV0aWwgPSByZXF1aXJlKCcuLi8uLi91dGlscy9jb2xvclV0aWwnKTtcblxudmFyIHN0eWxlID0ge1xuXHRjb2xvcjogJydcbn1cbnZhciBsaWdodCA9IHRydWU7XG5cbnZhciBEaXNwbGF5VGV4dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJEaXNwbGF5VGV4dFwiLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMubnVtYmVyKS5pc1JlcXVpcmVkLFxuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGhzbCA9IHRoaXMucHJvcHMuY29sb3I7XG5cdFx0dmFyIGhleCA9IGNvbG9yVXRpbC5oc2wyaGV4KGhzbFswXSwgaHNsWzFdLCBoc2xbMl0pO1xuXHRcdHN0eWxlLmNvbG9yID0gaHNsWzJdID4gLjQ1ID8gJycgOiAnIycgKyBoZXg7XG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwaWNrZXItZGlzcGxheV9fdGV4dCBwaWNrZXItZGlzcGxheV9fYmxvY2tcIiwgc3R5bGU6IHN0eWxlfSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCB7Y2xhc3NOYW1lOiBcInNhbXBsZS1oZWFkZXJcIn0sIFwiU2FtcGxlIFRleHRcIiksIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCB7Y2xhc3NOYW1lOiBcInNhbXBsZS1wYXJhZ3JhcGhcIn0sIFwiTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIEFtZXQgcXVpLCBwZXJmZXJlbmRpcyEgTmloaWwgcXVpIG9tbmlzIGNvcnBvcmlzIGRpZ25pc3NpbW9zLiBRdWFzLCBhYiB2aXRhZSwgcmVwZWxsZW5kdXMgZGVsZWN0dXMgbnVsbGEgb2ZmaWNpaXMgcG9zc2ltdXMgdW5kZSBkaWduaXNzaW1vcyBub2JpcyBkZXNlcnVudCBsYXVkYW50aXVtLCBxdWlzcXVhbS5cIilcblx0XHRcdClcblx0XHQpO1xuXHR9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BsYXlUZXh0OyIsInZhciBrZXlNaXJyb3IgPSByZXF1aXJlKCdrZXltaXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3Ioe1xuICBIVUVfVVBEQVRFOiBudWxsLFxuICBTQVRVUkFUSU9OX1VQREFURTogbnVsbCxcbiAgTElHSFRORVNTX1VQREFURTogbnVsbCxcbiAgQUxQSEFfVVBEQVRFOiBudWxsLFxuICBBTFBIQV9FTkFCTEVEX1VQREFURTogbnVsbCxcbiAgSEVYX1VQREFURTogbnVsbCxcbiAgUkdCX1VQREFURTogbnVsbCxcbiAgSFNMX1VQREFURTogbnVsbFxufSk7XG4iLCIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBBcHBEaXNwYXRjaGVyXG4gKlxuICogQSBzaW5nbGV0b24gdGhhdCBvcGVyYXRlcyBhcyB0aGUgY2VudHJhbCBodWIgZm9yIGFwcGxpY2F0aW9uIHVwZGF0ZXMuXG4gKi9cblxudmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCdmbHV4JykuRGlzcGF0Y2hlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGlzcGF0Y2hlcigpO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBBcHAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvQXBwLmpzJyk7XG5cblJlYWN0LnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KEFwcCwgbnVsbCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHByb290JykpOyIsInZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xudmFyIENvbG9yQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL0NvbG9yQ29uc3RhbnRzJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIGNvbG9yVXRpbHMgPSByZXF1aXJlKCcuLi91dGlscy9jb2xvclV0aWwnKTtcblxudmFyIENIQU5HRV9FVkVOVCA9ICdjaGFuZ2UnO1xuXG52YXIgX2h1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSozNjApLFxuICAgIF9zYXR1cmF0aW9uID0gMSxcbiAgICBfbGlnaHRuZXNzID0gLjUsXG4gICAgX2FscGhhID0gLjc1LFxuICAgIF9hbHBoYUVuYWJsZWQgPSBmYWxzZTtcblxuXG5mdW5jdGlvbiB1cGRhdGVIdWUoaHVlKSB7XG4gIF9odWUgPSBodWU7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVNhdHVyYXRpb24oc2F0KSB7XG4gIF9zYXR1cmF0aW9uID0gc2F0O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVMaWdodG5lc3MobGlnaHQpIHtcbiAgX2xpZ2h0bmVzcyA9IGxpZ2h0O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVBbHBoYShhbHBoYSkge1xuICBfYWxwaGEgPSBhbHBoYTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQWxwaGFFbmFibGVkKGVuYWJsZWQpIHtcbiAgX2FscGhhRW5hYmxlZCA9IGVuYWJsZWQ7XG59XG5cbnZhciBDb2xvclN0b3JlID0gYXNzaWduKHt9LCBFdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgZ2V0SHVlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gX2h1ZTtcbiAgfSxcblxuICBnZXRTYXR1cmF0aW9uOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gX3NhdHVyYXRpb247XG4gIH0sXG5cbiAgZ2V0TGlnaHRuZXNzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gX2xpZ2h0bmVzcztcbiAgfSxcblxuICBnZXRBbHBoYTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF9hbHBoYTtcbiAgfSxcblxuICBnZXRBbHBoYUVuYWJsZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfYWxwaGFFbmFibGVkO1xuICB9LFxuXG4gIGVtaXRDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZW1pdChDSEFOR0VfRVZFTlQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgYWRkQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbihDSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoQ0hBTkdFX0VWRU5ULCBjYWxsYmFjayk7XG4gIH1cbn0pO1xuXG4vLyBSZWdpc3RlciBjYWxsYmFjayB0byBoYW5kbGUgYWxsIHVwZGF0ZXNcbkFwcERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24oYWN0aW9uKSB7XG4gIC8vY29uc29sZS5sb2coJ0NvbG9yIHN0b3JlIGNhdGNoIGRpc3BhdGNoZWQgYWN0b24nKTtcblxuICBzd2l0Y2goYWN0aW9uLmFjdGlvblR5cGUpIHtcbiAgICBjYXNlIENvbG9yQ29uc3RhbnRzLkhVRV9VUERBVEU6XG4gICAgICB2YXIgaHVlID0gYWN0aW9uLmh1ZTtcbiAgICAgIGlmICh2YWxpZEh1ZSgraHVlKSl7XG4gICAgICAgIHVwZGF0ZUh1ZSgraHVlKTtcbiAgICAgICAgQ29sb3JTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIENvbG9yQ29uc3RhbnRzLlNBVFVSQVRJT05fVVBEQVRFOlxuICAgICAgdmFyIHNhdCA9IGFjdGlvbi5zYXR1cmF0aW9uO1xuICAgICAgaWYgKHZhbGlkU2F0dXJhdGlvbigrc2F0KSl7XG4gICAgICAgIHVwZGF0ZVNhdHVyYXRpb24oK3NhdCk7XG4gICAgICAgIENvbG9yU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBDb2xvckNvbnN0YW50cy5MSUdIVE5FU1NfVVBEQVRFOlxuICAgICAgdmFyIGxpZ2h0ID0gYWN0aW9uLmxpZ2h0bmVzcztcbiAgICAgIGlmICh2YWxpZExpZ2h0bmVzcygrbGlnaHQpKXtcbiAgICAgICAgdXBkYXRlTGlnaHRuZXNzKCtsaWdodCk7XG4gICAgICAgIENvbG9yU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBDb2xvckNvbnN0YW50cy5BTFBIQV9VUERBVEU6XG4gICAgICB2YXIgYWxwaGEgPSBhY3Rpb24uYWxwaGE7XG4gICAgICBpZiAodmFsaWRBbHBoYSgrYWxwaGEpKXtcbiAgICAgICAgdXBkYXRlQWxwaGEoK2FscGhhKTtcbiAgICAgICAgQ29sb3JTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgQ29sb3JDb25zdGFudHMuQUxQSEFfRU5BQkxFRF9VUERBVEU6XG4gICAgICB2YXIgZW5hYmxlZCA9IGFjdGlvbi5hbHBoYUVuYWJsZWQ7XG4gICAgICBpZiAoZW5hYmxlZCl7XG4gICAgICAgIHVwZGF0ZUFscGhhRW5hYmxlZCh0cnVlKTtcbiAgICAgICAgQ29sb3JTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cGRhdGVBbHBoYUVuYWJsZWQoZmFsc2UpO1xuICAgICAgICBDb2xvclN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSBDb2xvckNvbnN0YW50cy5IRVhfVVBEQVRFOlxuICAgICAgdmFyIGhleCA9IGFjdGlvbi5oZXg7XG4gICAgICB2YXIgaHNsID0gY29sb3JVdGlscy5oZXgyaHNsKGhleCk7XG4gICAgICBpZiAoaHNsKSB7XG4gICAgICAgIHVwZGF0ZUh1ZShoc2xbMF0pO1xuICAgICAgICB1cGRhdGVTYXR1cmF0aW9uKGhzbFsxXSk7XG4gICAgICAgIHVwZGF0ZUxpZ2h0bmVzcyhoc2xbMl0pO1xuICAgICAgICBDb2xvclN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQ29sb3JDb25zdGFudHMuUkdCX1VQREFURTpcbiAgICAgIHZhciByZ2IgPSBhY3Rpb24ucmdiO1xuICAgICAgdmFyIGhzbCA9IGNvbG9yVXRpbHMucmdiMmhzbChyZ2JbMF0sIHJnYlsxXSwgcmdiWzJdKTtcbiAgICAgIHZhciBhbHBoYSA9IHJnYlszXTtcbiAgICAgIGlmIChoc2wpIHtcbiAgICAgICAgdXBkYXRlSHVlKGhzbFswXSk7XG4gICAgICAgIHVwZGF0ZVNhdHVyYXRpb24oaHNsWzFdKTtcbiAgICAgICAgdXBkYXRlTGlnaHRuZXNzKGhzbFsyXSk7XG4gICAgICAgIENvbG9yU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBhbHBoYSA9PSAnbnVtYmVyJyAmJiB2YWxpZEFscGhhKCthbHBoYSkpIHtcbiAgICAgICAgdXBkYXRlQWxwaGEoK2FscGhhKTtcbiAgICAgICAgQ29sb3JTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIENvbG9yQ29uc3RhbnRzLkhTTF9VUERBVEU6XG4gICAgICB2YXIgaHNsID0gYWN0aW9uLmhzbDtcbiAgICAgIGlmIChoc2wpIHtcbiAgICAgICAgdXBkYXRlSHVlKGhzbFswXSk7XG4gICAgICAgIHVwZGF0ZVNhdHVyYXRpb24oaHNsWzFdKTtcbiAgICAgICAgdXBkYXRlTGlnaHRuZXNzKGhzbFsyXSk7XG4gICAgICAgIENvbG9yU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIG5vIG9wXG4gIH1cbn0pO1xuXG5mdW5jdGlvbiB2YWxpZEh1ZShodWUpIHtcbiAgaWYgKGlzTmFOKGh1ZSkgfHwgaHVlIDwgMCB8fCBodWUgPiAzNjApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRTYXR1cmF0aW9uKHNhdCkge1xuICBpZiAoaXNOYU4oc2F0KSB8fCBzYXQgPCAwIHx8IHNhdCA+IDEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRMaWdodG5lc3MobGlnaHQpIHtcbiAgaWYgKGlzTmFOKGxpZ2h0KSB8fCBsaWdodCA8IDAgfHwgbGlnaHQgPiAxKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkQWxwaGEoYWxwaGEpIHtcbiAgaWYgKGlzTmFOKGFscGhhKSB8fCBhbHBoYSA8IDAgfHwgYWxwaGEgPiAxKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sb3JTdG9yZTtcbiIsInZhciB1dGlscyA9IHtcblx0aHN2MnJnYjogZnVuY3Rpb24oaCxzLHYpIHtcblx0XHR2YXIgYyA9IHYgKiBzO1xuXHQgICAgdmFyIGgxID0gaCAvIDYwO1xuXHQgICAgdmFyIHggPSBjICogKDEgLSBNYXRoLmFicygoaDEgJSAyKSAtIDEpKTtcblx0ICAgIHZhciBtID0gdiAtIGM7XG5cdCAgICB2YXIgcmdiO1xuXG5cdCAgICBpZiAodHlwZW9mIGggPT0gJ3VuZGVmaW5lZCcpIHJnYiA9IFswLCAwLCAwXTtcblx0ICAgIGVsc2UgaWYgKGgxIDwgMSkgcmdiID0gW2MsIHgsIDBdO1xuXHQgICAgZWxzZSBpZiAoaDEgPCAyKSByZ2IgPSBbeCwgYywgMF07XG5cdCAgICBlbHNlIGlmIChoMSA8IDMpIHJnYiA9IFswLCBjLCB4XTtcblx0ICAgIGVsc2UgaWYgKGgxIDwgNCkgcmdiID0gWzAsIHgsIGNdO1xuXHQgICAgZWxzZSBpZiAoaDEgPCA1KSByZ2IgPSBbeCwgMCwgY107XG5cdCAgICBlbHNlIGlmIChoMSA8PSA2KSByZ2IgPSBbYywgMCwgeF07XG5cblx0ICAgIHZhciByID0gMjU1ICogKHJnYlswXSArIG0pO1xuXHQgICAgdmFyIGcgPSAyNTUgKiAocmdiWzFdICsgbSk7XG5cdCAgICB2YXIgYiA9IDI1NSAqIChyZ2JbMl0gKyBtKTtcblx0ICAgIHJldHVybiBbK3IudG9GaXhlZCg4KSwgK2cudG9GaXhlZCg4KSwgK2IudG9GaXhlZCg4KV07XG5cdH0sXG5cblx0cmdiMmhzbDogZnVuY3Rpb24ocixnLGIpIHtcblx0XHR2YXIgcjEgPSAoci8yNTUpLFxuXHRcdFx0ZzEgPSAoZy8yNTUpLFxuXHRcdFx0YjEgPSAoYi8yNTUpO1xuXG5cdFx0dmFyIGNNYXggPSBNYXRoLm1heChyMSxnMSxiMSksXG5cdFx0XHRjTWluID0gTWF0aC5taW4ocjEsZzEsYjEpLFxuXHRcdFx0ZGVsdGEgPSBjTWF4IC0gY01pbjtcblx0XHR2YXIgSCxTLEw7XG5cblx0XHRpZiAoZGVsdGEgPT09IDApIHtcblx0XHRcdEggPSAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzd2l0Y2ggKGNNYXgpIHtcblx0XHRcdFx0Y2FzZSAocjEpOlxuXHRcdFx0XHRcdEggPSA2MCAqICgoKGcxLWIxKS9kZWx0YSkgJSA2KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAoZzEpOlxuXHRcdFx0XHRcdEggPSA2MCAqICgoKGIxLXIxKS9kZWx0YSkgKyAyKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAoYjEpOlxuXHRcdFx0XHRcdEggPSA2MCAqICgoKHIxLWcxKS9kZWx0YSkgKyA0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFxuXHRcdGlmIChIPDApIHtcblx0XHRcdEggPSAzNjAgLSBNYXRoLmFicyhIKTtcblx0XHR9XG5cblx0XHRMID0gKGNNYXggKyBjTWluKS8yO1xuXG5cdFx0aWYgKGRlbHRhID09IDApIHtcblx0XHRcdFMgPSAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRTID0gZGVsdGEvKDEtTWF0aC5hYnMoMipMLTEpKTtcblx0XHR9XG5cdFx0cmV0dXJuIFsrSC50b0ZpeGVkKDgpLCtTLnRvRml4ZWQoOCksK0wudG9GaXhlZCg4KV1cblx0fSxcblxuXHRoc2wycmdiOiBmdW5jdGlvbihoLHMsbCkge1xuXHRcdGggPSBoLzM2MDtcblx0XHR2YXIgciwgZywgYjtcblxuXHQgICAgaWYocyA9PSAwKXtcblx0ICAgICAgICByID0gZyA9IGIgPSBsOyAvLyBhY2hyb21hdGljXG5cdCAgICB9ZWxzZXtcblx0ICAgICAgICBmdW5jdGlvbiBodWUycmdiKHAsIHEsIHQpe1xuXHQgICAgICAgICAgICBpZih0IDwgMCkgdCArPSAxO1xuXHQgICAgICAgICAgICBpZih0ID4gMSkgdCAtPSAxO1xuXHQgICAgICAgICAgICBpZih0IDwgMS82KSByZXR1cm4gcCArIChxIC0gcCkgKiA2ICogdDtcblx0ICAgICAgICAgICAgaWYodCA8IDEvMikgcmV0dXJuIHE7XG5cdCAgICAgICAgICAgIGlmKHQgPCAyLzMpIHJldHVybiBwICsgKHEgLSBwKSAqICgyLzMgLSB0KSAqIDY7XG5cdCAgICAgICAgICAgIHJldHVybiBwO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciBxID0gbCA8IDAuNSA/IGwgKiAoMSArIHMpIDogbCArIHMgLSBsICogcztcblx0ICAgICAgICB2YXIgcCA9IDIgKiBsIC0gcTtcblx0ICAgICAgICByID0gaHVlMnJnYihwLCBxLCBoICsgMS8zKTtcblx0ICAgICAgICBnID0gaHVlMnJnYihwLCBxLCBoKTtcblx0ICAgICAgICBiID0gaHVlMnJnYihwLCBxLCBoIC0gMS8zKTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIFsrKHIgKiAyNTUpLnRvUHJlY2lzaW9uKDgpLCArKGcgKiAyNTUpLnRvRml4ZWQoOCksICsoYiAqIDI1NSkudG9GaXhlZCg4KV07XG5cdH0sXG5cblx0aHNsMmhleDogZnVuY3Rpb24oaCxzLGwpIHtcblx0XHR2YXIgcmdiID0gdGhpcy5oc2wycmdiKGgscyxsKTtcblx0XHRyZXR1cm4gJycgKyBjb21wb25lbnRUb0hleChNYXRoLmZsb29yKHJnYlswXSkpICsgY29tcG9uZW50VG9IZXgoTWF0aC5mbG9vcihyZ2JbMV0pKSArIGNvbXBvbmVudFRvSGV4KE1hdGguZmxvb3IocmdiWzJdKSk7XG5cdH0sXG5cblx0aGV4MmhzbDogZnVuY3Rpb24oaGV4KSB7XG5cdFx0dmFyIHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuXG5cdFx0cmV0dXJuIHJlc3VsdCA/IHRoaXMucmdiMmhzbChwYXJzZUludChyZXN1bHRbMV0sIDE2KSwgcGFyc2VJbnQocmVzdWx0WzJdLCAxNiksIHBhcnNlSW50KHJlc3VsdFszXSwgMTYpKSA6IG51bGw7XG5cdH1cblxufVxuXG5mdW5jdGlvbiBjb21wb25lbnRUb0hleChjKSB7XG5cdHZhciBoZXggPSBjLnRvU3RyaW5nKDE2KTtcbiAgICByZXR1cm4gaGV4Lmxlbmd0aCA9PSAxID8gXCIwXCIgKyBoZXggOiBoZXg7XG59XG53aW5kb3cuY29sb3IgPSB1dGlscztcbm1vZHVsZS5leHBvcnRzID0gdXRpbHM7IiwidmFyIHV0aWxzID0ge1xuXHQvKlxuXHQqIEBwYXJhbSBlbGVtZW50OiBkb20gZWxlbWVudFxuXHQqL1xuXHRvZmZzZXQ6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGJvdW5kaW5nQ2xpZW50UmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3aWR0aDogYm91bmRpbmdDbGllbnRSZWN0LndpZHRoIHx8IGVsZW1lbnQucHJvcCgnb2Zmc2V0V2lkdGgnKSxcbiAgICAgICAgICAgIGhlaWdodDogYm91bmRpbmdDbGllbnRSZWN0LmhlaWdodCB8fCBlbGVtZW50LnByb3AoJ29mZnNldEhlaWdodCcpLFxuICAgICAgICAgICAgdG9wOiBib3VuZGluZ0NsaWVudFJlY3QudG9wICsgKHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wKSxcbiAgICAgICAgICAgIGxlZnQ6IGJvdW5kaW5nQ2xpZW50UmVjdC5sZWZ0ICsgKHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdClcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZ2V0U3R5bGU6IGZ1bmN0aW9uIChlbCwgY3NzcHJvcCkge1xuICAgICAgICBpZiAoZWwuY3VycmVudFN0eWxlKSB7IC8vSUVcbiAgICAgICAgICAgIHJldHVybiBlbC5jdXJyZW50U3R5bGVbY3NzcHJvcF07XG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUpIHtcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbClbY3NzcHJvcF07XG4gICAgICAgIH1cbiAgICAgICAgLy8gZmluYWxseSB0cnkgYW5kIGdldCBpbmxpbmUgc3R5bGVcbiAgICAgICAgcmV0dXJuIGVsLnN0eWxlW2Nzc3Byb3BdO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1dGlsczsiLCJ2YXIgdXRpbHMgPSB7XG5cdGRlYm91bmNlOiBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcblx0XHR2YXIgdGltZW91dDtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHR2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGltZW91dCA9IG51bGw7XG5cdFx0XHRcdGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdFx0fTtcblx0XHRcdHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdFx0dGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuXHRcdFx0aWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdFx0fTtcblx0fSxcblx0cm91bmQ6IGZ1bmN0aW9uKG4sIGRlYykge1xuXHRcdGlmIChkZWNpbWFsUGxhY2VzKG4pID4gKGRlYyB8fCAyKSl7XG5cdFx0XHRyZXR1cm4gcGFyc2VGbG9hdChuLnRvRml4ZWQoZGVjIHx8IDIpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIG47XG5cdFx0fVxuXHR9XG59O1xuXG5mdW5jdGlvbiBkZWNpbWFsUGxhY2VzKG51bWJlcikge1xuICByZXR1cm4gKCgrbnVtYmVyKS50b0ZpeGVkKDIwKSkucmVwbGFjZSgvXi0/XFxkKlxcLj98MCskL2csICcnKS5sZW5ndGg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdXRpbHM7IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiLyohXG4gIENvcHlyaWdodCAoYykgMjAxNSBKZWQgV2F0c29uLlxuICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKE1JVCksIHNlZVxuICBodHRwOi8vamVkd2F0c29uLmdpdGh1Yi5pby9jbGFzc25hbWVzXG4qL1xuLyogZ2xvYmFsIGRlZmluZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGhhc093biA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5cdGZ1bmN0aW9uIGNsYXNzTmFtZXMgKCkge1xuXHRcdHZhciBjbGFzc2VzID0gJyc7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdGlmICghYXJnKSBjb250aW51ZTtcblxuXHRcdFx0dmFyIGFyZ1R5cGUgPSB0eXBlb2YgYXJnO1xuXG5cdFx0XHRpZiAoYXJnVHlwZSA9PT0gJ3N0cmluZycgfHwgYXJnVHlwZSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBhcmc7XG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAoYXJnVHlwZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdGlmIChoYXNPd24uY2FsbChhcmcsIGtleSkgJiYgYXJnW2tleV0pIHtcblx0XHRcdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsga2V5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjbGFzc2VzLnN1YnN0cigxKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gY2xhc3NOYW1lcztcblx0fSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0Ly8gcmVnaXN0ZXIgYXMgJ2NsYXNzbmFtZXMnLCBjb25zaXN0ZW50IHdpdGggbnBtIHBhY2thZ2UgbmFtZVxuXHRcdGRlZmluZSgnY2xhc3NuYW1lcycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGFuIGVudW1lcmF0aW9uIHdpdGgga2V5cyBlcXVhbCB0byB0aGVpciB2YWx1ZS5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgIHZhciBDT0xPUlMgPSBrZXlNaXJyb3Ioe2JsdWU6IG51bGwsIHJlZDogbnVsbH0pO1xuICogICB2YXIgbXlDb2xvciA9IENPTE9SUy5ibHVlO1xuICogICB2YXIgaXNDb2xvclZhbGlkID0gISFDT0xPUlNbbXlDb2xvcl07XG4gKlxuICogVGhlIGxhc3QgbGluZSBjb3VsZCBub3QgYmUgcGVyZm9ybWVkIGlmIHRoZSB2YWx1ZXMgb2YgdGhlIGdlbmVyYXRlZCBlbnVtIHdlcmVcbiAqIG5vdCBlcXVhbCB0byB0aGVpciBrZXlzLlxuICpcbiAqICAgSW5wdXQ6ICB7a2V5MTogdmFsMSwga2V5MjogdmFsMn1cbiAqICAgT3V0cHV0OiB7a2V5MToga2V5MSwga2V5Mjoga2V5Mn1cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbnZhciBrZXlNaXJyb3IgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHJldCA9IHt9O1xuICB2YXIga2V5O1xuICBpZiAoIShvYmogaW5zdGFuY2VvZiBPYmplY3QgJiYgIUFycmF5LmlzQXJyYXkob2JqKSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2tleU1pcnJvciguLi4pOiBBcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdC4nKTtcbiAgfVxuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgcmV0W2tleV0gPSBrZXk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yO1xuIl19
