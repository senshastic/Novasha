// ==UserScript==
// @name           Randomized Tab Burst Animation
// @namespace      random_tab_burst
// @version        1.0.4
// @description    Randomize tab burst animations, excluding essential tabs
// @author         sensha
// ==/UserScript==

(function () {
    let enabled = true;
    if (enabled) {
        if (_gBrowser) {
            gBrowser = window._gBrowser;
        }

        const animations = [
            {
                url: "https://cdn.discordapp.com/emojis/1286249075775242240.webp?size=240&animated=true",
                size: "35px",
                duration: "8s",
            },
            {
                url: "https://cdn.discordapp.com/emojis/856959619141992508.webp?size=240&animated=true",
                size: "35px",
                duration: "6s",
            },
            {
                url: "https://cdn.discordapp.com/emojis/1237312808534671450.webp?size=240&animated=true",
                size: "40px",
                duration: "7s",
            },
            {
                url: "https://cdn.discordapp.com/emojis/1294101996491767840.webp?size=240&animated=true",
                size: "35px",
                duration: "9s",
            },
            {
                url: "https://i.gifer.com/PYh.gif",
                size: "100px",
                duration: "4s",
            },
        ];

        const tabAnimations = new WeakMap();

        function applyRandomAnimation(tab) {
            // Skip tabs marked as "zen-essential"
            if (tab.getAttribute("zen-essential") === "true") return;

            if (tabAnimations.has(tab)) return;

            const burstElement = tab.querySelector(".tab-loading-burst[bursting]");
            if (!burstElement) return;

            // Choose a random animation
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            tabAnimations.set(tab, randomAnimation);

            // Delay the animation to prevent early rendering issues
            setTimeout(() => {
                const animationName = `burst-animation-${Math.random().toString(36).substring(2, 8)}`;
                const styleSheet = document.styleSheets[0];

                styleSheet.insertRule(`
                    @keyframes ${animationName} {
                        0% {
                            transform: translate(-50%, -50%);
                        }
                        100% {
                            transform: translate(50vw, -50%) translateX(100%);
                        }
                    }
                `, styleSheet.cssRules.length);

                // Apply styles
                burstElement.style.setProperty("position", "absolute");
                burstElement.style.setProperty("content", '""');
                burstElement.style.setProperty("top", "50%");
                burstElement.style.setProperty("left", "0%");
                burstElement.style.setProperty("width", randomAnimation.size);
                burstElement.style.setProperty("height", randomAnimation.size);
                burstElement.style.setProperty("background-image", `url(${randomAnimation.url})`);
                burstElement.style.setProperty("background-position", "center");
                burstElement.style.setProperty("background-size", "cover");
                burstElement.style.setProperty("background-repeat", "no-repeat");
                burstElement.style.setProperty("animation", `${animationName} ${randomAnimation.duration} cubic-bezier(0, 0, 0.58, 1) forwards`);

                // Clear animation after it completes
                burstElement.addEventListener("animationend", () => {
                    tabAnimations.delete(tab);
                }, { once: true });
            }, 50);
        }

        // Tab events
        gBrowser.tabContainer.addEventListener("TabSelect", (event) => {
            const selectedTab = event.target;
            applyRandomAnimation(selectedTab);
        });

        gBrowser.tabContainer.addEventListener("TabAttrModified", (event) => {
            const tab = event.target;
            if (tab.hasAttribute("bursting")) {
                applyRandomAnimation(tab);
            }
        });

        // Apply to existing tabs on load
        Array.from(gBrowser.tabContainer.children).forEach(applyRandomAnimation);
    }
})();
