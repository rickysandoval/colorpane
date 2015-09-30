var React = require('react');

var RgbInput = React.createClass({

	propTypes: {
		onSave: React.PropTypes.func.isRequired,
		r: React.PropTypes.number.isRequired,
		g: React.PropTypes.number.isRequired,
		b: React.PropTypes.number.isRequired
	},

	getInitialState: function() {
		return {
			r: this.props.r || 0,
			g: this.props.g || 0,
			b: this.props.b || 0
		};
	},

	render: function() {
		return (
			<div className="rgb-input">
				<input
					min="0"
					max="255"
					type="number"
					value={this.state.r}
					onKeyDown={this._handleKeyDown}
					onChange={this._onChange}
					onBlur={this._onChange}
					ref="rInput"
				/>
				<input 
					min="0"
					max="255"
					type="number"
					value={this.state.g}
					onKeyDown={this._handleKeyDown}
					onChange={this._onChange}
					onBlue={this._onChange}
					ref="gInput"
				/>
				<input 
					min="0"
					max="255"
					type="number"
					value={this.state.b}
					onKeyDown={this._handleKeyDown}
					onChange={this._onChange}
					onBlue={this._onChange}
					ref="bInput"
				/>
			</div>
		);
	},
	//comment
	_handleKeyDown: function(event) {
		if (event.keyCode === 13) {
			this._save();
		}
	},

	_onChange: function() {
		this.setState({
			r: React.findDOMNode(this.refs.rInput).valueAsNumber,
			g: React.findDOMNode(this.refs.gInput).valueAsNumber,
			b: React.findDOMNode(this.refs.bInput).valueAsNumber
		}, this._save.bind(this, true));
	},

	_save: function(keepOpen) {
		this.props.onSave([
			Math.min(Math.max(this.state.r || 0, 0), 255),
			Math.min(Math.max(this.state.g || 0, 0), 255),
			Math.min(Math.max(this.state.b || 0, 0), 255)
		], keepOpen);
	},

	_handleBlur: function() {
		this._onChange();
		this._save();
	}
});

module.exports = RgbInput;