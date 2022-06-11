/**
 * @module firebase:initialize
 * @license GPL-3.0-only
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";

/**
 * Contains the Firebase configuration settings.
 * @const
 * @type {object}
 */
const firebaseConfig = {
	apiKey: "AIzaSyDMnrcWsoDo3BURgOXAN3kC0SdgnUYto4g",
	authDomain: "codetyper-abef5.firebaseapp.com",
	projectId: "codetyper-abef5",
	storageBucket: "codetyper-abef5.appspot.com",
	messagingSenderId: "931866410642",
	appId: "1:931866410642:web:3ce2d54024c9d271f7704b",
	measurementId: "G-8YF08WKKDX",
};

/**
 * Firebase app object.
 * @const
 * @type {object}
 */
const app = initializeApp(firebaseConfig);
/**
 * Firebase analytics object.
 * @const
 * @type {object}
 */
const analytics = getAnalytics(app);
/**
 * Firebase auth object.
 * @const
 * @type {object}
 */
const auth = getAuth(app);

export { app, analytics, auth };
