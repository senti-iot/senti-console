import React, { Component } from 'react'
import MarkerWithInfo from './MarkerWithInfo';
import { GoogleMap,  Circle  } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
// import { colors } from 'variables/colors';
import { connect } from 'react-redux'
import { colors } from 'variables/colors';

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
		return <GoogleMap
			defaultZoom={props.zoom ? props.zoom : 7}
			defaultCenter={{ lat: defaultLat, lng: defaultLng }}
			ref={this.map}
			onTilesLoaded={() => this.setCenterAndZoom()}
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

export default connect(mapStateToProps, mapDispatchToProps)(MapComponent)
