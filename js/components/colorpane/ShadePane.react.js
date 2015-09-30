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
var mouseDown = 0;

var DisplayPane = React.createClass({

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
    	document.body.addEventListener('mousedown', function(){
    		++mouseDown;
    	});
    	document.body.addEventListener('mouseup', function(){
    		--mouseDown;
    	});
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
		document.removeEventListener('mousedown', function(){
    		++mouseDown;
    	});
    	document.removeEventListener('mouseup', function(){
    		--mouseDown;
    	});
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
			<div
				className="shade-pane"
				style={wrapperStyle} 
				onMouseMove={this._handleMouseMove}>
				<div className="shade-pane__window">
					<canvas 
						id="shade" 
						className="shade-pane__canvas" 
						ref="shadePaneCanvas"
						onMouseDown={this._handleMouseDown}
						onMouseLeave={this._handeMouseLeave} >
					</canvas>
				</div>
			</div>
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