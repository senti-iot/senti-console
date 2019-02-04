import React, { Fragment } from 'react';
import {
	withLeaflet, Map, Popup, TileLayer, Marker
} from 'react-leaflet'
import L from 'leaflet';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux'
import MarkerIcon from './MarkerIcon';
import mapStyles from './mapStyles'
import OpenPopup from './OpenPopup'

/**
 * Plugins
 */
import layers from 'variables/LeafletPlugins/leafletMaps.json'
import FullScreen from 'variables/LeafletPlugins/FullScreen'
import ZoomControl from 'variables/LeafletPlugins/ZoomControl';
import HeatLayer from 'variables/LeafletPlugins/HeatLayer';
import HeatMapLegend from 'variables/LeafletPlugins/HeatMapLegend';
import MyLocationControl from 'variables/LeafletPlugins/MyLocationControl';

class OpenStreetMap extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			zoom: props.markers.length === 1 ? 17 : 13
		}
	}

	handleClick = (event) => {
		const items = this.state.dataSet;
		items[event.target.id].visible = !items[event.target.id].visible;

		this.setState({
			dataSet: items,
		})
	}

	returnSvgIcon = (state) => {
		var CustomIcon = L.Icon.extend({
			options: {
				iconSize: [25, 41],
				iconAnchor: [12, 20],
				popupAnchor: [1, -34],
			}
		});

		const icon = MarkerIcon(state);
		var iconUrl = 'data:image/svg+xml;base64,' + btoa(icon);
		return new CustomIcon({
			iconUrl: iconUrl
		});

	}
	setZoom = () => {
		this.setState({
			zoom: this.map.leafletElement.getZoom()
		})
	}
	componentDidMount = () => {
		if (this.props.markers.length > 1)
			this.centerOnAllMarkers()
		if (this.props.iRef) {
			this.props.iRef(this.map)
		}
		this.map.leafletElement.on('popupopen', (e) => {
			var px = this.map.leafletElement.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
			// px.y -= e.popup._container.clientHeight * 2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
			px.y -= 336 / 2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
			this.map.leafletElement.flyTo(this.map.leafletElement.unproject(px)); // pan to new center

		});
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.mapTheme !== this.props.mapTheme)
			this.map.leafletElement.setMaxZoom(layers[this.props.mapTheme].maxZoom)
	}

	centerOnAllMarkers = () => {
		this.map.leafletElement.fitBounds([...this.props.markers.map(m => m.lat && m.long ? [m.lat, m.long] : null)])
	}
	getCenter = () => {
		let center = []
		let defaultLat = parseFloat(56.2639) //Denmark,
		let defaultLng = parseFloat(9.5018) //Denmark


		if (this.props.markers.length === 1)
			center = [this.props.markers[0].lat, this.props.markers[0].long]
		else {
			center = [defaultLat, defaultLng]

		}
		return center
	}
	render() {
		const { markers, classes, theme, calibrate, mapTheme, heatData, heatMap } = this.props
		const { zoom } = this.state
		return <Fragment>
			<Map attributionControl={heatMap ? false : true} zoomControl={false} ref={r => this.map = r} center={this.getCenter()} zoom={zoom} onzoomend={this.setZoom} maxZoom={layers[mapTheme].maxZoom} className={classes.map} >
				{heatMap ? <HeatLayer data={heatData ? heatData.map(m => ({ lat: m.lat, lng: m.long, count: m.data })) : null} /> : null}
				{heatMap ? <HeatMapLegend /> : null}
				<FullScreen />
				<ZoomControl />
				{/* <PZtoMarkers markers={markers}/> */}
				<MyLocationControl mapLayer={this.layer}/>
				<TileLayer ref={r => this.layer = r} url={layers[mapTheme].url} attribution={heatMap ? false : layers[mapTheme].attribution} />
				{layers[mapTheme].extraLayers ? layers[mapTheme].extraLayers.map(l => (
					<TileLayer url={l} />
				)) : null}
				{markers.map((m, i) => {
					if (m.lat && m.long)
						return <Marker
							onDragend={calibrate ? this.props.getLatLng : null}
							autoPan={calibrate ? true : false}
							draggable={calibrate ? true : false}
							position={[m.lat, m.long]}
							key={i}
							icon={this.returnSvgIcon(m.liveStatus)}>
							{calibrate ? null : <Popup className={theme.palette.type === 'dark' ? classes.popupDark : classes.popup}>
								<OpenPopup m={m} noSeeMore={markers.length === 1} />
							</Popup>}
						</Marker>
					return null
				})}
			</Map>
		</Fragment>

	}

}
const mapStateToProps = (state) => ({
	language: state.settings.language
})

const mapDispatchToProps = {

}
export default withLeaflet(connect(mapStateToProps, mapDispatchToProps)(withStyles(mapStyles, { withTheme: true })(OpenStreetMap)))