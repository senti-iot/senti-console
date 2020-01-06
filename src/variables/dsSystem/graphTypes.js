export const graphType = (type) => {
	switch (type) {
		case "chart": //Charts
			return {
				grid: {
					minW: 4,
					minH: 12,
					x: 0,
					y: 0,
					h: 12,
					w: 6
				},
				chartType: 3, //Line Graph
				dataSource: {
					cf: -1,
					dataKey: "",
					deviceId: -1,
					type: 0
				},
				id: "",
				name: "Chart",
				periodType: 3,
				type: 0,
				unit: ""
			}
		case "gauge": // Gauge
			return {
				grid: {
					minW: 4,
					minH: 12,
					x: 0,
					y: 0,
					h: 12,
					w: 4
				},
				dataSource: {
					cf: -1,
					dataKey: "",
					deviceId: "",
					type: 1
				},
				id: "",
				name: "Gauge",
				periodType: 3,
				type: 1,
				unit: ""
			}
		case "scorecardAB"://Scorecard AB
			return {
				grid: {
					minW: 4,
					minH: 12,
					x: 0,
					y: 0,
					h: 12,
					w: 4
				},
				dataSources: {
					a: {
						cf: -1,
						dataKey: "",
						deviceId: -1,
						label: "",
						type: 0,
						unit: ""
					},
					b: {
						cf: -1,
						dataKey: "",
						deviceId: -1,
						label: "",
						type: 0,
						unit: ""
					}
				},
				id: "",
				name: "Difference Card",
				periodType: 3,
				type: 2,
			}
		case "scorecard": // Score Card
			return {
				grid: {
					minW: 4,
					minH: 12,
					x: 0,
					y: 0,
					h: 12,
					w: 4
				},
				dataSources: [
					{
						cf: -1,
						dataKey: "",
						deviceId: -1,
						label: "",
						type: 0,
						unit: ""
					},
					{
						cf: -1,
						dataKey: "",
						deviceId: -1,
						label: "",
						type: 0,
						unit: ""
					}
				],
				id: "",
				name: "Score Card",
				periodType: 3,
				type: 3
			}
		case "windcard": //Wind Speed card
			return {
				grid: {
					minW: 6,
					minH: 12,
					x: 0,
					y: 0,
					h: 13,
					w: 6
				},
				dataSource: {
					cf: -1,
					dataKey: "",
					deviceId: -1,
					type: 0
				},
				id: "",
				name: "Wind Speed Card",
				periodType: 0,
				type: 4,
				unit: ""
			}
		case "map":
			return {
				grid: {
					minW: 4,
					minH: 12,
					x: 0,
					y: 0,
					h: 12,
					w: 4
				},
				dataSource: {
					cf: -1,
					dataKey: "",
					deviceId: -1,
					type: 0
				},
				id: "",
				name: "Score Card",
				periodType: 3,
				type: 5
			}
		case "msChart": //Charts
			return {
				grid: {
					minW: 4,
					minH: 12,
					x: 0,
					y: 0,
					h: 12,
					w: 6
				},
				chartType: 3, //Line Graph
				dataSource: {
					cf: -1,
					dataKey: "",
					deviceId: -1,
					type: 0
				},
				id: "",
				name: "Chart",
				periodType: 3,
				type: 0,
				unit: ""
			}
		default:
			break;
	}
}