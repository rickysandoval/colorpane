var React = require('react');

var HslInput = React.createClass({

	propTypes: {
		onSave: React.PropTypes.func.isRequired,
		h: React.PropTypes.number.isRequired,
		s: React.PropTypes.number.isRequired,
		l: React.PropTypes.number.isRequired
	},

	getInitialState: function() {
		return {
			h: this.props.h || 0,
			s: this.props.s || 0,
			l: this.props.l || 0
		};
	},

	render: function() {
		return (
			<div className="hsl-input">
				<input
					min="0"
					max="360"
					type="number"
					value={this.state.h}
					onKeyDown={this._handleKeyDown}
					onChange={this._onChange}
					ref="hInput"
				/>
				<input 
					min="0"
					max="1"
					step=".1"
					type="number"
					value={this.state.s}
					onKeyDown={this._handleKeyDown}
					onChange={this._onChange}
					ref="sInput"
				/>
				<input 
					min="0"
					max="1"
					step=".1"
					type="number"
					value={this.state.l}
					onKeyDown={this._handleKeyDown}
					onChange={this._onChange}
					ref="lInput"
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

	_onChange: function(event) {
		this.setState({
			h: React.findDOMNode(this.refs.hInput).valueAsNumber,
			s: React.findDOMNode(this.refs.sInput).valueAsNumber,
			l: React.findDOMNode(this.refs.lInput).valueAsNumber
		}, this._save.bind(this, true));
	},

	_save: function(keepOpen) {
		this.props.onSave([
			Math.min(Math.max(this.state.h, 0), 360),
			Math.min(Math.max(this.state.s, 0), 1),
			Math.min(Math.max(this.state.l, 0), 1)
		], keepOpen);
	}
});

module.exports = HslInput;