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
import { auth, db } from "./initialize.js";
import {
	getDoc,
	setDoc,
	doc,
	updateDoc,
	increment,
	addDoc,
	collection,
	query,
	orderBy,
	limit,
	startAfter,
	getDocs,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js";
import { TEST_COMPLETED, addSubscriber } from "../events/bus.js";

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
 * @async
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
 * @async
 * @returns {Promise<*>} Promise that resolves when the user is logged in.
 */
async function githubSignInWithPopup() {
	const provider = new GithubAuthProvider();
	provider.addScope("repo");
	return signInWithPopup(auth, provider);
}

/**
 * Shows a popup to the user that lets them sign in with their Google account.
 * @async
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

/**
 * Gets the firestore document for the logged in user. If it does not exist a new document is created.
 * @async
 * @returns {DocumentReference|undefined} Document reference or undefined if an error occurs.
 */
async function getUserDoc() {
	const user = getUser();
	if (user === undefined) return undefined;

	let document;
	const docRef = await doc(db, "users", user.uid);

	try {
		document = await getDoc(docRef);
	} catch (e) {
		console.error(e);
		return undefined;
	}

	if (document.exists()) return document;

	const initialUserData = {
		numberOfTests: 0,
	};

	try {
		await setDoc(docRef, initialUserData);
		return await getDoc(docRef);
	} catch (e) {
		console.error(e);
		return undefined;
	}
}

/**
 * Container for values that are stored in a user document in firestore.
 * @typedef {object} UserStats
 * @property {integer} numberOfTests - The number of tests that the user has completed.
 */

/**
 * Returns the data of this users firestore document.
 * @async
 * @returns {UserStats|undefined} User stats object, see {@link UserStats}. Undefined if an error occurs.
 */
async function getUserStats() {
	const userDoc = await getUserDoc();
	if (userDoc === undefined) return undefined;

	try {
		const data = userDoc.data();
		return data;
	} catch (e) {
		console.error(e);
		return undefined;
	}
}

/**
 * Pagination function to get the tests of a user. Results are ordered by timestamp, the newest are first.
 * @async
 * @param {integer} snapshotLimit - Maximum number of documents to return.
 * @param {DocumentSnapshot} lastSeenSnapshot - DocumentSnapshot to return documents after. Used for pagination.
 * @returns {object} - Firestore document snapshots
 */
async function getUserTests(snapshotLimit, lastSeenSnapshot = undefined) {
	if (limit > 25) {
		throw "Limit cannot be above 25 to prevent using all of the firestore free tier quota";
	}

	let q;

	if (lastSeenSnapshot !== undefined) {
		q = query(
			collection(db, `/users/${getUser().uid}/tests`),
			orderBy("timestamp", "desc"),
			startAfter(lastSeenSnapshot),
			limit(snapshotLimit)
		);
	} else {
		q = query(
			collection(db, `/users/${getUser().uid}/tests`),
			orderBy("timestamp", "desc"),
			limit(snapshotLimit)
		);
	}

	return await getDocs(q);
}

/**
 * Saves the result of a test if the user is logged in.
 * @async
 * @param {TestResult} payload - See {@link TestResult}.
 */
async function processTestCompleted(payload) {
	if (
		payload === undefined ||
		payload.completedTest === undefined ||
		payload.completedTest !== true
	) {
		return;
	}

	const userDoc = await getUserDoc();
	if (userDoc === undefined) return;

	updateDoc(userDoc.ref, {
		numberOfTests: increment(1),
	}).catch((e) => console.error(e));

	payload.timestamp = new Date().getTime();
	addDoc(collection(db, `/users/${getUser().uid}/tests`), payload).catch(
		(e) => console.error(e)
	);
}

addSubscriber(TEST_COMPLETED, processTestCompleted);

export {
	signIn,
	signOut,
	signUp,
	getUser,
	getUserStats,
	getUserTests,
	resetPassword,
	githubSignInWithPopup,
	googleSignInWithPopup,
};
