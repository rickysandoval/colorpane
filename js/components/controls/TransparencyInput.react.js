var React = require('react');
var classNames = require('classnames');
var ColorActions = require('./../../actions/ColorActions');

var TransparencyInput = React.createClass({

	propTypes: {
		alpha: React.PropTypes.number.isRequired,
		hasTransparency: React.PropTypes.bool.isRequired
	},

	getInitialState: function() {
		return {
			isEditing: false,
			hasTransparency: this.props.hasTransparency || false,
			alpha: this.props.alpha || 1
		};
	},

	render: function() {
		var input;
		var display;
		var checked;
		if (this.state.hasTransparency){
			if (this.state.isEditing) {
				input =
					<input
						type="number"
						min="0"
						max="1"
						step=".1"
						value={this.state.alpha}
						onKeyDown={this._handleKeyDown}
						onChange={this._onAlphaChange}
					/>;
					//
			}
		}
		//
		return (
			<div className={classNames('color-input', 'transparency-input', {
				'editing': this.state.isEditing,
				'enabled': this.state.hasTransparency
				})}
			>
				<div className="color-input__label">
					<span onDoubleClick={this._onDoubleClick} >Transparency</span>
					<input 
						type="checkbox"
						onChange={this._onEnabledChange} 
						checked={this.state.hasTransparency}
					 />
				</div>
				<div className="color-input__display" onDoubleClick={this._onDoubleClick}>{this.props.alpha}</div>
				{input}
			</div>
		);
	},

	_onDoubleClick: function() {
		if (this.state.hasTransparency){
			this.setState({
				isEditing: true
			});
		}
	},

	_handleKeyDown: function(event) {
		if (event.keyCode === 13) {
			this._save();
		}
	},

	_onAlphaChange: function(event) {
		this.setState({
			alpha: event.target.value
		}, this._save.bind(this,true));
	},

	_onEnabledChange: function(event) {
		if (this.state.hasTransparency) {
			this.setState({
				isEditing: false
			}, this._saveEnabled);
		}
		this.setState({
			hasTransparency: !this.state.hasTransparency
		}, this._saveEnabled);
	},

	_saveEnabled: function(){
		ColorActions.updateAlphaEnabled(this.state.hasTransparency);
	},

	_save: function(keepOpen) {
		ColorActions.updateAlpha(this.state.alpha);
		if (!keepOpen) {
			this.setState({
				isEditing: false
			});
		}
	}

});

module.exports = TransparencyInput;