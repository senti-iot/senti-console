import React, { useState, useRef } from 'react'
import CalibrationMarker from './CalibrationMarker';
import { GoogleMap } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
// import { useSelector } from 'react-redux'

// const mapStateToProps = (state) => ({
// 	language: state.settings.language
// })

const CalibrateMapComponent = props => {
	// const language = useSelector(state => state.settings.language)
	const map = useRef(null)
	// const [init, setInit] = useState(false)
	const [markerDrop, setMarkerDrop] = useState(null)

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		init: false, 
	// 		markerDrop: null
	// 	}
	// 	this.map = React.createRef()
	// }

	// const setCenterAndZoom = () => {
	// 	if (!init) {
	// 		const bounds = new window.google.maps.LatLngBounds()
	// 		props.markers.forEach(bound => {
	// 			if (bound.lat && bound.long)
	// 				return (
	// 					bounds.extend(new window.google.maps.LatLng(bound.lat, bound.long))
	// 				)
	// 		})
	// 		var offset = 0.002;
	// 		var center = bounds.getCenter();
	// 		bounds.extend(new window.google.maps.LatLng(center.lat() + offset, center.lng() + offset));
	// 		bounds.extend(new window.google.maps.LatLng(center.lat() - offset, center.lng() - offset));
	// 		map.current.fitBounds(bounds)
	// 		map.current.panToBounds(bounds, 10);
	// 	}
	// 	setInit(true)
	// 	// this.setState({
	// 	// 	init: true
	// 	// })
	// }
	const dropPin = e => {
		let pin = {
			lat: e.latLng.lat(),
			long: e.latLng.lng()
		}
		setMarkerDrop({
			lat: e.latLng.lat(),
			long: e.latLng.lng()
		})
		// this.setState({
		// 	markerDrop: {
		// 		lat: e.latLng.lat(),
		// 		long: e.latLng.lng()
		// 	}
		// })
		return props.onClick ? props.onClick(pin) : null
	}

	// let props = props
	let defaultLat = parseFloat(56.2639) //Denmark,
	let defaultLng = parseFloat(9.5018) //Denmark
	return <GoogleMap
		onClick={dropPin}
		defaultZoom={props.zoom ? props.zoom : 7}
		defaultCenter={{ lat: defaultLat, lng: defaultLng }}
		ref={map}
	>
		<MarkerClusterer
			// onClick={onMarkerClustererClick}
			averageCenter
			maxZoom={15}
			enableRetinaIcons
			gridSize={8}
		>
			{markerDrop ? <CalibrationMarker
				lang={props.language}
				t={props.t}
				i={0}
				m={markerDrop}
				weather={null} /> : null}

		</MarkerClusterer>
	</GoogleMap>
}

export default CalibrateMapComponent