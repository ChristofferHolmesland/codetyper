import { auth } from "./initialize.js";
import {
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";

function performSimpleEmailPasswordValidation(email, password) {
	if (email === undefined || !email.includes("@") || email.length < 4) {
		return false;
	}

	if (password === undefined || password.length < 4) {
		return false;
	}

	return true;
}

async function signIn(email, password) {
	if (!performSimpleEmailPasswordValidation(email, password))
		return false;

	return signInWithEmailAndPassword(auth, email, password);
}

function signOut() {
	auth.signOut();
}

function signUp(email, password) {
	if (!performSimpleEmailPasswordValidation(email, password))
		return false;

	return createUserWithEmailAndPassword(auth, email, password);
}

function getUser() {
	if (auth.currentUser === null) return undefined;

	return auth.currentUser;
}

export { signIn, signOut, signUp, getUser };
