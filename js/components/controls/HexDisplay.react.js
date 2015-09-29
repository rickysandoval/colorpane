var React = require('react');
var ReactPropTypes = React.PropTypes;
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

		return (
			<div
				className={classNames({
					'editing': this.state.isEditing
				})}>
				<div className={'input-display'}
					onDoubleClick={this._onDoubleClick}>
					<div>Hex</div>
					<div>#{ hex }</div>
				</div>
				{input}
			</div>
		);
	},

	_onDoubleClick: function(){
		this.setState({isEditing: true});
	}

});

module.exports = HexDisplay;