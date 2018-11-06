import React from 'react'
import Info from './Info';
import { withStyles } from '@material-ui/core';
import { ClearDay, ClearNight, Cloudy, Fog, PartlyCloudyDay, PartlyCloudyNight, Rain, Sleet, Snow, Wind, } from "variables/icons";
const styles = (theme) => ({
	img: {
		background: 'linear-gradient(60deg, #41A29B, #278881)',
		borderRadius: 50,
		padding: 5
	},

})
const WeatherIcon = (props) => {
	const getIcon = () => {
		switch (props.icon) {
			case 'clear_day':
				return ClearDay
			case 'clear_night':
				return ClearNight
			case 'cloudy':
				return Cloudy
			case 'fog':
				return Fog
			case 'partly_cloudy_day':
				return PartlyCloudyDay
			case 'partly_cloudy_night':
				return PartlyCloudyNight
			case 'rain':
				return Rain
			case 'sleet':
				return Sleet
			case 'snow':
				return Snow
			case 'wind':
				return Wind
			default:
				break;
		}
	}
	return (
		<Info>
			<img className={props.classes.img} src={getIcon()} height={'27'} width={'27'} alt='' />
		</Info>

	)
}

export default withStyles(styles)(WeatherIcon)