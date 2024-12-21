// ==UserScript==
// @name           tab_color_thing
// @namespace      tab_color_thingy
// @version        0.0.2
// @ignorecache
// @loadOrder      1
// @description    set tab color to favicon color
// ==/UserScript==

(function () {
	if (_gBrowser) {
		gBrowser = window._gBrowser;
	}
	function getDominantColor(imageUrl, callback) {
		let img = new Image();
		img.crossOrigin = "Anonymous";
		img.src = imageUrl;

		img.onload = function () {
			let canvas = document.createElement("canvas");
			let context = canvas.getContext("2d");
			canvas.width = img.width;
			canvas.height = img.height;

			context.drawImage(img, 0, 0, canvas.width, canvas.height);

			let data = context.getImageData(
				0,
				0,
				canvas.width,
				canvas.height
			).data;
			let r = 0,
				g = 0,
				b = 0,
				count = 0;

			for (let i = 0; i < data.length; i += 4) {
				r += data[i];
				g += data[i + 1];
				b += data[i + 2];
				count++;
			}
			r = Math.floor(r / count);
			g = Math.floor(g / count);
			b = Math.floor(b / count);

			callback(`rgb(${r}, ${g}, ${b})`);
		};

		img.onerror = function () {
			callback(null);
		};
	}

	function getVibrantColor(imageUrl, callback) {
		let img = new Image();
		img.crossOrigin = "Anonymous";
		img.src = imageUrl;

		img.onload = function () {
			let canvas = document.createElement("canvas");
			let context = canvas.getContext("2d");
			canvas.width = img.width;
			canvas.height = img.height;

			context.drawImage(img, 0, 0, canvas.width, canvas.height);

			let data = context.getImageData(
				0,
				0,
				canvas.width,
				canvas.height
			).data;

			let r = 0,
				g = 0,
				b = 0,
				weight = 0;
			for (let i = 0; i < data.length; i += 4) {
				let red = data[i];
				let green = data[i + 1];
				let blue = data[i + 2];

				let brightness = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
				let saturation =
					Math.max(red, green, blue) - Math.min(red, green, blue);

				let currentWeight = brightness * saturation;
				r += red * currentWeight;
				g += green * currentWeight;
				b += blue * currentWeight;
				weight += currentWeight;
			}

			if (weight > 0) {
				r = Math.floor(r / weight);
				g = Math.floor(g / weight);
				b = Math.floor(b / weight);
			}

			callback(`rgb(${r}, ${g}, ${b})`);
		};

		img.onerror = function () {
			callback(null);
		};
	}

	function applyTabColor(tab) {
		let faviconUrl = tab.image;
		if (faviconUrl) {
			getVibrantColor(faviconUrl, (color) => {
				if (color) {
					tab.style.backgroundColor = color;
				}
			});
		}
	}

	gBrowser.tabContainer.addEventListener("TabSelect", (event) => {
		let selectedTab = event.target;
		applyTabColor(selectedTab);
	});

	gBrowser.tabContainer.addEventListener("TabAttrModified", (event) => {
		let tab = event.target;
		if (tab.hasAttribute("image")) {
			applyTabColor(tab);
		}
	});

	Array.from(gBrowser.tabContainer.children).forEach(applyTabColor);
})();
