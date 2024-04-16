// For Android, redirect to https://play.google.com/store/apps/details?id=com.cacaoapps.greetextai
// For iOS, open /app/
// For Desktop, open in a popup of iframe with the ratio of 9:16, at the center of the screen on top of the page, and a nicely styled close (X) button
function downloadApp() {
	var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
	if (isMobile) {
		var isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
		if (isIOS) {
			window.location.href = '/app/';
		} else {
			window.location.href = 'https://play.google.com/store/apps/details?id=com.cacaoapps.greetextai';
		}
	} else {
		// Open in an iframe inside a popup
		var popup = document.createElement('div');
		popup.style.position = 'fixed';
		popup.style.top = '0';
		popup.style.left = '0';
		popup.style.width = '100%';
		popup.style.height = '100%';
		popup.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
		popup.style.zIndex = '9999';
		popup.style.display = 'flex';
		popup.style.justifyContent = 'center';
		popup.style.alignItems = 'center';
		popup.style.cursor = 'pointer';
		popup.onclick = function() {
			document.body.removeChild(popup);
		};
		var iframe = document.createElement('iframe');
		iframe.src = 'app/';
		iframe.style.width = '45vh';
		iframe.style.height = '80vh';
		iframe.style.border = 'none';
		popup.appendChild(iframe);
		document.body.appendChild(popup);
	}
}