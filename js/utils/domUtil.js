var utils = {
	/*
	* @param element: dom element
	*/
	offset: function(element) {
        var boundingClientRect = element.getBoundingClientRect();
        return {
            width: boundingClientRect.width || element.prop('offsetWidth'),
            height: boundingClientRect.height || element.prop('offsetHeight'),
            top: boundingClientRect.top + (window.pageYOffset || document.documentElement.scrollTop),
            left: boundingClientRect.left + (window.pageXOffset || document.documentElement.scrollLeft)
        };
    },

    getStyle: function (el, cssprop) {
        if (el.currentStyle) { //IE
            return el.currentStyle[cssprop];
        } else if (window.getComputedStyle) {
            return window.getComputedStyle(el)[cssprop];
        }
        // finally try and get inline style
        return el.style[cssprop];
    }
}

module.exports = utils;