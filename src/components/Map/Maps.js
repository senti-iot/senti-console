import React from "react";
import { compose, withProps, /* withStateHandlers */ } from "recompose";
import {
	withScriptjs,
	withGoogleMap,
	// GoogleMap,
} from "react-google-maps";
import { CircularLoader } from "..";
// import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
// import MarkerWithInfo from './MarkerWithInfo'
import MapComponent from './MapComponent';

export const Maps = compose(
	withProps({
		googleMapURL:
			"https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_SENTI_MAPSKEY + "&v=3.exp&libraries=geometry,drawing,places",
		loadingElement: <CircularLoader notCentered />,
		containerElement: <div style={{ height: `calc(100vh - 166px)`, width: '100%' }} />,
		mapElement: <div id={'map'} style={{ height: `100%` }}/>
	}),
	withScriptjs,
	withGoogleMap
)(MapComponent)

/* props => {
	let defaultLat = parseFloat(56.2639) //Denmark,
	let defaultLng = parseFloat(9.5018) //Denmark
	if (!props.centerDenmark) {
		defaultLat = props.markers[0] ? props.markers[0].lat : defaultLat
		defaultLng = props.markers[0] ? props.markers[0].long : defaultLng
	}


	return <GoogleMap defaultZoom={props.zoom ? props.zoom : 7} defaultCenter={{ lat: defaultLat, lng: defaultLng }}>

		<MarkerClusterer
			onClick={props.onMarkerClustererClick}
			averageCenter
			enableRetinaIcons
			gridSize={10}
		>
			{props.markers.length > 0 ? props.markers.map((m, i) => {
				if (m.lat && m.long)
					return <MarkerWithInfo t={props.t} key={i} m={m} i={i}/>
				else
					return null
			})
				: null}
		</MarkerClusterer>
	</GoogleMap>
} */