import React, { Component } from 'react'
import { GridContainer, ItemG } from 'components';
import { Paper, Typography, withStyles } from '@material-ui/core';
import moment from 'moment'
import christmas from 'assets/img/christmas';

const styles = theme => ({
	paper: {
		width: '100%',
		padding: 10,
	},
	img: {
		height: 300,
		width: 300
	}
})
class Holiday extends Component {
	handleRedirectToChristmas = () => {
		this.props.history.push(`/holiday`)
	}
	renderChristmasIcon = () => {
		const { classes } = this.props
		// window.moment = moment
		// console.log(moment().format('MM'))
		if (moment().format('MM') === '12') {
			let today = moment().format('DD')
			console.log(today)
			return <img src={christmas[today]} className={classes.img} alt={'christmas'}/>
		}
		else {
			if (moment().format('MM') === '11') {
				let today = moment().format('DD')
				console.log(today)
				return <img src={christmas[0]} className={classes.img} alt={'christmas'} />
			}
			return null
		}

	}
	render() {
		const { classes } = this.props
		return (
			<GridContainer>
				<ItemG container xs={6}>
					<Paper classes={{
						root: classes.paper
					}}>
						<Typography variant={'display1'}>{moment().format('LL')}</Typography>
						<Typography variant={'body1'}></Typography>
					</Paper>
				</ItemG>
				<ItemG container justify={'center'} xs={6}>
					{this.renderChristmasIcon()}
				</ItemG>
			</GridContainer>
		)
	}
}

export default withStyles(styles)(Holiday)
