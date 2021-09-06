import React, { Fragment } from 'react';
import {
	withLeaflet, Map, TileLayer, Marker, Popup
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

class OpenStreetMapWidget extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			zoom: props.zoom ? props.zoom : props.markers.length === 1 ? 17 : 13,
			height: 200,
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
				// iconAnchor: [12, 20],
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
		// this.map.leafletElement.on('viewreset', e => {
		//
		// })
		this.map.leafletElement.on('popupopen', (e) => {
			var px = this.map.leafletElement.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
			// px.y -= e.popup._container.clientHeight * 2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
			px.y -= 336 / 2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
			this.map.leafletElement.flyTo(this.map.leafletElement.unproject(px)); // pan to new center

		});
		const { g } = this.props
		let height = g.grid.h * 25
		this.setState({ height })
	}
	componentDidUpdate = (prevProps, prevState) => {
		const { g } = this.props
		if (prevProps.mapTheme !== this.props.mapTheme)
			this.map.leafletElement.setMaxZoom(layers[this.props.mapTheme].maxZoom)
		if (this.props.calibrate) {
			this.map.leafletElement.off("click")
		}
		if (g.grid.h !== prevProps.g.grid.h) {
			let height = g.grid.h * 25
			this.setState({ height })
		}
		this.map.leafletElement.invalidateSize()
	}

	centerOnAllMarkers = () => {
		let arr = this.props.markers.map(m => m.lat && m.long ? [m.lat, m.long] : null)
		arr = arr.filter(x => !!x)
		if (arr.length > 1)
			this.map.leafletElement.fitBounds([arr])
		else {
			this.setState({ zoom: 6 })
			this.map.leafletElement.fitBounds([this.getCenter()])
			this.map.leafletElement.zoomOut(12)
		}

	}
	getCenter = () => {
		let center = []
		let defaultLat = parseFloat(56.2639) //Denmark,
		let defaultLng = parseFloat(9.5018) //Denmark

		console.log(this.props.markers[0])
		if (this.props.markers.length === 1 && this.props.markers[0])
			center = [this.props.markers[0]?.lat, this.props.markers[0]?.long]
		else {
			center = [defaultLat, defaultLng]

		}
		return center
	}
	onDragEnd = (e) => {
		L.DomEvent.preventDefault(e);
		L.DomEvent.stopPropagation(e);
		// e.stopPropagation()
		this.props.getLatLng(e)
	}
	render() {
		const { markers, classes, theme, calibrate, mapTheme, heatData, heatMap, CustomPopup } = this.props
		const { zoom } = this.state
		return <Fragment>
			<Map
				attributionControl={heatMap ? false : true}
				zoomControl={false}
				ref={r => this.map = r}
				center={this.getCenter()}
				zoom={zoom}
				onzoomend={this.setZoom}
				maxZoom={layers[mapTheme].maxZoom}
				style={{ height: 'calc(100%)', width: '100%' }}
			>
				{heatMap ? <HeatLayer data={heatData ? heatData.map(m => {
					return ({ lat: m.lat, lng: m.long, count: m.data })
				})
					: null} /> : null}
				{heatMap ? <HeatMapLegend /> : null}
				<FullScreen />
				<ZoomControl />
				{/* <PZtoMarkers markers={markers}/> */}
				<MyLocationControl mapLayer={this.layer} />
				<TileLayer
					ref={r => this.layer = r}
					url={layers[mapTheme].url}
					attribution={heatMap ? false : layers[mapTheme].attribution}
				/>
				{layers[mapTheme].extraLayers ? layers[mapTheme].extraLayers.map(l => (
					<TileLayer url={l} />
				)) : null}
				{markers.map((m, i) => {
					if (m && (m.lat && m.long)) {
						return <Marker
							onDragend={calibrate ? this.onDragEnd : null}
							autoPan={calibrate ? true : false}
							draggable={calibrate ? true : false}
							position={[m.lat, m.long]}
							onClick={calibrate ? () => { } : () => {}}
							key={i}
							icon={this.returnSvgIcon(m.liveStatus)}>
							{calibrate ? null : <Popup className={theme.palette.type === 'dark' ? classes.popupDark : classes.popup}>
								{CustomPopup ? <CustomPopup marker={m}/> : <OpenPopup dontShow={calibrate} m={m} noSeeMore={markers.length === 1} heatMap={heatMap} />}
							</Popup>}
						</Marker>
					}
					return null
				})}
			</Map>
		</Fragment>

	}

}
const mapStateToProps = (state) => ({
	language: state.settings.language,
	mapTheme: state.settings.mapTheme

})

const mapDispatchToProps = {

}
export default withLeaflet(connect(mapStateToProps, mapDispatchToProps)(withStyles(mapStyles, { withTheme: true })(OpenStreetMapWidget)))