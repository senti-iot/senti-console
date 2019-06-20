export const graphType = (type) => {
	switch (type) {
		case "chart": //Charts
			return {
				grid: {
					minW: 5,
					minH: 8,
					x: 0,
					y: 0,
					h: 8,
					w: 5
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
				periodType: 0,
				type: 0,
				unit: ""
			}
		case "gauge": // Gauge
			return {
				grid: {
					minW: 3,
					minH: 11,
					x: 0,
					y: 0,
					h: 11,
					w: 3
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
					minW: 3,
					minH: 10,
					x: 0,
					y: 0,
					h: 10,
					w: 3
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
					minW: 3,
					minH: 13,
					x: 0,
					y: 0,
					h: 13,
					w: 3
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
					minW: 3,
					minH: 13,
					x: 0,
					y: 0,
					h: 13,
					w: 3
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
		default:
			break;
	}
}