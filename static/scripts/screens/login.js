import Screen from "./screen.js";
import { signIn, signUp } from "../firebase/service.js";
import { getScreenObject, PROFILE_SCREEN } from "./screens.js";
import { fireEvent, CHANGE_SCREEN } from "../events/bus.js";

class LoginScreen extends Screen {
	constructor(element) {
		super("Login", element, LOGIN_HTML);
	}

	enter(payload) {
		super.enter(payload);

		this.emailInput = document.getElementById("emailInput");
		this.passwordInput = document.getElementById("passwordInput");

		document.getElementById("loginButton").addEventListener(
			"click",
			() => this.performLogin()
		);
		document.getElementById("signUpButton").addEventListener(
			"click",
			() => this.performSignup()
		);
	}

	performSignup() {
		signUp(this.emailInput.value, this.passwordInput.value)
			.then((userCrendential) => {
				console.log(userCrendential);
				fireEvent(
					CHANGE_SCREEN,
					getScreenObject(PROFILE_SCREEN)
				);
			})
			.catch((error) => {
				console.log(error.code);
				console.log(error.message);
				console.log(error);
			});
	}

	performLogin() {
		signIn(this.emailInput.value, this.passwordInput.value)
			.then((userCrendential) => {
				console.log(userCrendential);
				fireEvent(
					CHANGE_SCREEN,
					getScreenObject(PROFILE_SCREEN)
				);
			})
			.catch((error) => {
				console.log(error.code);
				console.log(error.message);
				console.log(error);
			});
	}

	leave() {
		return {};
	}
}

const LOGIN_HTML = `
<div id="login">
	<h1>Login</h1>
	<form id="loginForm">
		<label for="emailInput">Email:</label>
		<input type="text" id="emailInput" name="emailInput">
		<br />
		<label for="passwordInput">Password:</label>
		<input type="password" id="passwordInput" name="passwordInput">

		<div class="flex-row-evenly margin-top">
			<button type="button" id="signUpButton">Sign up</button>
			<button type="button" id="loginButton">Login</button>
		</div>
	</form>
</div>
`;

export default LoginScreen;
