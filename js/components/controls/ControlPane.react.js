var React = require('react');
var HslDisplay = require('./HslDisplay.react');
var RgbDisplay= require('./RgbDisplay.react');
var HexDisplay = require('./HexDisplay.react');
var TransparencyInput = require('./TransparencyInput.react');
var colorUtil = require('../../utils/colorUtil');

var style = {
	backgroundColor: ''
}

var ControlPane = React.createClass({

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
			<div style={style} className="picker-inputs">
				<div className="picker-inputs__inner">
					<HslDisplay color={[this.props.hue, this.props.saturation, this.props.lightness]} />
					<RgbDisplay color={[this.props.hue, this.props.saturation, this.props.lightness]} alpha={this.props.alpha} alphaEnabled={this.props.alphaEnabled}/>
					<HexDisplay color={[this.props.hue, this.props.saturation, this.props.lightness]} />
					<TransparencyInput hasTransparency={this.props.alphaEnabled} alpha={this.props.alpha}/>
				</div>
			</div>
		);
	}

});

module.exports = ControlPane;