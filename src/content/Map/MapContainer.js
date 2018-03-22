import React, { Component } from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import MapMarker from './MapMarker'
import 'leaflet/dist/leaflet.css'

const data = [
	{
		coords: [
			[57.043271, 9.921155],
			[56.043271, 8.921155],
			[55.043271, 10.521155],
			[57.043271, 9.94921155],
		],
		title: 'Påske',
		description: 'Det er ikke sikkert de hedningekristne menigheder fejrede påske, da hver søndag i forvejen var tilegnet mindet om Kristi opstandelse. I slutningen af det 2. århundrede opstod en strid om festen',
		color: 'Blue',
		visible: true,
	},
	{
		coords: [
			[57.036866, 9.827677],
			[56.946344, 9.762445],
			[56.968808, 10.113321],
			[56.899876, 10.03161],
		],
		title: 'Christmas carnival',
		description: 'On Thursday (Nov 9) the grooviest road in town is getting a bit of a tune-up. The famously fashionable Carnaby Street will celebrate the festive.',
		color: 'Orange',
		visible: true,
	},
	{
		coords: [
			[55.597091, 12.626523],
			[55.63458, 12.594345],
			[55.695892, 12.615736],
			[55.850429, 11.617637],
		],
		title: 'Pub crawl',
		description: 'A pub crawl is the act of drinking in multiple pubs or bars in a single night, normally travelling by foot or public transport to each destination and occasionally by cycle.',
		color: 'Green',
		visible: true,
	},
	{
		coords: [
			[56.099795, 8.630588],
			[54.868639, 9.074428],
			[55.64104, 11.65533],
			[55.614621, 12.637527],
		],
		title: 'Summer festival',
		description: 'Copenhagen Summer Festival præsenterer klassisk kammermusik med unge talenter og prisvindere på højeste niveau fra ind- og udland.',
		color: 'Red',
		visible: true,
	}
]

export default class MapContainer extends Component {
	constructor(props) {
		super(props)

		this.state = {
			mapType: 1,
			dataSet: data
		}
	}
	changeMapType = (event) => {
		this.setState({
			mapType: parseInt(event.currentTarget.id, 10),
		})
	}

	changeColor = (event) => {
		const items = this.state.dataSet
		items[event.target.id].color = event.target.value

		this.setState({
			dataSet: items,
		})
	}

	handleClick = (event) => {
		const items = this.state.dataSet
		items[event.target.id].visible = !items[event.target.id].visible

		this.setState({
			dataSet: items,
		})
	}

	renderSVGIcon = (color) => {
		var CustomIcon = L.divIcon({
			className: 'map-marker', // to override the default black border white background
			iconSize: [25, 25], //The Div size, not the svg size
			html: `${MapMarker(color, '25px')}`

		})
		return CustomIcon

	}
	render() {
		const { mapType, dataSet } = this.state
		return (
			<div style={{ width: '100%', height: '100%', position: 'relative' }}>
				<div style={{ zIndex: 2, position: 'absolute', top: '10px', left: '70%' }}>
					<button id={1} onClick={this.changeMapType}>Simple</button>
					<button id={2} onClick={this.changeMapType}>Satellite</button>
					<button id={3} onClick={this.changeMapType}>Hybrid</button>
				</div>
				{/* <div style={{ 'zIndex': '0', 'paddingLeft': '800px', 'paddingTop': '100px', 'position': 'absolute' }}>
					{dataSet ? dataSet.map((item, index) => {
						return (
							<div key={index}>
								<button id={index} onClick={this.handleClick}>Project {index} </button>
								<select id={index} value={item.color} onChange={this.changeColor}>
									<option value='green'>Green</option>
									<option value='red'>Red</option>
									<option value='yellow'>Yellow</option>
									<option value='blue'>Blue</option>
									<option value='brown'>Brown</option>
									<option value='purple'>Purple</option>
									<option value='orange'>Orange</option>
									<option value='grey'>Grey</option>
								</select>
							</div>)
					}) : null}
				</div> */}
				<Map center={[57.043271, 9.921155]} zoom={13} attributionControl={false} style={{
					height: '100%',
					width: '100%',
					margin: '0 auto',
					zIndex: '1',
					borderRadius: '5px'
				}}>
					<TileLayer
						url={mapType === 1 ? "https://gc2.io/mapcache/baselayers/tms/1.0.0/geodk.bright/{z}/{x}/{-y}.png?{s}" ://"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" :
							mapType === 2 ? "http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga" :
								"http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga"} />
					{dataSet !== undefined ? dataSet.map((item, i) => {
						return (
							item.coords.map((coord, index) => {
								if (item.visible) return (
									<Marker position={coord} key={index} icon={this.renderSVGIcon(item.color)}>
										<Popup>
											<div>
												<h2>{item.title}</h2>
												<h3>{item.description}</h3>
											</div>
										</Popup>
									</Marker>
								)
								else return null
							})
						)
					}) : null}
				</Map>
			</div>
		)

	}
}