var React = require('react');
var ReactPropTypes = React.PropTypes;
var ColorActions = require('./../../actions/ColorActions');
var colorUtils = require('./../../utils/colorUtil');

var Hexinput = React.createClass({

	propTypes: {
		color: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
	},

	render: function() {
		var hex = colorUtils.hsl2hex(this.props.color[0], this.props.color[1], this.props.color[2]);
		return (
			<div>
				<div>Hex</div>
				<div>#{ hex }</div>
			</div>
		);
	},

});

module.exports = Hexinput;