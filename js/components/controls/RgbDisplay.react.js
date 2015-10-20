var React = require('react');
var classNames = require('classnames');

var ColorActions = require('./../../actions/ColorActions');
var colorUtils = require('./../../utils/colorUtil');
var gUtil = require('./../../utils/generalUtil');
var RgbInput = require('./RgbInput.react');

var RgbDisplay = React.createClass({

	propTypes: {
		color: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
		alpha: React.PropTypes.number.isRequired,
		alphaEnabled: React.PropTypes.bool.isRequired
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
					r={gUtil.round(rgb[0])}
					g={gUtil.round(rgb[1])}
					b={gUtil.round(rgb[2])}
					alpha={this.props.alpha}
					alphaEnabled={this.props.alphaEnabled}
				/>;
		}
		//
		return (
			<div className={classNames('color-input', {
				'editing': this.state.isEditing
				})}>
				<div onDoubleClick={this._onDoubleClick}>
					<div className="color-input__label">RGB{this.props.alphaEnabled ? 'a' : ''}</div>
					<div className="color-input__display">
						{gUtil.round(rgb[0])}, {gUtil.round(rgb[1])}, {gUtil.round(rgb[2])}{this.props.alphaEnabled ? ', '+this.props.alpha : ''}
					</div>
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