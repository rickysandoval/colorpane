var React = require('react');
var classNames = require('classnames');

var ColorActions = require('./../../actions/ColorActions');
var HslInput = require('./HslInput.react');

var HslDisplay = React.createClass({

	propTypes: {
		color: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
	},

	getInitialState: function() {
		return {
			isEditing: false
		};
	},

	render: function() {
		var hsl = this.props.color
		var input;

		if (this.state.isEditing) {
			input =
				<HslInput
					onSave={this._onSave}
					h={hsl[0]}
					s={hsl[1]}
					l={hsl[2]}
				/>;
		}
		//
		return (
			<div className={classNames('color-input', {
				'editing': this.state.isEditing
				})}>
				<div onDoubleClick={this._onDoubleClick}>
					<div className="color-input__label">HSL</div>
					<div className="color-input__display">{hsl[0]}, {hsl[1]}, {hsl[2]}</div>
				</div>
				{input}
			</div>
		);
	},

	_onDoubleClick: function() {
		this.setState({isEditing: true});
	},

	_onSave: function(hsl, keepOpen) {
		ColorActions.updateHsl(hsl);
		if (!keepOpen){
			this.setState({isEditing: false});
		}
	}

});

module.exports = HslDisplay;