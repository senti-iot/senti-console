import React, { Component } from 'react'
import scriptLoader from 'react-async-script-loader'
import Helmet from 'react-helmet'
import $ from 'jquery'
import { LoaderSmall } from 'LoginStyles'
class MapCentia extends Component {
	constructor(props) {
		super(props)

		this.state = {
			devices: {

			}
		}
		this.componentDidUpdate = this.componentDidUpdate.bind(this)
	}

	componentDidUpdate = (prevProps, prevState) => {
		const { isScriptLoaded, isScriptLoadSucceed } = this.props
		if (isScriptLoaded && isScriptLoadSucceed) {
			if (window.gc2map && window.geocloud && window.L) {
				window.gc2map.init({
					db: 'mydb_eu',
					layers: ['aalborg.parknatur_skiltebesigtigelsehaervejsruten'],
					zoom: [9.909324644616078, 57.010271850298416, 12],
					setBaseLayer: 'hereNormalNightGrey',
					width: '100%',
					height: '100%',
					schema: 'aalborg',
					key: 'map',
					staticMap: true,
					callBack: function (e) {
						this.Templates = window.Templates
						var store = new window.geocloud.sqlStore({
							db: "mydb_eu",
							sql: "SELECT * FROM aalborg.parknatur_naturture",
							onLoad: function () {
								// Zoom to vector layer
								//e.zoomToExtentOfgeoJsonStore(store);
							},
							// Bind a popup to each point
							onEachFeature: function (feature, layer) {
								layer.bindPopup(feature.properties['navn'])
								layer.on('click', function (evt) {
									var c = $("#content")
									c.empty()
									c.append("<h3  class='well'>" + feature.properties['navn'] + "</h3>")
									c.append("<h4>Arrangør</h4><p>" + feature.properties['arrangoer'] + "</p>")
									c.append("<h4>Mødested</h4><p>" + feature.properties['moedested'] + "</p>")
									c.append("<h4>Varighed</h4><p>" + feature.properties['varighed'] + "</p>")
									c.append("<h4>Beskrivelse</h4><p>" + feature.properties['broedtekst'] + "</p>")

								})
							},
							// Make markers instead of simple vector point features
							pointToLayer: function (feature, latlng) {
								return window.L.marker(latlng, {
									zIndexOffset: 10000,
									icon: window.L.AwesomeMarkers.icon({
										icon: 'star',
										markerColor: 'blue',
										prefix: 'fa'
									}
									)
								})
							}
						})
						e.addGeoJsonStore(store)
						store.load()
					}
				})
			}
		}
	}

	render() {
		const { isScriptLoaded, isScriptLoadSucceed } = this.props

		if (isScriptLoaded && isScriptLoadSucceed) {
			if (window.gc2map) {
				return (
					<div style={{ width: '100%', height: '100%', position: 'relative' }}>
						<Helmet>
							<link href="http://eu1.mapcentia.com/js/leaflet/plugins/awesome-markers/leaflet.awesome-markers.css" type="text/css"
								rel="stylesheet" />
							<link rel="stylesheet" type='text/css' href="http://netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css" />
						</Helmet>

						<div id="pane" style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '100%' }}>
							<div id={'map'}></div>
						</div>
					</div>
				)
			}
		}
		else {
			return <LoaderSmall />
		}

	}
}
export default scriptLoader(
	[
		'http://eu1.mapcentia.com/apps/widgets/gc2map/js/gc2map.js'
	])(MapCentia)