var React = require('react');
var colorUtil = require('../../utils/colorUtil');

var HexInput = React.createClass({

	propTypes: {
		onSave: React.PropTypes.func.isRequired,
		hex: React.PropTypes.string.isRequired
	},

	getInitialState: function() {
		return {
			value: this.props.hex || ''
		};
	},

	componentDidUpdate: function(prevProps) {
		if (prevProps.hex != this.props.hex) {
			this.setState({
				value: this.props.hex
			});
		}
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
		}, this._changeCallback);
	},

	_changeCallback: function(){
		if (colorUtil.hex2hsl(this.state.value)){
			this.props.onSave(this.state.value, true);
		}
	},

	_save: function() {
		if (colorUtil.hex2hsl(this.state.value)){
			this.props.onSave(this.state.value);
		}
	}
});

module.exports = HexInput;