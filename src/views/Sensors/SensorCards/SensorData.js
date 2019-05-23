import React, { Component } from 'react'
import { ItemGrid } from 'components';
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
	handleDataSize = (i) => {
		let visiblePeriods = 0
		this.props.periods.forEach(p => p.hide === false ? visiblePeriods += 1 : visiblePeriods)
		if (visiblePeriods === 1)
			return 12
		if (i === this.props.periods.length - 1 && visiblePeriods % 2 !== 0 && visiblePeriods > 2)
			return 12
		return 6
	}
	getWifiHourly = async (p) => {
		const { hoverID } = this.state 	
		const { v, nId } = this.props
		const device = this.props.sensor
		this.setState({ loadingData: true })
		console.log(nId)
		let newState = await getWMeterDatav2('device', [{
			name: device.name,
			id: device.id,
			lat: device.lat,
			long: device.long,
			org: device.org ? device.org.name : "",
			color: teal[500]
		}], p.from, p.to, hoverID, p.raw, v, nId, true)
		return newState
	}
	render() {
		const { periods, sensor, history, match, v, t } = this.props
		return (
			periods.map((period, i) => {

				return <ItemGrid xs={12} md={this.handleDataSize(i)} noMargin key={i} id={i}>
					<DoubleChartData
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
				</ItemGrid>
			})
		)
	}
}

export default SensorData
