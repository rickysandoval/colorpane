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
			isEditing: false,
			isCopying: false
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
				'editing': this.state.isEditing,
				'copying': this.state.isCopying
				})}>
				<div>
					<div className="color-input__label">
						RGB{this.props.alphaEnabled ? 'a' : ''}
						<span className="color-input__copy-button" onClick={this._openCopy}><img src="http://rickysandoval.github.io/colorpane/img/copy.png"/></span>
						<span 
							className="color-input__copy-text" >
							<input
								value={this._printRgb(rgb)} 
								onBlur={this._closeCopy}
								ref="copyText" readOnly></input>
						</span>
					</div>
					<div 
						className="color-input__display"
						onDoubleClick={this._openEdit} >
						{gUtil.round(rgb[0])}, {gUtil.round(rgb[1])}, {gUtil.round(rgb[2])}{this.props.alphaEnabled ? ', '+this.props.alpha : ''}
					</div>
				</div>
				{input}
			</div>
		);
	},

	_closeCopy: function() {
		this.setState({isCopying: false});
	},

	_openCopy: function() {
		var input = React.findDOMNode(this.refs.copyText);
		if (!this.state.isCopying) {
			this.setState({isCopying: true});
			setTimeout(function(){
				input.focus();
				input.select();
			});
		}
		setTimeout(function(){
			input.select();
		});
	},

	_openEdit: function() {
		this.setState({isEditing: true});
	},

	_printRgb: function(rgb) {
		var text = 'rgb' + 
					(this.props.alphaEnabled ? 'a' : '') + 
					'(' + gUtil.round(rgb[0]) + ',' +
					gUtil.round(rgb[1]) + ',' +
					gUtil.round(rgb[2]) + 
					(this.props.alphaEnabled ? (', ' +this.props.alpha) : '') + ')';
		return text;
	},

	_onSave: function(rgb, keepOpen) {
		ColorActions.updateRgb(rgb);
		if (!keepOpen){
			this.setState({isEditing: false});
		}
	}

});

module.exports = RgbDisplay;