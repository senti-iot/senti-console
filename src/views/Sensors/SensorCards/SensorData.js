import React, { Component } from 'react'
import DoubleChartData from 'views/Charts/DoubleChartData';
import { getWMeterDatav2 } from 'components/Charts/DataModel';
import { teal } from '@material-ui/core/colors';

export class SensorData extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 
	  }
	}
	
	componentDidUpdate = async (prevProps) => {

	}
	componentDidMount = async () => {

	}
	getWifiHourly = async (p) => {
		const { hoverID } = this.state 	
		const { v, nId } = this.props
		const device = this.props.sensor
		this.setState({ loadingData: true })
		let newState = await getWMeterDatav2('device', [{
			name: device.name,
			id: device.id,
			lat: device.lat,
			long: device.long,
			org: device.org ? device.org.name : "",
			color: teal[500]
		}], p.from, p.to, hoverID, p.raw, v, nId, false)
		return newState
	}
	render() {
		const { periods, sensor, history, match, v, t } = this.props
		return (
			periods.map((period, i) => {

				return <DoubleChartData
					single
					title={t(`sensors.metadata.${v}`)}
					getData={this.getWifiHourly}
					period={period}
					device={sensor}
					history={history}
					match={match}
					setHoverID={() => {}}
					t={t}
				/>
			})
		)
	}
}

export default SensorData
