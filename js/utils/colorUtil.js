var utils = {
	hsv2rgb: function(h,s,v) {
		var c = v * s;
	    var h1 = h / 60;
	    var x = c * (1 - Math.abs((h1 % 2) - 1));
	    var m = v - c;
	    var rgb;

	    if (typeof h == 'undefined') rgb = [0, 0, 0];
	    else if (h1 < 1) rgb = [c, x, 0];
	    else if (h1 < 2) rgb = [x, c, 0];
	    else if (h1 < 3) rgb = [0, c, x];
	    else if (h1 < 4) rgb = [0, x, c];
	    else if (h1 < 5) rgb = [x, 0, c];
	    else if (h1 <= 6) rgb = [c, 0, x];

	    var r = 255 * (rgb[0] + m);
	    var g = 255 * (rgb[1] + m);
	    var b = 255 * (rgb[2] + m);

	    return [+r.toFixed(2), +g.toFixed(2), +b.toFixed(2)];
	},

	rgb2hsl: function(r,g,b) {
		var r1 = r/255,
			g1 = g/255,
			b1 = b/255;
		var cMax = Math.max(r1,g1,b1),
			cMin = Math.min(r1,g1,b1),
			delta = cMax - cMin;

		var H,S,L;

		switch (delta) {
			case (0):
				H = 0;
				break;
			case (r1):
				H = 60 * (((g1-b1)/delta) % 6);
				break;
			case (g1):
				H = 60 * (((b1-r1)/delta) + 2);
				break;
			case (b1):
				H = 60 * (((r1-g1)/delta) + 4);
				break;
		}
		if (H<0) {
			H = 360 - Math.abs(H);
		}
		L = (cMax - cMin)/2;

		if (delta == 0) {
			S = 0;
		} else {
			S = delta/(1-Math.abs(2*L-1));
		}
		return [+H.toFixed(0),+S.toFixed(2),+L.toFixed(2)]
	},

	hsl2rgb: function(h,s,l) {
		h = h/360;
		var r, g, b;

	    if(s == 0){
	        r = g = b = l; // achromatic
	    }else{
	        function hue2rgb(p, q, t){
	            if(t < 0) t += 1;
	            if(t > 1) t -= 1;
	            if(t < 1/6) return p + (q - p) * 6 * t;
	            if(t < 1/2) return q;
	            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	            return p;
	        }

	        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	        var p = 2 * l - q;
	        r = hue2rgb(p, q, h + 1/3);
	        g = hue2rgb(p, q, h);
	        b = hue2rgb(p, q, h - 1/3);
	    }

	    return [+(r * 255).toFixed(2), +(g * 255).toFixed(2), +(b * 255).toFixed(2)];
	},

	hsl2hex: function(h,s,l) {
		var rgb = this.hsl2rgb(h,s,l);
		return '' + componentToHex(Math.floor(rgb[0])) + componentToHex(Math.floor(rgb[1])) + componentToHex(Math.floor(rgb[2]));
	}

}

function componentToHex(c) {
	var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
window.color = utils;
module.exports = utils;