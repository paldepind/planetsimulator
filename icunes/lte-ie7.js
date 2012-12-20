/* Use this script if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icons\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-stats-up' : '&#x67;',
			'icon-meter-fast' : '&#x73;',
			'icon-compass' : '&#x64;',
			'icon-tab' : '&#x61;',
			'icon-power' : '&#x31;',
			'icon-power-2' : '&#x32;',
			'icon-lightning' : '&#x33;',
			'icon-bolt' : '&#x72;',
			'icon-dashboard' : '&#x37;',
			'icon-calendar' : '&#x63;',
			'icon-loading' : '&#x30;',
			'icon-database' : '&#x6d;',
			'icon-arrow-up-right' : '&#x36;',
			'icon-prev' : '&#xf048;',
			'icon-play' : '&#xf04b;',
			'icon-next' : '&#xf051;',
			'icon-track' : '&#xf018;',
			'icon-untitled' : '&#xf01e;',
			'icon-dist' : '&#xf065;',
			'icon-zoom-in' : '&#xf00e;',
			'icon-zoom-out' : '&#xf010;',
			'icon-position' : '&#xf041;',
			'icon-untitled-2' : '&#xf002;',
			'icon-untitled-3' : '&#xf06e;',
			'icon-pause' : '&#xf04c;'
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