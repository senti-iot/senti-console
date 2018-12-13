import React, { Fragment } from 'react';
import {
	withLeaflet, Map, Marker, Popup, TileLayer
} from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux'
import MarkerIcon from './MarkerIcon';
import mapStyles from './mapStyles'
import OpenPopup from './OpenPopup'


// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
// 	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
// 	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
// 	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
// });

class OpenStreetMap extends React.Component {
	
	layers = [
		{ id: 0, url: "https://tile-b.openstreetmap.fr/hot/{z}/{x}/{y}.png", label: "T1", maxZoom: 18 },
		{ id: 1, url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png", label: "T2", maxZoom: 18 },
		{ id: 2, url: "http://a.tile.stamen.com/toner/{z}/{x}/{y}.png", label: "T3", maxZoom: 18 },
		{ id: 3, url: "http://b.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg", label: "T4", maxZoom: 18 },
		{ id: 4, url: "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" },
		{ id: 5, url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png" }
	]

	handleClick = (event) => {
		const items = this.state.dataSet;
		items[event.target.id].visible = !items[event.target.id].visible;

		this.setState({
			dataSet: items,
		})
	}
	componentDidMount = () => {
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
	render() {
		const { markers, classes } = this.props
		return <Fragment>
			<Map center={[57.043271, 9.921155]} zoom={13} maxZoom={18} className={classes.map}>
				<TileLayer url={this.layers[this.props.activeLayer].url}/>
				{markers.map((m, i) => { 
					return <Marker position={[m.lat, m.long]} dragg key={i} icon={this.returnSvgIcon(m.liveStatus)}>
						<Popup>
							<OpenPopup m={m}/>
						</Popup>
					</Marker>
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