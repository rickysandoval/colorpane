var React = require('react');
var classNames = require('classnames');

var ColorActions = require('./../../actions/ColorActions');
var colorUtils = require('./../../utils/colorUtil');
var RgbInput = require('./RgbInput.react');

var RgbDisplay = React.createClass({

	propTypes: {
		color: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
	},

	getInitialState: function() {
		return {
			isEditing: false
		};
	},

	render: function() {
		var rgb = colorUtils.hsl2rgb(this.props.color[0], this.props.color[1], this.props.color[2]);
		var input;

		if (this.state.isEditing) {
			input =
				<RgbInput
					onSave={this._onSave}
					r={rgb[0]}
					g={rgb[1]}
					b={rgb[2]}
				/>;
		}
		//
		return (
			<div className={classNames('color-input', {
				'editing': this.state.isEditing
				})}>
				<div onDoubleClick={this._onDoubleClick}>
					<div className="color-input__label">RGB</div>
					<div className="color-input__display">{rgb[0]}, {rgb[1]}, {rgb[2]}</div>
				</div>
				{input}
			</div>
		);
	},

	_onDoubleClick: function() {
		this.setState({isEditing: true});
	},

	_onSave: function(rgb, keepOpen) {
		ColorActions.updateRgb(rgb);
		if (!keepOpen){
			this.setState({isEditing: false});
		}
	}

});

module.exports = RgbDisplay;