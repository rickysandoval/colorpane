var React = require('react');
var classNames = require('classnames');
var colorUtil = require('../../utils/colorUtil');
var DisplayText = require('./DisplayText.react');

var style = {
	backgroundColor: ''
}

var DisplayPane = React.createClass({

	propTypes: {
		hue: React.PropTypes.number.isRequired,
		saturation: React.PropTypes.number.isRequired,
		lightness: React.PropTypes.number.isRequired,
		alpha: React.PropTypes.number.isRequired,
		alphaEnabled: React.PropTypes.bool.isRequired
	},

	render: function() {
		style.backgroundColor = '#' + colorUtil.hsl2hex(this.props.hue, this.props.saturation, this.props.lightness);
		if (this.props.alphaEnabled) {
			style.opacity = this.props.alpha;
		} else {
			style.opacity = 1;
		}
		return (
			<div 
				className={classNames("picker-display",{
					'picker-display__dark' : this.props.lightness <= .45
				})} >
				<div className="picker-display__background-image"></div>
				<div className="picker-display__inner" style={style}>
					<DisplayText color={[this.props.hue, this.props.saturation, this.props.lightness]} />
				</div>
			</div>
		);
	}
});

module.exports = DisplayPane;