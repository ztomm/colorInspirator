/**
* colorInspirator 1.0
* This tool creates squares with randomly generated colors.
* 
* Copyright 2018, Murat Motz
* Murat Motz <dev@ztom.de> (https://www.kmgt.de)
* 
* Licensed under MIT
* 
* Released on: November 2, 2018
*/

function ColorInspirator() {

	// make this accessible in methods
	var m = this;

	// default settings
	this.settings = {
		frameAmount: 200,   // starting amount
		minFrames: 1,       // min frames
		maxFrames: 800,     // max frames
		frameSize: 70,      // starting framesize
		stepSize: 10,       // +- pixels when changing the size
		minFrameSize: 10,    // min framesize
	};

	// make this.settings accessible via settings
	var settings = this.settings;

	// app vars
	this.v = {
		css: {},
		frameColors: [],
		frameInterval: '', // var to clear setInterval
		toastTimeout: '',  // var to clear setTimeout
	};

	// make this.v accessible via v
	var v = this.v;

	// initialize the app
	this.init = function (options) {

		// overwrite settings
		v.settings = Object.assign({}, v.settings, options);

		// run methods
		m.getHexColors();
		m.buildFrames();
		m.bindEvents();

	};

	// build an array with randomly created hex colors
	this.getHexColors = function () {

		// empty color array
		v.frameColors = [];

		// fill color array
		for (var x = 0; x < settings.frameAmount; x++) {
			v.frameColors.push('#' + ('000000' + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6));
		}

	};

	// build colored frames from the color array
	this.buildFrames = function () {

		// write amount in footer
		document.querySelector('header .info').textContent = 'current: ' + v.frameColors.length + ' frames';

		// frames container surely empty and no animation in queue
		document.querySelector('#frames').innerHTML = '';
		clearInterval(v.frameInterval);

		// append frames markup
		for (var x = 0; x < v.frameColors.length; x++) {
			document.querySelector('#frames').innerHTML += '<div class="frame frame' + x + '" style="width:' + settings.frameSize + 'px;height:' + settings.frameSize + 'px;background-color:' + v.frameColors[x] + '" data-color="' + v.frameColors[x] + '"></div>';
		}

		// show frames animated
		var f = -1;
		v.frameInterval = setInterval(function () {
			f++;
			if (f < settings.frameAmount) {
				document.querySelector('.frame' + f).classList.add('visible');
			}
			else {
				clearInterval(v.frameInterval);
			}
		}, 10);

	};

	// all events (click and keyboard)
	this.bindEvents = function () {

		// copie to clipboard
		document.getElementById('frames').addEventListener('click', function (e) {
			if (e.target.classList.contains('frame') != -1) {
				var dataColor = e.target.getAttribute('data-color');
				m.copyToClipboard(dataColor, {
					toast: {
						message: 'copied: ' + dataColor,
						time: 2000
					}
				});
			}
		});

		// keyevents
		document.addEventListener('keyup', function (e) {

			e = e || window.event;

			var keyCode = e.keyCode;

			// 13 enter : reload frames
			if (e.keyCode === 13) {
				m.getHexColors();
				m.buildFrames();
			}

			// 16 shift : hide/show header and footer
			if (e.keyCode === 16) {
				document.querySelector('header').classList.toggle('hidden');
				document.querySelector('footer').classList.toggle('hidden');
				document.querySelector('#frames').classList.toggle('alone');
			}

			// 37 left arrow : reduce framesize
			if (e.keyCode === 37) {
				settings.frameSize -= settings.stepSize;
				if (settings.frameSize < settings.minFrames) settings.frameSize = settings.minFrames;
				v.css = { width: settings.frameSize + "px", height: settings.frameSize + "px" };
				document.querySelectorAll('.frame').forEach(function (el) {
					el.style.width = v.css.width;
					el.style.height = v.css.height;
				});
			}

			// 39 right arrow : increase framesize
			if (e.keyCode === 39) {
				settings.frameSize += settings.stepSize;
				v.css = { width: settings.frameSize + "px", height: settings.frameSize + "px" };
				document.querySelectorAll('.frame').forEach(function (el) {
					el.style.width = v.css.width;
					el.style.height = v.css.height;
				});
			}

			// 38 up arrow : double frame amount
			if (keyCode === 38) {
				settings.frameAmount = Math.ceil(settings.frameAmount * 2);
				if (settings.frameAmount >= settings.maxFrames) {
					if (settings.frameAmount > settings.maxFrames) m.toast({ message: 'max amount of frames is ' + settings.maxFrames, time: 2000 });
					settings.frameAmount = settings.maxFrames;
				}
				m.getHexColors();
				m.buildFrames();
			}

			// 40 down arrow : half frame amount
			if (keyCode === 40) {
				settings.frameAmount = Math.ceil(settings.frameAmount / 2);
				if (settings.frameAmount < settings.minFrames) settings.frameAmount = settings.minFrames;
				m.getHexColors();
				m.buildFrames();
			}

		});

	};

	// copy to clipboard
	this.copyToClipboard = function (string, callback) {

		document.body.insertAdjacentHTML('beforeend', '<input id="clipboardtext" style="position:fixed;" value="' + string + '" />');
		document.getElementById('clipboardtext').select();
		document.execCommand('copy');
		document.getElementById('clipboardtext').remove();
		if ('toast' in callback) {
			m.toast(callback.toast);
		}

	};

	// toast message
	this.toast = function (options) {

		clearTimeout(v.toastTimeout);
		if (document.getElementById('toast')) document.getElementById('toast').remove();
		document.body.insertAdjacentHTML('beforeend', '<div id="toast">' + options.message + '</div>');
		v.toastTimeout = setTimeout(function () {
			document.getElementById('toast').remove();
		}, options.time);

	};

}