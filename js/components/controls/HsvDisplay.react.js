var React = require('react');
var ColorActions = require('./../../actions/ColorActions');
var classNames = require('classnames');

var HsvDisplay = React.createClass({

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
			<div
				className={classNames('color-input')}>
				<h1 className="color-input__label">HSL</h1>
				<div className="color-input__display">{this.props.color[0]}, {this.props.color[1]}, {this.props.color[2]}</div>
			</div>
		);
	},

	_onSave: function(event) {
		console.log(arguments);
	}

});

module.exports = HsvDisplay;