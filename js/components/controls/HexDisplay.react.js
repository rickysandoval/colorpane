var React = require('react');
var classNames = require('classnames');

var ColorActions = require('./../../actions/ColorActions');
var colorUtils = require('./../../utils/colorUtil');
var HexInput = require('./HexInput.react');


var HexDisplay = React.createClass({

	propTypes: {
		color: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
	},

	getInitialState: function() {
		return {
			isEditing: false
		};
	},

	render: function() {
		var hex = colorUtils.hsl2hex(this.props.color[0], this.props.color[1], this.props.color[2]);
		var input;

		if (this.state.isEditing) {
			input = 
				<HexInput
					onSave={this._onSave}
					hex={hex}
				/>;
		}
		//
		return (
			<div
				className={classNames('color-input', {
					'editing': this.state.isEditing
				})}>
				<div onDoubleClick={this._onDoubleClick}>
					<div className="color-input__label">Hex</div>
					<div className="color-input__display">#{ hex }</div>
				</div>
				{input}
			</div>
		);
	},

	_onDoubleClick: function() {
		this.setState({isEditing: true});
	},

	_onSave: function(hex, keepOpen) {
		ColorActions.updateHex(hex);
		if (!keepOpen){
			this.setState({isEditing: false});
		}
	}

});

module.exports = HexDisplay;