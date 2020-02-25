import React, { useEffect } from 'react'
import { Typography, Paper, Button } from '@material-ui/core'
import { GridContainer, ItemG } from 'components'
import Img404 from 'assets/img/404/404.svg'
import { useLocalization, useLocation, useHistory } from 'hooks'
import { makeStyles } from '@material-ui/styles'

const styles = makeStyles(theme => ({
	paper: {
		width: '100%',
		margin: theme.spacing(1),
		borderRadius: "3px",
		padding: 16
	},
	margin24: {
		margin: 24
	},
}))

const NotFound = props => {
	//Hooks
	const classes = styles()
	const history = useHistory()
	//Redux

	//State

	//Const
	const { setHeader, setTabs, setBC } = props

	//useCallbacks

	//useEffects
	useEffect(() => {
		setHeader('404.title', true, '', '')
		setTabs({
			id: "notFound",
			tabs: []
		})
		setBC('home')
	}, [setBC, setHeader, setTabs])
	//Handlers

	const t = useLocalization()
	const location = useLocation()

	// componentDidMount = () => {
	// 	this.props.setHeader('404.title', true, '', '')
	// }

	let prevURL = location.prevURL ? location.prevURL : ""
	return (
		<GridContainer>
			<Paper className={classes.paper}>
				<ItemG container justify={'center'}>
					<ItemG container xs={12} justify={'center'}>
						<img src={Img404} alt={'404'} className={classes.margin24} />
					</ItemG>
					<ItemG container justify={'center'} xs={12} variant={'title'} className={classes.margin24}>
						<Typography>{prevURL}</Typography>
					</ItemG>
					<ItemG container justify={'center'} xs={12}>
						<Typography variant={'h6'} className={classes.margin24}>
							{t('404.errorMessage')}
						</Typography>
					</ItemG>
					<ItemG container justify={'center'} xs={12}>
						<Typography variant={'h6'}>
							{t('404.contactSupport')}
						</Typography>
					</ItemG>
					<ItemG container justify={'center'} xs={12}>
						<Button style={{ marginTop: 124 }} variant={'outlined'} color={'primary'} onClick={() => history.push('/')}>
							{t('404.goHome')}
						</Button>
					</ItemG>
				</ItemG>

			</Paper>
		</GridContainer>
	)
}

export default NotFound