import React, { useState } from 'react'
import DoubleChartData from 'views/Charts/DoubleChartData';
import { getWMeterDatav2 } from 'components/Charts/DataModel';
import { teal } from '@material-ui/core/colors';
import { useLocalization, useHistory, useMatch } from 'hooks';

// @Andrei
export default function SensorData(props) {
	const t = useLocalization()
	const history = useHistory()
	const match = useMatch()
	const [hoverID, /* setHoverID */] = useState(null) // added
	const [/* loadingData */, setLoadingData] = useState(false) // added
	// constructor(props) {
	//   super(props)

	//   this.state = {

	//   }
	// }

	// componentDidUpdate = async (prevProps) => {

	// }
	// componentDidMount = async () => {

	// }
	const getWifiHourly = async (p) => {
		// const { hoverID } = this.state
		const { v, nId } = props
		const device = props.sensor
		setLoadingData(true)
		// this.setState({ loadingData: true })
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

	const { periods, sensor, v } = props
	return (
		periods.map((period) => {

			return <DoubleChartData
				single
				title={t(`sensors.metadata.${v}`)}
				getData={getWifiHourly}
				period={period}
				device={sensor}
				history={history}
				match={match}
				setHoverID={() => { }}
				t={t}
			/>
		})
	)
}

