import { Component } from 'react'

class GeoLocation extends Component {

	constructor(props) {
		super(props)

		this.state = {
			lat: '',
			long: ''
		}

		this.GetLatitude()
		this.GetLongitude()
	}

	GetLatitude = () => {

		var _this = this

		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(function (position) {
				var lat = position.coords.latitude
				var long = position.coords.longitude
				_this.setState({ lat, long })
			})
		}

		else {

			console.log('Geolocation is not available')
		}
	}

	GetLongitude = () => {

		var _this = this

		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(function (position) {
				var long = position.coords.longitude
				_this.setState({ long })
			})
		}

		else {

			console.log('Geolocation is not available')
		}

	}

	render() {
		console.log(this.state)
		return null
		// <div>
		// 	<p>{this.state.lat} </p>
		// 	<p>{this.state.long} </p>
		// </div>
		
	}
}

export default GeoLocation
