var React = require('react');
var classNames = require('classnames');

var ColorActions = require('./../../actions/ColorActions');
var colorUtils = require('./../../utils/colorUtil');

var RgbDisplay = React.createClass({

	propTypes: {
		color: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
	},

	render: function() {
		var rgb = colorUtils.hsl2rgb(this.props.color[0], this.props.color[1], this.props.color[2]);
		return (
			<div className={classNames('color-input')}>
				<div className="color-input__label">RGB</div>
				<div className="color-input__display">{rgb[0]}, {rgb[1]}, {rgb[2]}</div>
			</div>
		);
	},

});

module.exports = RgbDisplay;