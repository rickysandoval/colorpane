var React = require('react');
var classNames = require('classnames');

var RgbInput = React.createClass({

	propTypes: {
		onSave: React.PropTypes.func.isRequired,
		r: React.PropTypes.number.isRequired,
		g: React.PropTypes.number.isRequired,
		b: React.PropTypes.number.isRequired,
		alpha: React.PropTypes.number.isRequired,
		alphaEnabled: React.PropTypes.bool.isRequired
	},

	getInitialState: function() {
		return {
			r: this.props.r || 0,
			g: this.props.g || 0,
			b: this.props.b || 0,
			a: this.props.alpha || 0
		};
	},

	componentDidUpdate: function(prevProps) {
		if (prevProps.r != this.props.r || prevProps.g != this.props.g || prevProps.b != this.props.b) {
			this.setState({
				r: this.props.r,
				g: this.props.g,
				b: this.props.b,
				a: this.props.alpha
			});
		}
	},

	render: function() {
		return (
			<div className={classNames("rgb-input", {"alpha-enabled": this.props.alphaEnabled})}>
				<input
					min="0"
					max="255"
					type="number"
					value={this.state.r}
					onKeyDown={this._handleKeyDown}
					onChange={this._onChange}
					ref="rInput"
				/>
				<input 
					min="0"
					max="255"
					type="number"
					value={this.state.g}
					onKeyDown={this._handleKeyDown}
					onChange={this._onChange}
					ref="gInput"
				/>
				<input 
					min="0"
					max="255"
					type="number"
					value={this.state.b}
					onKeyDown={this._handleKeyDown}
					onChange={this._onChange}
					ref="bInput"
				/>
				<input
					className="rgb-input__alpha"
					min="0"
					max="1"
					type="number"
					step=".1"
					value={this.state.a}
					onKeyDown={this._handleKeyDown}
					onChange={this._onChange}
					ref="aInput"
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
			b: React.findDOMNode(this.refs.bInput).valueAsNumber,
			a: React.findDOMNode(this.refs.aInput).valueAsNumber
		}, this._save.bind(this, true));
	},

	_save: function(keepOpen) {
		this.props.onSave([
			Math.min(Math.max(this.state.r || 0, 0), 255),
			Math.min(Math.max(this.state.g || 0, 0), 255),
			Math.min(Math.max(this.state.b || 0, 0), 255),
			Math.min(Math.max(this.state.a || 0, 0), 1)
		], keepOpen);
	}
});

module.exports = RgbInput;