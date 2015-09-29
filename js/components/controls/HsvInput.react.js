var React = require('react');
var ColorActions = require('./../../actions/ColorActions');

var HSVinput = React.createClass({

	propTypes: {
		color: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
	},

	getInitialState: function() {
		return {
			isEditing: true
		};
	},

	render: function() {
		return (
			<div>
				<div>HSL</div>
				<div>{this.props.color[0]}, {this.props.color[1]}, {this.props.color[2]}</div>
			</div>
		);
	},

	_onSave: function(event) {
		console.log(arguments);
	}

});

module.exports = HSVinput;