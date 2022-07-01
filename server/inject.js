let codeTime = Date.now();

const watchedFiles = {};
const baseURI = window.location.href;

const cssFiles = document.getElementsByTagName("link");
for (let i = 0; i < cssFiles.length; i++) {
	if (cssFiles[i].baseURI !== baseURI) {
		continue;
	}

	watchedFiles["/" + cssFiles[i].href.replace(baseURI, "")] = cssFiles[i];
}

setInterval(async () => {
	const changes = await fetch(`/api/changes?since=${codeTime}`).then(resp => resp.json());
	if (changes.ts === 0) return;

	codeTime = changes.ts;
	
	for (let i = 0; i < changes.files.length; i++) {
		const fileName = changes.files[i];

		if (watchedFiles[fileName] === undefined) {
			continue;
		}

		console.log("Reloading file: " + fileName);
		watchedFiles[fileName].href += "";
	}
}, 100);