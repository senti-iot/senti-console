import React, { Component } from 'react'
import MarkerWithInfo from './MarkerWithInfo';
import { GoogleMap/*,  Circle */ } from 'react-google-maps';
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
// import { colors } from 'variables/colors';

class MapComponent extends Component {
	constructor(props) {
		super(props)

		this.state = {
			init: false
		}
		this.map = React.createRef()
	}

	setCenterAndZoom() {
		if (!this.state.init) {
			const bounds = new window.google.maps.LatLngBounds()
			this.props.markers.forEach(bound => {
				if (bound.lat && bound.long)
					return (
						bounds.extend(new window.google.maps.LatLng(bound.lat, bound.long))
					)
			})
			var offset = 0.002;
			var center = bounds.getCenter();
			bounds.extend(new window.google.maps.LatLng(center.lat() + offset, center.lng() + offset));
			bounds.extend(new window.google.maps.LatLng(center.lat() - offset, center.lng() - offset));
			this.map.current.fitBounds(bounds)
			this.map.current.panToBounds(bounds, 10);
		}
		this.setState({
			init: true
		})
	}
	createHeatmapLayerPoints = () => {
		console.log(this.props.markers)
		let hArr = this.props.markers.map(point => (
			{
				location: new window.google.maps.LatLng(point.lat, point.long),
				weight: Math.floor(Math.random() * 1001)
			}))
		return hArr
	}

	render() {
		// console.log(this.props.zoom)
		let props = this.props
		let defaultLat = parseFloat(56.2639) //Denmark,
		let defaultLng = parseFloat(9.5018) //Denmark
		// if (!props.centerDenmark) {
		// 	defaultLat = props.markers[0] ? props.markers[0].lat : defaultLat
		// 	defaultLng = props.markers[0] ? props.markers[0].long : defaultLng
		// }
		// this.createHeatmapLayerPoints()
		// console.log(this)
		return <GoogleMap
			defaultZoom={props.zoom ? props.zoom : 7}
			defaultCenter={{ lat: defaultLat, lng: defaultLng }}
			ref={this.map}
			onTilesLoaded={() => this.setCenterAndZoom()}
		>
			{/* {this.createHeatmapLayerPoints().map((d, i) => {
				return <Circle
					id={i}
					options={{
						fillColor: colors[i],
						strokeColor: colors[i]
					}}
					defaultCenter={d.location}
					radius={d.weight}
				/>
			})} */}
			{/* <HeatmapLayer data={this.createHeatmapLayerPoints()}/> */}
			<MarkerClusterer
				onClick={props.onMarkerClustererClick}
				// averageCenter
				enableRetinaIcons
				gridSize={8}
			>
				{props.markers.length > 0 ? props.markers.map((m, i) => {
					if (m.lat && m.long)
						return <MarkerWithInfo t={props.t} key={i} m={m} i={i} weather={m.weather} />
					else
						return null
				})
					: null}
			</MarkerClusterer>
		</GoogleMap>
	}
}

export default MapComponent
