import Screen from "./screen.js";

class LoginScreen extends Screen {
	constructor(element) {
		super("Login", element, LOGIN_HTML);
	}

	enter(payload) {
		super.enter(payload);
	}

	leave() {
		return {};
	}
}

const LOGIN_HTML = `
<p>Login</p>
`;

export default LoginScreen;
