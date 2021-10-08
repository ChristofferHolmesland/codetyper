class ResultScreen extends Screen {
	constructor(element) {
		super("Result!", element, RESULT_SCREEN_HTML);
	}

	enter(payload) {
		super.enter(payload);
		document.getElementById("restartButton").addEventListener(
			"click",
			() => location.reload()
		);

		document.getElementById("sourceDiv").innerHTML = payload.source;
		document.getElementById("difficulty").innerHTML =
			payload.codeDifficulty;
		document.getElementById("cpmDiv").innerHtml = "" + payload.cpm;
		document.getElementById("wpmDiv").innerHTML = "" + payload.wpm;
		document.getElementById("accuracy").innerHTML =
			"" + payload.accuracy + "%";
		document.getElementById("rawCpmDiv").innerHTML =
			"" + payload.rawCpm;
		document.getElementById("rawWpmDiv").innerHTML =
			"" + payload.rawWpm;
		document.getElementById("langDiv").innerHTML = payload.language;

		if (payload.accuracy < 50) {
			document.getElementById("accuracy").style.color =
				"var(--error)";
		}

		this.graphFunctions(payload);
	}

	leave() {
		return {};
	}

	graphFunctions(payload) {
		const chartConfig = this.getChartConfig(payload);
		const graphParent = document.getElementById(
			"result-graph-container"
		);
		const graphCanvas = `<canvas id="result-graph" class="graph" style="width:100%;height:100%;"> </canvas>`;
		graphParent.innerHTML = graphCanvas;
		const graphCanvasDOM = document.getElementById("result-graph");

		const chart = new Chart(graphCanvasDOM, chartConfig, {
			maintainAspectRatio: false,
		});

		graphCanvasDOM.style.height = "10vh";
		graphCanvasDOM.style.width = "20vw";
	}

	getChartConfig(payload) {
		const data = {
			labels: payload.wpmData.labels,
			datasets: [
				{
					label: "WPM Progress",
					data: payload.wpmData.data,
					fill: false,
					borderColor: "rgb(75, 192, 192)",
					tension: 0.1,
					pointHitRadius: 20,
				},
			],
		};

		const graphConfig = {
			type: "line",
			data: data,
		};

		return graphConfig;
	}
}

const RESULT_SCREEN_HTML = `
<div id="resultDiv">
	<div class="flex-row">
		<div class="results-left">
			<span class="result-title"> CPM</span>
			<br />
			<span id="cpmDiv"> </span>
			<br />
			<br />
			<span class="result-title"> WPM</span> <br />

			<span id="wpmDiv"></span>
			<br />
			<br />
			<span class="result-title"> Acc</span> <br />

			<span id="accuracy"> </span>
			<br />
			<br />
			<div></div>
			<br />
		</div>

		<div
			id="result-graph-container"
			class="result-graph-container"
		></div>
	</div>

	<div class="results-bottom">
		<span class="container source">
			<div class="result-title">Source</div>
			<div id="sourceDiv"></div>
		</span>
		<span class="container lang">
			<div class="result-title">Language</div>
			<div id="langDiv"></div
		></span>
		<span class="container raw-cpm">
			<div class="result-title">Raw CPM</div>
			<div id="rawCpmDiv"></div>
		</span>
		<span class="container raw-wpm"
			><div class="result-title">Raw WPM</div>
			<div id="rawWpmDiv"></div>
		</span>
		<span class="container diff"
			><div class="result-title">
				Difficulty
			</div>
			<div id="difficulty"></div
		></span>
	</div>

	<div class="resultButtons">
		<button id="restartButton" type="button">
			<!-- Restart -->
			<span class="material-icons-round">
				home
			</span>
		</button>
	</div>
</div>
`;
