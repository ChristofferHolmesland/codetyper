/**
 * @module screens:AuthScreen
 * @requires screens:screens
 * @requires screen:screen
 * @requires events:bus
 * @requires firebase:service
 * @license GPL-3.0-only
 */

import { CHANGE_SCREEN, fireEvent } from "../events/bus.js";
import {
	githubSignInWithPopup,
	googleSignInWithPopup,
	resetPassword,
	signIn,
	signUp,
} from "../firebase/service.js";
import Screen from "./screen.js";
import { getScreenObject, PROFILE_SCREEN } from "./screens.js";

/**
 * Screen that can be used to show a popup where the user can sign in or create a user.
 * @class
 */
class AuthScreen extends Screen {
	/**
	 * Creates a new auth screen.
	 * @param {HTMLElement} element - Root element
	 */
	constructor(element) {
		super("Auth", element, AUTH_HTML);
	}

	/**
	 * Shows the popup to the user.
	 */
	enter() {
		this.screenContainer =
			document.getElementById("screenContainer");
		this.screenContainer.innerHTML += AUTH_HTML;

		this.modal = document.getElementById("authModal");
		this.closeModalButton =
			document.getElementById("authModalCancel");

		this.authMode = document.getElementById("authMode");
		this.modeTitle = document.getElementById("authModeTitle");
		this.modeSwitchText =
			document.getElementById("authModeSwitchText");
		this.modeSwitchButton = document.getElementById(
			"authModeSwitchButton"
		);

		this.authButton = document.getElementById("authButton");
		this.authForgotCredentials = document.getElementById(
			"authForgotCredential"
		);

		this.authSpinner = document.createElement("DIV");
		this.authSpinner.classList.add("auth-button-spinner");
		this.authSpinner.setAttribute("id", "loadingSpinner");

		this.errorText = document.getElementById("errorText");

		this.password = document.getElementById("passwordInput");
		this.email = document.getElementById("emailInput");

		this.googleProviderButton = document.getElementById(
			"googleAuthProviderButton"
		);
		this.githubProviderButton = document.getElementById(
			"githubAuthProviderButton"
		);

		this.authForgotCredentials = document.getElementById(
			"authForgotCredential"
		);

		this.registerEventListeners();
	}

	/**
	 * Add button click handlers.
	 */
	registerEventListeners() {
		this.authForgotCredentials.addEventListener("click", () =>
			this.openResetModal()
		);

		this.modeSwitchButton.addEventListener("click", () =>
			this.changeAuthenticationMode()
		);
		this.closeModalButton.addEventListener("click", () =>
			this.leave()
		);
		this.authButton.addEventListener("click", () =>
			this.emailPasswordAuth()
		);
		this.googleProviderButton.addEventListener("click", () =>
			this.googleAuthProvider()
		);
		this.githubProviderButton.addEventListener("click", () =>
			this.githubAuthProvider()
		);
	}

	/**
	 * Handles authentication with Google.
	 */
	googleAuthProvider() {
		errorText.innerText = "";
		this.toggleAuthProviderSpinner(this.googleProviderButton);
		googleSignInWithPopup()
			.then((_) => {
				fireEvent(
					CHANGE_SCREEN,
					getScreenObject(PROFILE_SCREEN)
				);
			})
			.catch((error) => {
				this.displayFirebaseMessage(
					error,
					this.errorText
				);
				this.toggleAuthProviderSpinner(
					this.googleProviderButton
				);
			});
	}

	/**
	 * Handles authentication with Github.
	 */
	githubAuthProvider() {
		errorText.innerText = "";
		this.toggleAuthProviderSpinner(this.githubProviderButton);
		githubSignInWithPopup()
			.then((_) => {
				fireEvent(
					CHANGE_SCREEN,
					getScreenObject(PROFILE_SCREEN)
				);
			})
			.catch((error) => {
				this.displayFirebaseMessage(
					error,
					this.errorText
				);
				this.toggleAuthProviderSpinner(
					this.githubProviderButton
				);
			});
	}

