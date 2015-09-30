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

var ColorPane = React.createClass({

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
			<div 
				className="color-pane"
				style={wrapperStyle} 
				onMouseMove={this._handleMouseMove}>
				<canvas 
					id="picker" 
					className="color-pane__canvas"
					onMouseDown={this._handleMouseDown}
					onMouseLeave={this._handleMouseLeave}
					ref="colorPaneCanvas" >
				</canvas>
			</div>
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