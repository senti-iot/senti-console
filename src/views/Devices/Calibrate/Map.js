import React from 'react';
import {
	Map, TileLayer, LayersControl, Marker
} from 'react-leaflet'
// import Marker from './Marker'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux'
import MarkerIcon from 'components/Map/MarkerIcon';
import mapStyles from 'components/Map/mapStyles'
// import OpenPopup from 'components/Map/OpenPopup'
const { BaseLayer, Overlay } = LayersControl


class CalibrateMap extends React.Component {

	handleClick(event) {
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
		console.log(this.props)
		return <Map center={[57.043271, 9.921155]} zoom={13} maxZoom={18} /* attributionControl={false} */ className={classes.map}>
			<LayersControl>
				<BaseLayer name={'Topografisk'}>
					{/* <TileLayer
						// url="https://geofyn.mapcentia.com/mapcache/geofyn/tms/1.0.0/tekster.adgangsadresseinfo/{z}/{x}/{-y}.png"
						url="https://geofyn.mapcentia.com/mapcache/geofyn/tms/1.0.0/tekster.tekster_samlet_wms_web/{z}/{x}/{-y}.png"
					/> */}
					<TileLayer
						url={"https://geofyn.mapcentia.com/mapcache/geofyn/tms/1.0.0/gc2_group._b_baggrundskort01.baggrundskort01/{z}/{x}/{-y}.png"}
					/>
				</BaseLayer>
				<BaseLayer name='Dark mode'>
					<TileLayer
						url={'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'}
					/>
				</BaseLayer>
				<BaseLayer checked name="OpenStreetMap.BlackAndWhite">
					<TileLayer
						attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
					/>
				</BaseLayer>
				<BaseLayer name={'Luftphoto 2017'}>
					<TileLayer
						url={'https://gc2.io/mapcache/baselayers/tms/1.0.0/luftfotoserier.geodanmark_2017_12_5cm/{z}/{x}/{-y}.png'}
					/>
				</BaseLayer>
				<Overlay name="Marker with popup">
					<TileLayer
						// url="https://geofyn.mapcentia.com/mapcache/geofyn/tms/1.0.0/tekster.adgangsadresseinfo/{z}/{x}/{-y}.png"
						url="https://geofyn.mapcentia.com/mapcache/geofyn/tms/1.0.0/tekster.tekster_samlet_wms_web/{z}/{x}/{-y}.png"
					/>
				</Overlay>
			</LayersControl>
			{markers ? markers.map((m, i) => {
				return <Marker autoPan draggable position={[m.lat, m.long]} key={i} icon={this.returnSvgIcon(2)} onDragend={ this.props.getLatLng }>
				</Marker>
			}) : null}
		</Map>

	}

}
const mapStateToProps = (state) => ({
	language: state.settings.language
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(mapStyles, { withTheme: true })(CalibrateMap))