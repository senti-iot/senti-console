import React, { Component } from 'react'
import { GridContainer, ItemG } from 'components';
import { Paper, Typography, withStyles } from '@material-ui/core';
import moment from 'moment'
import christmas from 'assets/img/christmas';

const styles = theme => ({
	title: {
		marginBottom: 20
	},
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
	componentDidMount = () => { 
		this.props.setHeader('christmas.pageTitle', false, false, '')
	}
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
				// let today = moment().format('DD')
				return <img src={christmas[0]} className={classes.img} alt={'christmas'} />
			}
			return null
		}

	}
	render() {
		const { classes, t } = this.props
		// let today = moment().format('YYYY-MM-DD')
		let today = '2018-12-01'
		return (
			<GridContainer>
				<ItemG container justify={'center'} md={8}>
					<Paper classes={{
						root: classes.paper
					}}>
						<Typography className={classes.title} variant={'h4'}>{t(`christmas.${today}.title`)}</Typography>
						<Typography variant={'body1'}>{t(`christmas.${today}.content`)}</Typography>
					</Paper>
				</ItemG>
				<ItemG container justify={'center'} xs={12} md={4}>
					{this.renderChristmasIcon()}
				</ItemG>
			</GridContainer>
		)
	}
}

export default withStyles(styles)(Holiday)