	/**
	 * Handles authentication with email and password.
	 */
	emailPasswordAuth() {
		errorText.innerText = "";
		const buttonText =
			this.authMode.value == "login" ? "Log in" : "Sign up";
		this.toggleSpinnerVisibility(this.authButton, buttonText);
		if (!this.validatePassword())
			this.toggleSpinnerVisibility(
				this.authButton,
				buttonText
			);
		if (this.authMode.value == "login") {
			signIn(this.email.value, this.password.value)
				.then((_) => {
					fireEvent(
						CHANGE_SCREEN,
						getScreenObject(PROFILE_SCREEN)
					);
				})
				.catch((error) => {
					this.displayFirebaseMessage(
						error,
						this.errorText
					);
					this.toggleSpinnerVisibility(
						this.authButton,
						buttonText
					);
				});
		} else if (this.authMode.value == "signup") {
			signUp(this.email.value, this.password.value)
				.then((_) => {
					fireEvent(
						CHANGE_SCREEN,
						getScreenObject(PROFILE_SCREEN)
					);
				})
				.catch((error) => {
					this.displayFirebaseMessage(
						error,
						this.errorText
					);
					this.toggleSpinnerVisibility(
						this.authButton,
						buttonText
					);
				});
		} else {
			this.displayFirebaseMessage(
				"Unknown mode",
				this.errorText
			);
			this.toggleSpinnerVisibility(
				this.authButton,
				buttonText
			);
		}
	}

	/**
	 * Changes between login and signup mode.
	 */
	changeAuthenticationMode() {
		if (this.authMode.value == "login") {
			this.authMode.value = "signup";
			this.modeTitle.innerText = "Sign up to Codetyper";
			this.modeSwitchText.innerText =
				"Already have an account?";
			this.modeSwitchButton.innerText = "Login";
			this.authButton.innerText = "Sign up";
			this.authForgotCredentials.style.display = "none";
		} else {
			this.authMode.value = "login";
			this.modeTitle.innerText = "Login to Codetyper";
			this.modeSwitchText.innerText =
				"Don't have an account?";
			this.modeSwitchButton.innerText = "Signup";
			this.authButton.innerText = "Log in";
			this.authForgotCredentials.style.display = "block";
		}
	}

	/**
	 * Add/remove the loading spinner from the element.
	 * @param {HTMLElement} element - Element where the spinner should be.
	 */
	toggleAuthProviderSpinner(element) {
		if (
			element.firstElementChild.classList.contains(
				"auth-button-spinner"
			)
		) {
			element.firstElementChild.classList.remove(
				"auth-button-spinner"
			);
			element.lastElementChild.style.display = "block";
		} else {
			element.firstElementChild.classList.add(
				"auth-button-spinner"
			);
			element.lastElementChild.style.display = "none";
		}
	}

	/**
	 * Shows a spinner to indicate loading
	 * @param {HTMLElement} element - Spinner element.
	 * @param {string} text - Text to show.
	 */
	toggleSpinnerVisibility(element, text) {
		if (!document.getElementById("loadingSpinner")) {
			element.innerText = "";
			element.insertAdjacentElement(
				"afterbegin",
				this.authSpinner
			);
		} else {
			element.removeChild(element.lastChild);
			element.innerText = text;
		}
	}

	/**
	 * Shows a message from Firebase to the user.
	 * @param {*} error - Message from Firebase.
	 * @param {HTMLElement} element - Element to show the message in.
	 */
	displayFirebaseMessage(error, element) {
		try {
			var error = error.code
				.replace("auth/", "")
				.split("-")
				.join(" ");
			element.innerText =
				error.charAt(0).toUpperCase() + error.slice(1);
		} catch {
			console.log(error);
		}
	}

	/**
	 * Shows an error message to the user.
	 * @param {string} error - The error message.
	 */
	displayError(error) {
		this.errorText.innerHTML = error;
	}

