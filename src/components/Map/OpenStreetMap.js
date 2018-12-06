import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
});

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

class OpenStreetMap extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mapType: '1',
			dataSet: data,
		}

		this.changeMapType = this.changeMapType.bind(this);
		this.changeColor = this.changeColor.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	changeMapType(event) {
		this.setState({
			mapType: event.currentTarget.id,
		});
	}

	changeColor(event) {
		const items = this.state.dataSet;
		items[event.target.id].color = event.target.value;

		this.setState({
			dataSet: items,
		});
	}

	handleClick(event) {
		const items = this.state.dataSet;
		items[event.target.id].visible = !items[event.target.id].visible;

		this.setState({
			dataSet: items,
		})
	}

	render() {
		const { mapType, dataSet } = this.state;

		function setColor(color) {
			return (
				`<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
 "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="50.000000pt" height="82.000000pt" viewBox="0 0 50.000000 82.000000"
 preserveAspectRatio="xMidYMid meet">
<g transform="translate(0.000000,82.000000) scale(0.050000,-0.050000)"
fill="${color}" stroke="none">
<path d="M340 1578 c-238 -94 -371 -335 -317 -575 29 -128 441 -953 477 -953
32 0 412 751 462 914 117 382 -262 756 -622 614z m271 -347 c150 -150 -69
-374 -223 -229 -102 95 -28 278 112 278 39 0 80 -18 111 -49z"/>
</g>
</svg>
`)
		}

		function returnSvgIcon(color) {
			var CustomIcon = L.Icon.extend({
				options: {
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
				}
			});

			const icon = setColor(color);
			return new CustomIcon({
				iconUrl: encodeURI("data:image/svg+xml," + icon)
			});

		}

		return (
			<div>
				<div style={{ 'position': 'absolute', 'zIndex': '2', 'paddingLeft': '600px' }}>
					<button id={1} onClick={this.changeMapType}>Simple</button>
					<button id={2} onClick={this.changeMapType}>Satellite</button>
					<button id={3} onClick={this.changeMapType}>Hybrid</button>
				</div>
				<div /* style={{ 'zIndex': '10', 'paddingLeft': '800px', 'paddingTop': '100px', 'position': 'absolute' }} */>
					{dataSet.map(function (item, index) {
						return (
							<div key={index}>
								<button id={index} onClick={this.handleClick}>Project {index} </button>
								<select id={index} value={item.color} onChange={this.changeColor}>
									<option value='Green'>Green</option>
									<option value='Red'>Red</option>
									<option value='Yellow'>Yellow</option>
									<option value='Blue'>Blue</option>
									<option value='Brown'>Brown</option>
									<option value='Purple'>Purple</option>
									<option value='Orange'>Orange</option>
									<option value='Grey'>Grey</option>
								</select>
							</div>)
					}, this)}
				</div>
				<Map center={[57.043271, 9.921155]} zoom={13} attributionControl={false} style={{
					'height': '600px',
					'width': '800px',
					'margin': '0 auto',
					'zIndex': '1',
					'borderRadius': '5px',
				}}>
					<TileLayer
						url={mapType === '1' ? "https://gc2.io/mapcache/baselayers/tms/1.0.0/geodk.bright/{z}/{x}/{-y}.png?{s}" ://"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" :
							mapType === '2' ? "http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga" :
								"http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga"} />
					{dataSet.map(function (item, i) {
						return (
							item.coords.map( (coord, index) => {
								if (item.visible) return (
									<Marker position={coord} key={index} icon={returnSvgIcon(item.color)}>
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
					})}
				</Map>
			</div>
		)

	}
}

export default OpenStreetMap