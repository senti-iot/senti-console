import React, { useState } from 'react'
import { /* ItemG, */ T } from 'components'
import loginImages from 'variables/loginImages'
import { Button } from '@material-ui/core'
import { sideBarColor, /* primaryColor */ } from 'assets/jss/material-dashboard-react'
// import ImgDevices from 'assets/img/devices.png'
import ImgTexture from 'assets/img/texture_inverted2.png'
import sentiDots from 'assets/img/senti_dots.svg'
import { useLocalization } from 'hooks'
import { makeStyles } from '@material-ui/styles'
import { getWL } from 'variables/storage'

const styles = makeStyles(theme => ({
	container: {
		backgroundImage: `url(${ImgTexture})`,
		backgroundRepeat: "no-repeat",
		backgroundPosition: "bottom",
		backgroundColor: sideBarColor,
		// background: sideBarColor,
		width: "100%",
		height: "100%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	contentWrapper: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexFlow: "column",
		margin: '15px 150px'
	},
	bold: {
		fontWeight: 600
	},
	message: {
		padding: 25,
		maxWidth: 615,
		marginBottom: 30,
		color: '#fff'
	},
	overcomplicatedButtonTextLight: {
		fontWeight: 300,
		marginRight: 4
	},
	overcomplicatedButtonTextRegular: {
		fontWeight: 700
	},
	button: {
		color: '#000',
		marginBottom: 40,
		boxShadow: 'none'
	},
	img: {
		height: 300,
	},
	sentiDots: {
		height: 75,
		marginTop: '100',
		margin: 50
	}
}))
const getRndInteger = (min, max) => {
	min = 0
	max = loginImages.length
	return Math.floor(Math.random() * (max - min)) + min
}

const LoginImages = (props) => {

	//Hooks
	const t = useLocalization()
	const classes = styles()

	//Redux

	//State

	const [number] = useState(getRndInteger())
	//Const
	const wl = getWL() ? getWL() : null
	return (
		<div className={classes.container}>
			<div className={classes.contentWrapper}>
				<T reversed variant={'h5'} className={classes.message}>

					{wl ? wl.loginSettings ? wl.loginSettings.text : t(`login.cards.${number}`, { type: 'markdown' }) : t(`login.cards.${number}`, { type: 'markdown' })}
				</T>
				{wl ? wl.loginSettings.url ? <Button color='primary' variant={'contained'} component={'a'} target={'_blank'} href={wl.loginSettings ? wl.loginSettings.url : "https://senti.io"} className={classes.button}>
					<span className={classes.overcomplicatedButtonTextLight}>
						{t('actions.learn')}
					</span>
					<span className={classes.overcomplicatedButtonTextRegular}>
						{t('actions.more')}
					</span>
				</Button> : null :
					<Button color='primary' variant={'contained'} component={'a'} target={'_blank'} href={"https://senti.io"} className={classes.button}>
						<span className={classes.overcomplicatedButtonTextLight}>
							{t('actions.learn')}
						</span>
						<span className={classes.overcomplicatedButtonTextRegular}>
							{t('actions.more')}
						</span>
					</Button>}
				<img src={loginImages[number]} className={classes.img} alt="" />
				<img src={sentiDots} className={classes.sentiDots} alt='' />
			</div>
		</div>
	)
}


export default LoginImages