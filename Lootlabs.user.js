// ==UserScript==
// @name        Lootlabs Bypass
// @match        *://loot-link.com/s?*
// @match        *://loot-links.com/s?*
// @match        *://lootlink.org/s?*
// @match        *://lootlinks.co/s?*
// @match        *://lootdest.info/s?*
// @match        *://lootdest.org/s?*
// @match        *://lootdest.com/s?*
// @match        *://links-loot.com/s?*
// @match        *://linksloot.net/s?*
// @grant       none
// @version     1.1
// @author      Babyhamsta
// @license     MIT
// @run-at      document-start
// @namespace   https://github.com/NPC-Q8/Bypass
// @downloadURL https://github.com/NPC-Q8/Bypassmain/Lootlabs.user.js
// @updateURL   https://github.com/NPC-Q8/Bypassmain/Lootlabs.meta.js
// ==/UserScript==

function decodeURI(encodedString, prefixLength = 5) {
	let decodedString = '';
	const base64Decoded = atob(encodedString);
	const prefix = base64Decoded.substring(0, prefixLength);
	const encodedPortion = base64Decoded.substring(prefixLength);

	for (let i = 0; i < encodedPortion.length; i++) {
		const encodedChar = encodedPortion.charCodeAt(i);
		const prefixChar = prefix.charCodeAt(i % prefix.length);
		const decodedChar = encodedChar ^ prefixChar;
		decodedString += String.fromCharCode(decodedChar);
	}

	return decodedString;
}

// We'll use this to detect their typical Unlock Content square and replace it with a custom one
(function() {
	'use strict';

	const waitForElementAndModifyParent = () => {
		// Function to modify the parent element
		const modifyParentElement = (targetElement) => {
			const parentElement = targetElement.parentElement;

			if (parentElement) {
				// This assumes our task loaded, we'll then check for what type of task as they all have minimum wait times.
				const images = document.querySelectorAll('img');
				let countdownSeconds = 5;

				for (let img of images) {
					if (img.src.includes('eye.png')) {
						countdownSeconds = 3;
						break;
					} else if (img.src.includes('bell.png')) {
						countdownSeconds = 4;
						break;
					} else if (img.src.includes('apps.png') || img.src.includes('fire.png')) {
						countdownSeconds = 5;
						break;
					} else if (img.src.includes('gamers.png')) {
						countdownSeconds = 6;
						break;
					}
				}

				// Clear parent element's content
				parentElement.innerHTML = '';

				const popupHTML = `
                <div id="tm-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.75); z-index:999999; display:flex; justify-content:center; align-items:center;">
                    <center>
                      <div id="tm-popup" style="padding:40px; background:#fff; border-radius:5px; box-shadow:0 2px 10px rgba(0,0,0,0.5); z-index:1000000;">
                          <div style="margin-bottom:20px;"><h1>Wait Bypass</h1><h2>Bypassing Lootlabs</h2></div>
                          <div id="countdown" style="margin-bottom:20px;"><h4>[Estimated ${countdownSeconds} Seconds Remaining]</h4></div>
                          <div id="countdown" style="margin-bottom:20px;"><h4>[100% Code By NPC-Q8. Never Took Anything From Anyone | Update Fast Bypass]</h4></div>
                      </div>
                    </center>
                </div>
              `;

				// Function to update the countdown every second
				const startCountdown = (duration) => {
					let remaining = duration;
					const countdownTimer = setInterval(() => {
						remaining--;
						document.getElementById('countdown').textContent = `[Estimated ${remaining} Seconds Remaining]`;
						if (remaining <= 0) clearInterval(countdownTimer);
					}, 1000);
				};

				const spinnerCSS = `
                .wheel-and-bypass {
                  --dur: 1s;
                  position: relative;
                  width: 12em;
                  height: 12em;
                  margin: auto;
                }
                .wheel,
                .bypass,
                .bypass div,
                .spoke {
                  position: absolute;
                }
                .wheel,
                .spoke {
                  border-radius: 50%;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                }
                .wheel {
                  background: radial-gradient(100% 100% at center,hsla(0,0%,60%,0) 47.8%,hsl(0,0%,60%) 48%);
                  z-index: 2;
                }
              `;

				// Insert HTML and CSS
				parentElement.insertAdjacentHTML('afterbegin', popupHTML);

				// Start the countdown
				startCountdown(countdownSeconds);

				const style = document.createElement('style');
				style.type = 'text/css';
				style.innerHTML = spinnerCSS;
				document.getElementsByTagName('head')[0].appendChild(style);
			}
		};

    localStorage.clear();for(let i=0;i<100;i++)if(54!==i){var e,$="t_"+i,t={value:1,expiry:new Date().getTime()+6048e5};localStorage.setItem($,JSON.stringify(t))}

		// Use MutationObserver to watch for changes in the document
		const observer = new MutationObserver((mutationsList, observer) => {
			for (const mutation of mutationsList) {
				if (mutation.type === 'childList') {
					const foundElement = Array.from(document.querySelectorAll('body *')).find(element => element.textContent.includes("UNLOCK CONTENT"));
					if (foundElement) {
						modifyParentElement(foundElement);
						observer.disconnect(); // Stop observing after the element is found and modified
						break;
					}
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	};

	// Check if the DOM is fully loaded
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', waitForElementAndModifyParent);
	} else {
		waitForElementAndModifyParent(); // DOM is already fully loaded
	}
})();

// Hook fetch to intercept the data we need
(function() {
	const originalFetch = window.fetch;
	window.fetch = function(url, config) {
		// We're looking for their URL that gives us the data we need.
		if (url.includes(`${INCENTIVE_SYNCER_DOMAIN}/tc`)) {
			return originalFetch(url, config).then(response => {
				if (!response.ok) return JSON.stringify(response);

				return response.clone().json().then(data => {
					let urid = "";
					let task_id = "";
					let action_pixel_url = "";

					// Parse through the data for what we need
					data.forEach(item => {
						urid = item.urid;
						task_id = 54;
						action_pixel_url = item.action_pixel_url;
					});

					// We'll now quickly create our own socket to intercept their messages
					const ws = new WebSocket(`wss://${urid.substr(-5) % 3}.${INCENTIVE_SERVER_DOMAIN}/c?uid=${urid}&cat=${task_id}&key=${KEY}`);

					ws.onopen = () => setInterval(() => ws.send('0'), 1000);

					// We're looking for a message returned with the real publishing link
					ws.onmessage = event => {
						if (event.data.includes('r:')) {
							PUBLISHER_LINK = event.data.replace('r:', '');
						}
					};

					// Send post for fake task click to sync server
					navigator.sendBeacon(`https://${urid.substr(-5) % 3}.${INCENTIVE_SERVER_DOMAIN}/st?uid=${urid}&cat=${task_id}`);

					// Send pixel tracker request (to make it look like we hit their page)
					fetch(action_pixel_url);

					// Send fake complete task to sync server
					fetch(`https://${INCENTIVE_SYNCER_DOMAIN}/td?ac=1&urid=${urid}&&cat=${task_id}&tid=${TID}`);

					// Once the socket is closed we'll assume we have the real socket link from the onmessage func.
					ws.onclose = () => window.location.href = decodeURIComponent(decodeURI(PUBLISHER_LINK));

					return new Response(JSON.stringify(data), {
						status: response.status,
						statusText: response.statusText,
						headers: response.headers
					});
				});
			});
		}

		// If it doesn't match our URL then we return the original fetch request
		return originalFetch(url, config);
	};
})();