	/**
	 * Checks that the user entered a valid password.
	 * @returns {boolean} true if the password is valid, false otherwise.
	 */
	validatePassword() {
		if (this.password.value.length < 8) {
			this.displayError(
				"Your password must be at least 8 characters"
			);
			return false;
		}
		if (this.password.value.search(/[a-z]/i) < 0) {
			this.displayError(
				"Your password must contain at least one letter."
			);
			return false;
		}
		if (this.password.value.search(/[0-9]/) < 0) {
			this.displayError(
				"Your password must contain at least one digit."
			);
			return false;
		}
		return true;
	}

	/**
	 * Opens the modal that lets the user reset their password.
	 */
	openResetModal() {
		// removes the auth modal
		this.modal.remove();
		this.screenContainer.innerHTML += RESET_HTML;

		this.resetModal = document.getElementById("resetModal");

		this.resetPasswordEmailInput = document.getElementById(
			"resetPasswordEmailInput"
		);

		// in case we had an email filled in the email input we directoy refill it here
		this.resetPasswordEmailInput.value = this.email.value;

		this.resetButton = document.getElementById("resetButton");
		this.resetMessage = document.getElementById("resetMessage");

		this.resetCancelButton =
			document.getElementById("resetModalCancel");
		this.backToLoginButton =
			document.getElementById("resetBackToLogin");

		this.registerResetEventListeners();
	}

	/**
	 * Adds event handlers to buttons.
	 */
	registerResetEventListeners() {
		this.resetButton.addEventListener("click", () =>
			this.sendResetEmail()
		);

		this.backToLoginButton.addEventListener("click", () => {
			this.resetModal.remove();
			this.enter();
		});

		this.resetCancelButton.addEventListener("click", () => {
			this.resetModal.remove();
		});
	}

	/**
	 * Sends an email to the user where they can reset the password.
	 */
	sendResetEmail() {
		this.toggleSpinnerVisibility(this.resetButton, "Send Email");
		resetPassword(this.resetPasswordEmailInput.value)
			.then(() => {
				this.resetMessage.innerText =
					"Email Sent Successfully";
				this.toggleSpinnerVisibility(
					this.resetButton,
					"Sent"
				);
			})
			.catch((error) => {
				this.displayFirebaseMessage(
					error,
					this.resetMessage
				);
				this.toggleSpinnerVisibility(
					this.resetButton,
					"Send Email"
				);
			});
	}

	/**
	 * Hides the login popup.
	 */
	leave() {
		this.modal.remove();
	}
}

