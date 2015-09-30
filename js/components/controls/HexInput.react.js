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
				onKeyDown={this._handleKeyDown}
				onChange={this._onChange}
			/>
		);
	},
	//comment
	_handleKeyDown: function(event) {
		if (event.keyCode === 13) {
			this._save();
		}
	},

	_onChange: function(event) {
		this.setState({
			value: event.target.value
		});
	},

	_save: function() {
		this.props.onSave(this.state.value);
	}
});

module.exports = HexInput;