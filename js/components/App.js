var React = require('react');

var ColorStore = require('./../stores/ColorStore');
var ColorActions = require('./../actions/ColorActions');

var Header = require('./Header.react');
var ColorPane = require('./colorpane/ColorPane.react');
var ShadePane = require('./colorpane/ShadePane.react');
var DisplayPane = require('./displaypane/DisplayPane.react');
var ControlPane = require('./controls/ControlPane.react');

function getState() {
	return {
		saturation: ColorStore.getSaturation(),
		hue: ColorStore.getHue(),
		lightness: ColorStore.getLightness(),
		alpha: ColorStore.getAlpha(),
		alphaEnabled: ColorStore.getAlphaEnabled()
	};
}

var App = React.createClass({

	getInitialState: function() {
		return getState()
	},

	componentDidMount: function() {
		ColorStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		ColorStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			<div className="site-wrapper">
				<Header/>
				<main className="site-main">
					<div className="picker-controls">
						<ControlPane
							hue={this.state.hue}
							saturation={this.state.saturation}
							lightness={this.state.lightness}
							alpha={this.state.alpha}
							alphaEnabled={this.state.alphaEnabled}
						/>
					</div>
					<div className="picker-wheel">
						<div className="picker-wheel__wrapper">
							<ColorPane />
							<ShadePane
								hue={this.state.hue}
								saturation={this.state.saturation}
								lightness={this.state.lightness}
							/>
						</div>
					</div>
					<DisplayPane 
						hue={this.state.hue}
						saturation={this.state.saturation}
						lightness={this.state.lightness}
						alpha={this.state.alpha}
						alphaEnabled={this.state.alphaEnabled}
					/>
				</main>
			</div>
		);
	},

	_onChange: function() {
		this.setState(getState());
	}

});

module.exports = App;

;(function() {
    var throttle = function(type, name, obj) {
        var obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle("resize", "optimizedResize");
})();