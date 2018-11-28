import React from 'react'
import { withStyles } from '@material-ui/core';
import { ClearDay, ClearNight, Cloudy, Fog, PartlyCloudyDay, PartlyCloudyNight, Rain, Sleet, Snow, Wind, } from 'variables/icons';
const styles = (theme) => ({
	img: {
		background: 'linear-gradient(60deg, #41A29B, #278881)',
		borderRadius: 50,
		padding: 5
	},

})
const WeatherIcon = (props) => {
	const getIcon = () => {
		;
		
		switch (props.icon) {
			case 'clear-day':
				return ClearDay
			case 'clear-night':
				return ClearNight
			case 'cloudy':
				return Cloudy
			case 'fog':
				return Fog
			case 'partly-cloudy-day':
				return PartlyCloudyDay
			case 'partly-cloudy-night':
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
		
		<img className={props.classes.img} src={getIcon()} height={'27'} width={'27'} alt='' />


	)
}

export default withStyles(styles)(WeatherIcon)