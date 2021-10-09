const path = require("path");
const index = path.join(__dirname, "..", "..", "index.html");

describe("Test language buttons", () => {
	it("Buttons are visible", () => {
		cy.visit(index);

		cy.contains("button", "Bash");
		cy.contains("button", "C");
		cy.contains("button", "C#");
		cy.contains("button", "Go");
		cy.contains("button", "Java");
		cy.contains("button", "JavaScript");
		cy.contains("button", "Kotlin");
		cy.contains("button", "Python");
		cy.contains("button", "Rust");
	});

	it("Bash test", () => {
		cy.visit(index);
		cy.contains("button", "Bash").click();

		cy.get("#words").type("#!/bin/bash{enter}");
		cy.get("#words").type("{enter}");
		cy.get("#words").type("hello_world () {{}{enter}");
		cy.get("#words").type(" echo 'Hello, World!'{enter}");
		cy.get("#words").type("}{enter}");
		cy.get("#words").type("{enter}");
		cy.get("#words").type("hello_world{enter}");

		cy.contains("#accuracy", "100%")
		cy.contains("#sourceDiv", "Codetyper");
		cy.contains("#langDiv", "Bash");
		cy.contains("#difficulty", "Easy");
	});

	it("C test", () => {
		cy.visit(index);
		cy.contains("button", "C").click();

		cy.get("#words").type("int main() {{}{enter}");
		cy.get("#words").type("	printf(\"Hello, World!\");{enter}");
		cy.get("#words").type("	return 0;{enter}");
		cy.get("#words").type("}{enter}");

		cy.contains("#accuracy", "100%")
		cy.contains("#sourceDiv", "Codetyper");
		cy.contains("#langDiv", "C");
		cy.contains("#difficulty", "Easy");
	});

	it("C# test", () => {
		cy.visit(index);
		cy.contains("button", "C#").click();

		cy.get("#words").type("static void Main(string[] args) {{}{enter}");
		cy.get("#words").type("	System.Console.WriteLine(\"Hello World!\");{enter}");
		cy.get("#words").type("}{enter}");

		cy.contains("#accuracy", "100%")
		cy.contains("#sourceDiv", "Codetyper");
		cy.contains("#langDiv", "C#");
		cy.contains("#difficulty", "Easy");
	});

	it("C++ test", () => {
		cy.visit(index);
		cy.contains("button", "C++").click();

		cy.get("#words").type("int main() {{}{enter}");
		cy.get("#words").type("	std::cout << \"Hello World!\";{enter}");
		cy.get("#words").type("	return 0;{enter}");
		cy.get("#words").type("}{enter}");

		cy.contains("#accuracy", "100%")
		cy.contains("#sourceDiv", "Codetyper");
		cy.contains("#langDiv", "C++");
		cy.contains("#difficulty", "Easy");
	});

	it("Go test", () => {
		cy.visit(index);
		cy.contains("button", "Go").click();
		
		cy.get("#words").type("func main() {{}{enter}");
		cy.get("#words").type("	fmt.Println(\"Hello, World!\"){enter}");
		cy.get("#words").type("}{enter}");

		cy.contains("#accuracy", "100%")
		cy.contains("#sourceDiv", "Codetyper");
		cy.contains("#langDiv", "Go");
		cy.contains("#difficulty", "Easy");
	});

	it("Java test", () => {
		cy.visit(index);
		cy.contains("button", "Java").click();

		cy.get("#words").type("public static void main(String[] args) {{}{enter}");
		cy.get("#words").type("	String greeting = \"Hello\";{enter}");
		cy.get("#words").type("	System.out.println(greeting);{enter}");
		cy.get("#words").type("}{enter}");

		cy.contains("#accuracy", "100%")
		cy.contains("#sourceDiv", "Codetyper");
		cy.contains("#langDiv", "Java");
		cy.contains("#difficulty", "Easy");
	});

	it("JavaScript test", () => {
		cy.visit(index);
		cy.contains("button", "JavaScript").click();

		cy.get("#words").type("function main() {{}{enter}");
		cy.get("#words").type("	console.log(\"Hello, World!\");{enter}");
		cy.get("#words").type("};{enter}");
		cy.get("#words").type("main();{enter}");

		cy.contains("#accuracy", "100%")
		cy.contains("#sourceDiv", "Codetyper");
		cy.contains("#langDiv", "JavaScript");
		cy.contains("#difficulty", "Easy");
	});

	it("Kotlin test", () => {
		cy.visit(index);
		cy.contains("button", "Kotlin").click();

		cy.get("#words").type("fun main() {{}{enter}");
		cy.get("#words").type("	println(\"Hello, World!\"){enter}");
		cy.get("#words").type("}{enter}");

		cy.contains("#accuracy", "100%")
		cy.contains("#sourceDiv", "Codetyper");
		cy.contains("#langDiv", "Kotlin");
		cy.contains("#difficulty", "Easy");
	});

	it("Python test", () => {
		cy.visit(index);
		cy.contains("button", "Python").click();

		cy.get("#words").type("if __name__ == \"__main__\":{enter}");
		cy.get("#words").type(" print(\"Hello, world!\"){enter}");
		cy.get("#words").type(" print(\" - Christoffer\"){enter}");

		cy.contains("#accuracy", "100%")
		cy.contains("#sourceDiv", "Codetyper");
		cy.contains("#langDiv", "Python");
		cy.contains("#difficulty", "Easy");
	});

	it("Rust test", () => {
		cy.visit(index);
		cy.contains("button", "Rust").click();

		cy.get("#words").type("fn main() {{}{enter}");
		cy.get("#words").type("	println!(\"Hello World!\");{enter}");
		cy.get("#words").type("}{enter}");

		cy.contains("#accuracy", "100%")
		cy.contains("#sourceDiv", "Codetyper");
		cy.contains("#langDiv", "Rust");
		cy.contains("#difficulty", "Easy");
	});
});

describe("Query parameters", () => {
	it("test parameter", () => {
		cy.visit(index + "?test=aW50IG1haW4oKSB7CglwcmludGYoIkhlbGxvLCBXb3JsZCEiKTsKCXJldHVybiAwOwp9");

		cy.get("#words").type("int main() {{}{enter}");
		cy.get("#words").type("	printf(\"Hello, World!\");{enter}");
		cy.get("#words").type("	return 0;{enter}");
		cy.get("#words").type("}{enter}");

		cy.contains("#accuracy", "100%")
		cy.contains("#sourceDiv", "External");
		cy.contains("#langDiv", "Unknown");
		cy.contains("#difficulty", "Easy");
	});
});
