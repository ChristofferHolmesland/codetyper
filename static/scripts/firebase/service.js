import {
        createUserWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import { auth } from "./initialize.js";

async function signIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
}

async function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
}

async function signOut() {
        auth.signOut();
}

async function resetPassword(email) {
        return sendPasswordResetEmail(auth, email, { url: 'https://christofferholmesland.github.io/codetyper/' });
}

async function githubSignInWithPopup() {
        const provider = new GithubAuthProvider();
        provider.addScope('repo');
        return signInWithPopup(auth, provider);
}

async function googleSignInWithPopup() {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        return signInWithPopup(auth, provider);
}

function getUser() {
        if (auth.currentUser === null) return undefined;

        return auth.currentUser;
}

export { signIn, signOut, signUp, getUser, resetPassword, githubSignInWithPopup, googleSignInWithPopup };

