import React, { useEffect } from 'react'
import { GridContainer, ItemG } from 'components';
import { Paper, Typography, makeStyles } from '@material-ui/core';
import moment from 'moment'
import christmas from 'assets/img/christmas';
import { /* useHistory, */ useLocalization } from 'hooks';

const useStyles = makeStyles(theme => ({
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
}))

// @Andrei
const Holiday = props => {
	const classes = useStyles()
	// const history = useHistory()
	const t = useLocalization()

	useEffect(() => {
		props.setHeader('christmas.pageTitle', false, false, '')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = () => { 
	// 	this.props.setHeader('christmas.pageTitle', false, false, '')
	// }

	// const handleRedirectToChristmas = () => {
	// 	history.push(`/holiday`)
	// }
	const renderChristmasIcon = () => {
		// const { classes } = this.props
		if (moment().format('MM') === '12') {
			let today = moment().format('DD')
			return <img src={christmas[today]} className={classes.img} alt={'christmas'} />
		}
		else {
			if (moment().format('MM') === '11') {
				return <img src={christmas[0]} className={classes.img} alt={'christmas'} />
			}
			return null
		}

	}

	// const { classes, t } = this.props
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
				{renderChristmasIcon()}
			</ItemG>
		</GridContainer>
	)
}

export default Holiday
