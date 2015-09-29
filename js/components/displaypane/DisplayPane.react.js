var React = require('react');
var utils = require('../../utils/colorUtil');
var HSVinput = require('../controls/HsvInput.react');
var RGBinput = require('../controls/RgbInput.react');
var Hexinput = require('../controls/HexInput.react');

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
				<HSVinput color={[this.props.hue, this.props.saturation, this.props.lightness]} />
				<RGBinput color={[this.props.hue, this.props.saturation, this.props.lightness]} />
				<Hexinput color={[this.props.hue, this.props.saturation, this.props.lightness]} />
			</div>
		);
	}
});

module.exports = DisplayPane;