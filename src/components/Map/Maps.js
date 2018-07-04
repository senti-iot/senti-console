import React from "react";
import { compose, withProps } from "recompose";
import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker
} from "react-google-maps";
// import { PinDrop } from '@material-ui/icons'
import CircularLoader from "../Loader/CircularLoader";
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";

export const Maps = compose(
	withProps({
		googleMapURL:
			"https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_SENTI_MAPSKEY + "&v=3.exp&libraries=geometry,drawing,places",
		loadingElement: <CircularLoader notCentered/>,
		containerElement: <div style={{ height: `calc(100vh - 268px)`, width: '100%'  }} />,
		mapElement: <div id={'map'} style={{ height: `100%` }}>HelloWorld</div>
	}),
	withScriptjs,
	withGoogleMap
)(props => {
	let defaultLat = props.markers[0] ? props.markers[0].lat : parseFloat(55.298) //Denmark,
	let defaultLng = props.markers[0] ? props.markers[0].long : parseFloat(10.605) //Denmark
	console.log(defaultLat, defaultLng)
	return <GoogleMap defaultZoom={props.zoom ? props.zoom : 7} defaultCenter={{ lat: defaultLat, lng: defaultLng } }>
		{props.isMarkerShown && (
			<MarkerClusterer
				onClick={props.onMarkerClustererClick}
				averageCenter
				enableRetinaIcons
				gridSize={10}
			>
				{props.markers.length > 0 ? props.markers.map((m, i) => {
					return <Marker /* label={m.device_id.toString()} */	/*  icon={{ url: svg }}*/ onClick = {() => alert('bing')} key={i} position={{ lat: m.lat, lng: m.long }} />
				})
					: null}
			</MarkerClusterer>
		)}
	</GoogleMap>
}
)