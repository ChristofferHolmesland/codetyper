class Screen {
	constructor(title, rootElement, html) {
		this.title = title;
		this.rootElement = rootElement;
		this.html = html;
	}
	
	enter(payload) {
		document.title = "codetyper - " + this.title;
		this.rootElement.innerHTML = this.html;
	}

	leave() {
		return {};
	}
}