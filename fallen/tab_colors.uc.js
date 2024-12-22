// ==UserScript==
// @name           tab_color_thing
// @namespace      tab_color_thingy
// @version        0.0.3
// @ignorecache
// @loadOrder      1
// @description    set tab color to favicon color
// ==/UserScript==

//Need https://github.com/MrOtherGuy/fx-autoconfig
// ignorecache needed for quick testing
// load order probably irrelevant

(function () {
	let enabled = true;
	if (enabled) {
		//I don't get why we need this but it makes things worky
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

		//Max Brightness thanks to deepseek (smarter than chatgpt)
		function getVibrantColor(imageUrl, maxBrightness, callback) {
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

				// Normalize maxBrightness between 0 and 1
				let brightnessThreshold =
					Math.min(Math.max(maxBrightness, 0), 100) / 100;

				for (let i = 0; i < data.length; i += 4) {
					let red = data[i];
					let green = data[i + 1];
					let blue = data[i + 2];

					// Calculate brightness (luminance)
					let brightness =
						0.2126 * red + 0.7152 * green + 0.0722 * blue;

					// Calculate saturation
					let max = Math.max(red, green, blue);
					let min = Math.min(red, green, blue);
					let saturation = max === 0 ? 0 : (max - min) / max;

					// Apply brightness threshold
					if (brightness / 255 > brightnessThreshold) {
						continue; // Skip pixels that exceed the brightness threshold
					}

					// Weight based on saturation
					let currentWeight = saturation;
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
				getVibrantColor(faviconUrl, 75, (color) => {
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

		//either find another event or run this only once per tab, idk
		gBrowser.tabContainer.addEventListener("TabAttrModified", (event) => {
			let tab = event.target;
			if (tab.hasAttribute("image")) {
				applyTabColor(tab);
			}
		});

		Array.from(gBrowser.tabContainer.children).forEach(applyTabColor);
	}
})();
