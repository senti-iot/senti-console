import React, { Component } from 'react'
import CalibrationMarker from './CalibrationMarker';
import { GoogleMap } from 'react-google-maps';
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
// import { colors } from 'variables/colors';
import { connect } from 'react-redux'

class CalibrateMapComponent extends Component {
	constructor(props) {
		super(props)

		this.state = {
			init: false, 
			markerDrop: null
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
	dropPin = e => {
		console.log(e)
		window.pin = e
		let pin = {
			lat: e.latLng.lat(),
			long: e.latLng.lng()
		}
		this.setState({
			markerDrop: {
				lat: e.latLng.lat(),
				long: e.latLng.lng()
			}
		})
		return this.props.onClick ? this.props.onClick(pin) : null 
	}
	render() {
		let props = this.props
		let defaultLat = parseFloat(56.2639) //Denmark,
		let defaultLng = parseFloat(9.5018) //Denmark
		return <GoogleMap
			onClick={this.dropPin}
			defaultZoom={props.zoom ? props.zoom : 7}
			defaultCenter={{ lat: defaultLat, lng: defaultLng }}
			ref={this.map}
			// onTilesLoaded={() => this.setCenterAndZoom()}
		>
			<MarkerClusterer
				onClick={this.onMarkerClustererClick}
				averageCenter
				maxZoom={15}
				enableRetinaIcons
				gridSize={8}
			>
				{this.state.markerDrop ? <CalibrationMarker
					lang={props.language}
					t={props.t}
					i={0}
					m={this.state.markerDrop}
					weather={null}/> : null}
			
			</MarkerClusterer>
		</GoogleMap>
	}
}
const mapStateToProps = (state) => ({
	language: state.settings.language
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(CalibrateMapComponent)