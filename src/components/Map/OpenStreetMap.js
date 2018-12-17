import React, { Fragment } from 'react';
import {
	withLeaflet, Map, Popup, TileLayer
} from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux'
import MarkerIcon from './MarkerIcon';
import mapStyles from './mapStyles'
import OpenPopup from './OpenPopup'
import LeafletM from './LeafletM';

import FullScreen from 'variables/LeafletPlugins/FullScreen'
import ZoomControl from 'variables/LeafletPlugins/ZoomControl';

class OpenStreetMap extends React.Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 zoom: 13
	  }
	}
	
	layers = [
		{ id: 0, url: "https://tile-b.openstreetmap.fr/hot/{z}/{x}/{y}.png", label: "T1", maxZoom: 20 },
		{ id: 1, url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png", label: "T2", maxZoom: 18 },
		{ id: 2, url: "http://a.tile.stamen.com/toner/{z}/{x}/{y}.png", label: "T3", maxZoom: 18 },
		{ id: 3, url: "http://b.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg", label: "T4", maxZoom: 18 },
		{ id: 4, url: "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", maxZoom: 18 },
		{ id: 5, url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png", attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors', maxZoom: 18 }
	]
	
	handleClick = (event) => {
		const items = this.state.dataSet;
		items[event.target.id].visible = !items[event.target.id].visible;

		this.setState({
			dataSet: items,
		})
	}
	componentDidMount = () => {
		console.log(this.map)
		// fullscreenPlugin(this.props.classes)
		// this.map.leafletElement.addControl(new L.Control.Fullscreen());
	}
	componentDidUpdate = () => {
		console.log(this.map)
	}
	returnSvgIcon = (state) => {
		var CustomIcon = L.Icon.extend({
			options: {
				iconSize: [25, 41],
				iconAnchor: [12, 41],
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
	render() {
		const { markers, classes, theme, calibrate, mapTheme } = this.props
		const { zoom } = this.state
		return <Fragment>
			<Map zoomControl={false} ref={r => this.map = r} center={[57.043271, 9.921155]} zoom={zoom} onzoomend={this.setZoom} maxZoom={this.layers[mapTheme].maxZoom} className={classes.map} >
				<FullScreen />
				<ZoomControl/>
				<TileLayer url={this.layers[mapTheme].url} attribution={this.layers[mapTheme].attribution}/>
				{markers.map((m, i) => { 
					return <LeafletM
						autoPan={calibrate ? true : false}
						draggable={calibrate ? true : false}
						position={[m.lat, m.long]}
						key={i}
						icon={this.returnSvgIcon(m.liveStatus)}>
						{calibrate ? null : <Popup className={theme.palette.type === 'dark' ? classes.popupDark : classes.popup }>
							<OpenPopup m={m} />
						</Popup>}
					</LeafletM>
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