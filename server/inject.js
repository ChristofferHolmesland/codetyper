let codeTime = Date.now();

const watchedFiles = {};
const baseURI = window.location.href;

window.addEventListener("load", function () {
	const cssFiles = document.getElementsByTagName("link");
	for (let i = 0; i < cssFiles.length; i++) {
		if (!cssFiles[i].href.includes(baseURI)) {
			continue;
		}

		watchedFiles["/" + cssFiles[i].href.replace(baseURI, "")] = cssFiles[i];
	}
	
	const jsFiles = document.getElementsByTagName("script");
	for (let i = 0; i < jsFiles.length; i++) {
		if (!jsFiles[i].src.includes(baseURI)) {
			continue;
		}

		watchedFiles["/" + jsFiles[i].src.replace(baseURI, "")] = jsFiles[i];
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

			switch (watchedFiles[fileName].nodeName) {
				case "LINK":
					watchedFiles[fileName].href += "";
					break;
				case "SCRIPT":
					const file = watchedFiles[fileName];

					const parent = file.parentNode;
					const newScript = document.createElement("script");
					newScript.setAttribute("type", file.getAttribute("type"));

					if (file.src.lastIndexOf("?") > -1) {
						newScript.src = file.src.substring(0, file.src.lastIndexOf("?")) + `?v=${Date.now()}`;
					} else {
						newScript.src = file.src + `?v=${Date.now()}`;
					}

					parent.removeChild(file);
					parent.appendChild(newScript);

					watchedFiles[fileName] = newScript;
					break;
				default:
					console.log("Reloading of this filetype is not implemented");
			}
		}
	}, 1000);
});