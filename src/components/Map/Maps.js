import React from "react";
import { compose, withProps } from "recompose";
import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker
} from "react-google-maps";
import CircularLoader from "../Loader/CircularLoader";
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import { MarkerIcon } from './MarkerIcon'

export const Maps = compose(
	withProps({
		googleMapURL:
			"https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_SENTI_MAPSKEY + "&v=3.exp&libraries=geometry,drawing,places",
		loadingElement: <CircularLoader notCentered />,
		containerElement: <div style={{ height: `calc(100vh - 268px)`, width: '100%' }} />,
		mapElement: <div id={'map'} style={{ height: `100%` }}>HelloWorld</div>
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
				return <Marker icon={{ url: `data:image/svg+xml,${MarkerIcon(m.liveStatus)}` }} onClick={() => alert('bing')} key={i} position={{ lat: m.lat, lng: m.long }} />
			})
				: null}
		</MarkerClusterer>
	</GoogleMap>
}
)