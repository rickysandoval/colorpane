var React = require('react');

var Header = React.createClass({
	render: function() {
		return (
			<header className="site-header">
				<h1 className="site-header__title">Color thing</h1>
			</header>
		);
	}
});

module.exports = Header;