const AUTH_HTML = `
<div id="authModal" class="auth-modal-container">
        <div class="auth-modal-subcontainer">
                <div class="auth-modal">
                        <div class="auth-modal-cancel" id="authModalCancel" type="button">
                                <svg height="18" width="18" viewBox="0 0 24 24" aria-hidden="true" aria-label=""
                                        role="img">
                                        <path
                                                d="m15.18 12 7.16-7.16c.88-.88.88-2.3 0-3.18-.88-.88-2.3-.88-3.18 0L12 8.82 4.84 1.66c-.88-.88-2.3-.88-3.18 0-.88.88-.88 2.3 0 3.18L8.82 12l-7.16 7.16c-.88.88-.88 2.3 0 3.18.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66L12 15.18l7.16 7.16c.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66.88-.88.88-2.3 0-3.18L15.18 12z">
                                        </path>
                                </svg>
                        </div>

                        <div class="auth-modal-title">
                                <h1 id="authModeTitle">
                                        Login to Codetyper
                                </h1>
                        </div>
                        <p class="auth-modal-warning" id="errorText"></p>
                        <div class="auth-modal-form">
                                <div id="authForm">
                                        <div class="auth-modal-input">
                                                <fieldset>
                                                        <label for="email">Email</label>
                                                        <input aria-invalid="false" autocomplete="email"
                                                                name="emailInput" id="emailInput"
                                                                placeholder="Email Adress" type="email" value="" />
                                                </fieldset>
                                        </div>
                                        <div class="auth-modal-input">
                                                <fieldset>
                                                        <label for="email">Email</label>
                                                        <input aria-invalid="false" autocomplete="password"
                                                                id="passwordInput" name="passwordInput"
                                                                placeholder="Password" type="password" value="" />
                                                </fieldset>
                                        </div>
                                        <div>
                                                <div class="auth-forgot-credential" id="authForgotCredential">
                                                        <a>Forgot your password?</a>
                                                </div>
                                        </div>

                                        <div>
                                                <button style="color: var(--button-fg);" id="authButton"
                                                        class="auth-button">
                                                        Log in
                                                </button>
                                        </div>
                                        <input name="authMode" id="authMode" value="login" style="display: none;">
                                </div>
                                <p class="auth-OR">
                                        OR
                                </p>
                                <div style="margin-top: 10px;">
                                        <div>
                                                <button id="githubAuthProviderButton"
                                                        class="auth-button auth-button-github">
                                                        <svg aria-hidden="true" viewBox="0 0 16 16" version="1.1">
                                                                <path fill-rule="evenodd"
                                                                        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z">
                                                                </path>
                                                        </svg>
                                                        <div>Continue with GitHub</div>
                                                </button>
                                                <button id="googleAuthProviderButton"
                                                        class="auth-button auth-button-google">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                                <g
                                                                        transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                                                        <path fill="#4285F4"
                                                                                d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                                                        <path fill="#34A853"
                                                                                d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                                                        <path fill="#FBBC05"
                                                                                d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                                                        <path fill="#EA4335"
                                                                                d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                                                </g>
                                                        </svg>
                                                        <div>Continue with Google</div>
                                                </button>
                                        </div>
                                        <div style="height: 10px;"></div>
                                </div>
                        </div>
                        <div class="auth-switch">
                                <p id="authModeSwitchText">Don't have an account?</p> <span
                                        id="authModeSwitchButton">Signup</span>
                        </div>
                </div>
        </div>
</div>
`;

const RESET_HTML = `
<div id="resetModal" class="reset-modal-container">
  <div class="reset-modal-subcontainer">
    <div class="reset-modal">
      <div class="reset-modal-cancel" id="resetModalCancel" type="button">
        <svg
          height="18"
          width="18"
          viewBox="0 0 24 24"
          aria-hidden="true"
          aria-label=""
          role="img"
        >
          <path
            d="m15.18 12 7.16-7.16c.88-.88.88-2.3 0-3.18-.88-.88-2.3-.88-3.18 0L12 8.82 4.84 1.66c-.88-.88-2.3-.88-3.18 0-.88.88-.88 2.3 0 3.18L8.82 12l-7.16 7.16c-.88.88-.88 2.3 0 3.18.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66L12 15.18l7.16 7.16c.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66.88-.88.88-2.3 0-3.18L15.18 12z"
          ></path>
        </svg>
      </div>

      <div class="reset-modal-title">
        <h1>Password Reset</h1>
        <p>
          we will send you an email containing a link to reset your password
        </p>
        <p id="resetMessage"></p>
      </div>

      <div class="reset-modal-form">
        <div id="resetForm">
          <div class="reset-modal-input">
            <fieldset>
              <label for="email">Email Adress</label>
              <input
                aria-invalid="false"
                autocomplete="email"
                name="resetPasswordEmailInput"
                id="resetPasswordEmailInput"
                placeholder="Email Adress"
                type="email"
                value=""
              />
            </fieldset>
          </div>
          <div class="reset-modal-input">
            <fieldset>
              <label for="email">Email Adress</label>
            </fieldset>
          </div>

          <div>
            <button
              style="color: var(--button-fg)"
              id="resetButton"
              class="reset-button"
            >
              Send Email
            </button>
          </div>
        </div>
      </div>
      <p id="resetBackToLogin">Go back to Login</p>
    </div>
  </div>
</div>

`;

export default AuthScreen;
