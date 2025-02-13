const firebaseConfig = {
	apiKey: "AIzaSyCQ9DwGZjvfvOJCTVSfaOs4Al0sSCL34hM",
	authDomain: "cookai-2e844.firebaseapp.com",
	projectId: "cookai-2e844",
	storageBucket: "cookai-2e844.firebasestorage.app",
	messagingSenderId: "475665303036",
	appId: "1:475665303036:web:73e30fd9d7266a515cde79",
	measurementId: "G-JXP4Y549SR",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function getIP() {
	try {
		const response = await fetch("https://api.ipify.org?format=json");
		const data = await response.json();
		return data.ip;
	} catch (error) {
		console.error("Error fetching IP:", error);
		return null;
	}
}

function getDeviceDetails() {
	const userAgent = navigator.userAgent;

	let os = "Unknown";
	let osVersion = "Unknown";

	const osMatches = [
		{ name: "Windows", regex: /Windows NT (\d+\.\d+)/ },
		{ name: "macOS", regex: /Mac OS X (\d+[_\.\d]+)/ }, // macOS version can have _ or .
		{ name: "iOS", regex: /OS (\d+[_\.\d]+)/ }, // iOS version can have _ or .
		{ name: "Android", regex: /Android (\d+(\.\d+)?)/ },
		{ name: "Linux", regex: /Linux/ }, // More general Linux detection
	];

	for (const match of osMatches) {
		const versionMatch = userAgent.match(match.regex);
		if (versionMatch) {
			os = match.name.toLowerCase();
			if (versionMatch[1]) {
				osVersion = versionMatch[1].replace(/_/g, "."); // Normalize version
			}
			break; // Stop after finding a match
		}
	}

	// Screen Info
	let screenWidth = screen.width;
	let screenHeight = screen.height;

	// Timezone
	let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	let timezoneOffset = new Date().getTimezoneOffset(); // Offset in minutes

	return {
		os,
		osVersion,
		screenWidth,
		screenHeight,
		timezone,
		timezoneOffset,
	};
}

async function generateHashedId() {
	const ip = await getIP();
	console.log("IP:", ip);
	const deviceDetails = getDeviceDetails();
	console.log("Device Details:", deviceDetails);
	const dataToHash = `${ip}-${JSON.stringify(deviceDetails)}`; // Combine for hashing

	// Simple hash function (replace with a more robust one if needed)
	const encoder = new TextEncoder();
	const dataBuffer = encoder.encode(dataToHash);

	// Use SHA-256 (a strong hashing algorithm)
	const hashBuffer = await crypto.subtle.digest("SHA-1", dataBuffer);

	// Convert the hash to Base64
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const base64Hash = btoa(String.fromCharCode(...hashArray)).replace(/\//g, "_");

	console.log("Hashed ID:", base64Hash);
	return base64Hash;
}

function getRefId() {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get("refid");
}

async function logReferral() {
	const refId = getRefId();
	console.log("Referral ID:", refId);
	if (refId) {
		const hashedId = await generateHashedId();
		console.log("Hashed ID:", hashedId);

		const referralData = {
			refId: refId,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Server timestamp
		};

		try {
			await db.collection("referrals").doc(hashedId).set(referralData);
		} catch (error) {
			console.error("Error logging referral:", error);
		}
	}
}

window.addEventListener("load", () => {
	console.log("Referral Script Loaded");
	logReferral();
});
