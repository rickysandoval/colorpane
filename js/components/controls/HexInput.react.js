var React = require('react');

var HexInput = React.createClass({

	propTypes: {
		onSave: React.PropTypes.func.isRequired,
		hex: React.PropTypes.string
	},

	getInitialState: function() {
		return {
			value: this.props.hex || ''
		};
	},

	render: function() {
		return (
			<input 
				value={this.state.value}
			/>
		);
	}
});

module.exports = HexInput;