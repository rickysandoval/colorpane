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
			isEditing: false,
			isCopying: false
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
					'editing': this.state.isEditing,
					'copying': this.state.isCopying
				})}>
				<div>
					<div className="color-input__label">Hex
						<span className="color-input__copy-button" onClick={this._openCopy}><img src="http://rickysandoval.github.io/colorpane/img/copy.png"/></span>
						<span 
							className="color-input__copy-text" >
							<input
								value={'#' + hex} 
								onBlur={this._closeCopy}
								ref="copyText" readOnly></input>
						</span>
					</div>

					<div 
						className="color-input__display"
						onDoubleClick={this._openEdit}>#{ hex }</div>
				</div>
				{input}
			</div>
		);
	},

	_closeCopy: function() {
		this.setState({isCopying: false});
	},

	_openCopy: function() {
		console.log('open copy');
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