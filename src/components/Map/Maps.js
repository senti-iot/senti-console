import React from "react";
import { compose, withProps, /* withStateHandlers */ } from "recompose";
import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	// Marker,
	// InfoWindow,
} from "react-google-maps";
import { CircularLoader } from "..";
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
// import { MarkerIcon } from './MarkerIcon'
import { MarkerWithInfo } from './MarkerWithInfo';

export const Maps = compose(
	// withStateHandlers(() => ({
	// 	isOpen: 0,
	// }), {
	// 	onToggleOpen: ({ id }) => () => ({
	// 		isOpen: id === this.state.isOpen ? 0 : id,
	// 	})
	// }),
	withProps({
		googleMapURL:
			"https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_SENTI_MAPSKEY + "&v=3.exp&libraries=geometry,drawing,places",
		loadingElement: <CircularLoader notCentered />,
		containerElement: <div style={{ height: `calc(100vh - 268px)`, width: '100%' }} />,
		mapElement: <div id={'map'} style={{ height: `100%` }}/>
	}),
	withScriptjs,
	withGoogleMap
)(props => {
	let defaultLat = parseFloat(55.298) //Denmark,
	let defaultLng = parseFloat(10.605) //Denmark
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
					return <MarkerWithInfo key={i} m={m} i={i}/>
				else
					return null
			})
				: null}
		</MarkerClusterer>
	</GoogleMap>
}
)