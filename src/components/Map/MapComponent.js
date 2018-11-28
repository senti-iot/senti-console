import React, { Component } from 'react'
import MarkerWithInfo from './MarkerWithInfo';
import { GoogleMap,  Circle  } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
// import { colors } from 'variables/colors';
import { connect } from 'react-redux'
import { colors } from 'variables/colors';
import { withStyles } from '@material-ui/core';
import darkMode from './mapStyle';


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
		let hArr = this.props.markers.map(point => (
			{
				location: new window.google.maps.LatLng(point.lat, point.long),
				weight: (point.data / 1000 )
			}))
		return hArr
	}
	render() {
		let props = this.props
		let defaultLat = parseFloat(56.2639) //Denmark,
		let defaultLng = parseFloat(9.5018) //Denmark
		let darkModeMap = new window.google.maps.StyledMapType(...darkMode)
		return <GoogleMap
			defaultZoom={props.zoom ? props.zoom : 7}
			defaultCenter={{ lat: defaultLat, lng: defaultLng }}
			ref={this.map}
			onTilesLoaded={() => this.setCenterAndZoom()}
			styles={props.mapStyles}
			defaultOptions={{
				// mapStyle,
				// disableDefaultUI: true,
				maxZoom: 18,
				mapTypeControlOptions: {
					mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'dark_mode']
				}
			}}
			mapTypeId={this.props.theme.palette.type === 'dark' ? 'dark_mode' : 'roadmap'}
			defaultExtraMapTypes={[
				['dark_mode', darkModeMap]
			]}
		>
			{this.props.heatMap ? this.createHeatmapLayerPoints().map((d, i) => {
				return <Circle
					key={i}
					id={i}
					options={{
						fillColor: colors[i],
						strokeColor: colors[i],
						strokeWeight: 0.5,
						fillOpacity: 0.1
					}}
					defaultCenter={d.location}
					radius={d.weight}
				/>
			}) : null}
			<MarkerClusterer
				onClick={this.onMarkerClustererClick}
				averageCenter
				maxZoom={15}
				enableRetinaIcons
				gridSize={8}
			>
				{props.markers.length > 0 ? props.markers.map((m, i) => {
					if (m.lat && m.long)
						return <MarkerWithInfo
							lang={props.language}
							t={props.t}
							key={i}
							m={m}
							i={i}
							weather={m.weather} />
					else
						return null
				})
					: null}
			</MarkerClusterer>
		</GoogleMap>
	}
}
const mapStateToProps = (state) => ({
	language: state.settings.language
})

const mapDispatchToProps = {
  
}
MapComponent.defaultProps = {
	// The style is copy from https://snazzymaps.com/style/2/midnight-commander
	mapStyles: [{ "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 13 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#144b53" }, { "lightness": 14 }, { "weight": 1.4 }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#08304b" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#0c4152" }, { "lightness": 5 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#0b434f" }, { "lightness": 25 }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }] }, { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [{ "color": "#0b3d51" }, { "lightness": 16 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "color": "#146474" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#021019" }] }]
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(null, { withTheme: true })(MapComponent))
