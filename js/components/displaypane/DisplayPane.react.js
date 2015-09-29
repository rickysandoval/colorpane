var React = require('react');
var utils = require('../../utils/colorUtil');
var HsvDisplay = require('../controls/HsvDisplay.react');
var RgbDisplay= require('../controls/RgbDisplay.react');
var HexDisplay = require('../controls/HexDisplay.react');

var s = 250;

var style = {
	backgroundColor: ''
}

var DisplayPane = React.createClass({

	propTypes: {
		hue: React.PropTypes.number.isRequired,
		saturation: React.PropTypes.number.isRequired,
		lightness: React.PropTypes.number.isRequired
	},

	render: function() {
		style.backgroundColor = '#' + utils.hsl2hex(this.props.hue, this.props.saturation, this.props.lightness);
		return (
			<div className="picker-display" style={style}> 
				<HsvDisplay color={[this.props.hue, this.props.saturation, this.props.lightness]} />
				<RgbDisplay color={[this.props.hue, this.props.saturation, this.props.lightness]} />
				<HexDisplay color={[this.props.hue, this.props.saturation, this.props.lightness]} />
			</div>
		);
	}
});

module.exports = DisplayPane;