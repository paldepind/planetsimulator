/* Use this script if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-remove' : '&#xe000;',
			'icon-plus' : '&#xe004;',
			'icon-pause' : '&#xf04c;',
			'icon-untitled' : '&#xf06e;',
			'icon-untitled-2' : '&#xf002;',
			'icon-position' : '&#xf041;',
			'icon-zoom-out' : '&#xf010;',
			'icon-zoom-in' : '&#xf00e;',
			'icon-dist' : '&#xf065;',
			'icon-untitled-3' : '&#xf01e;',
			'icon-track' : '&#xf018;',
			'icon-next' : '&#xf051;',
			'icon-play' : '&#xf04b;',
			'icon-prev' : '&#xf048;',
			'icon-arrow-up-right' : '&#x36;',
			'icon-database' : '&#x6d;',
			'icon-loading' : '&#x30;',
			'icon-calendar' : '&#x63;',
			'icon-dashboard' : '&#x37;',
			'icon-bolt' : '&#x72;',
			'icon-lightning' : '&#x33;',
			'icon-power' : '&#x32;',
			'icon-power-2' : '&#x31;',
			'icon-tab' : '&#x61;',
			'icon-compass' : '&#x64;',
			'icon-meter-fast' : '&#x73;',
			'icon-stats-up' : '&#x67;',
			'icon-radio-checked' : '&#x21;',
			'icon-radio-unchecked' : '&#x22;',
			'icon-pie' : '&#x23;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; i < els.length; i += 1) {
		el = els[i];
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};