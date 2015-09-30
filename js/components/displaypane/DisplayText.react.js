var React = require('react');
var classNames = require('classnames');
var colorUtil = require('../../utils/colorUtil');

var style = {
	color: ''
}
var light = true;

var DisplayText = React.createClass({

	propTypes: {
		color: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
	},

	render: function() {
		var hsl = this.props.color;
		var hex = colorUtil.hsl2hex(hsl[0], hsl[1], hsl[2]);
		style.color = hsl[2] > .45 ? '' : '#' + hex;
		return (
			<div className="picker-display__text picker-display__block" style={style} >
				<h1 className="sample-header">Sample Text</h1>
				<p className="sample-paragraph">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet qui, perferendis! Nihil qui omnis corporis dignissimos. Quas, ab vitae, repellendus delectus nulla officiis possimus unde dignissimos nobis deserunt laudantium, quisquam.</p>
			</div>
		);
	}

});

module.exports = DisplayText;