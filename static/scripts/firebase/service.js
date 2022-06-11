/**
 * @module firebase:service
 * @requires firebase:initialize
 * @license GPL-3.0-only
 */

import {
	createUserWithEmailAndPassword,
	GithubAuthProvider,
	GoogleAuthProvider,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import { auth } from "./initialize.js";

/**
 * Logs the user in to Firebase.
 * @async
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<*>} Promise that resolves when the user is logged in.
 */
async function signIn(email, password) {
	return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Creates the user in Firebase.
 * @async
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<*>} Promise that resolves when the user is logged in.
 */
async function signUp(email, password) {
	return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Signs the user out of Firebase.
 * @async
 */
async function signOut() {
	auth.signOut();
}

/**
 * Sends an email to the user where they can reset their password.
 * @param {string} email 
 * @returns {Promise<*>} Promise that resolves when the email is sent.
 */
async function resetPassword(email) {
	return sendPasswordResetEmail(auth, email, {
		url: "https://christofferholmesland.github.io/codetyper/",
	});
}

/**
 * Shows a popup to the user that lets them sign in with their Github account.
 * @returns {Promise<*>} Promise that resolves when the user is logged in.
 */
async function githubSignInWithPopup() {
	const provider = new GithubAuthProvider();
	provider.addScope("repo");
	return signInWithPopup(auth, provider);
}

/**
 * Shows a popup to the user that lets them sign in with their Google account.
 * @returns {Promise<*>} Promise that resolves when the user is logged in.
 */
async function googleSignInWithPopup() {
	const provider = new GoogleAuthProvider();
	provider.addScope("profile");
	provider.addScope("email");
	return signInWithPopup(auth, provider);
}

/**
 * Get the current user.
 * @returns {object|undefined} Returns the current user if they are logged in, or undefined if they are not logged in.
 */
function getUser() {
	if (auth.currentUser === null) return undefined;

	return auth.currentUser;
}

export {
	signIn,
	signOut,
	signUp,
	getUser,
	resetPassword,
	githubSignInWithPopup,
	googleSignInWithPopup,
};
