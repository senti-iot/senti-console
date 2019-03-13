import React, { Component } from 'react'
import { /* ItemG, */ T } from 'components';
import loginImages from 'variables/loginImages'
import { Button, withStyles } from '@material-ui/core';
import { sideBarColor, /* primaryColor */ } from 'assets/jss/material-dashboard-react';
// import ImgDevices from 'assets/img/devices.png'
import ImgTexture from 'assets/img/texture_inverted2.png'
import sentiDots from 'assets/img/senti_dots.svg'

const styles = theme => ({
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
		marginBottom: 30
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
		height: 250,
	},
	sentiDots: {
		height: 75,
		marginTop: 100,
		margin: 50
	}
})

class LoginImages extends Component {
	constructor(props) {
		super(props)

		this.state = {
			number: this.getRndInteger()
		}
	}

	getRndInteger = (min, max) => {
		min = 0
		max = loginImages.length
		return Math.floor(Math.random() * (max - min)) + min;
	}
	generateString = (number) => {
		const { t } = this.props
		let string = t(`login.cards.${number}`)
		var rx = />(.*?)</g
		let arr = []
		let length = string.match(rx) ? string.match(rx).length : null
		if (length) {

			for (let index = 0; index < length; index++) {
				let substr = string.substr(string.indexOf('>') + 1, string.indexOf('<') - 1)
				arr.push(<span style={{ fontWeight: 600 }}>{substr}</span>)

				string = string.slice(string.indexOf('<') + 1)
				let sub2str = string.substr(0, string.indexOf('>'))
				if (sub2str === '') {
					arr.push(string)
					string = ''
				}
				else {
					arr.push(sub2str)
					string = string.slice(string.indexOf('>'))
				}
			}
		}
		else {
			arr.push(string)
		}
		return arr
	}
	render() {
		const { t, classes } = this.props
		const { number } = this.state
		return (
			<div className={classes.container}>
				<div className={classes.contentWrapper}>				
					{t('markdown.test', { type: 'markdown' })}
					<T reversed variant={'h5'} className={classes.message}>
						{t(`login.cards.${number}`, { type: 'markdown' })}
						{/* {this.generateString(number).map((a, i) => <span key={i}>{a}</span>)} */}
					</T>
					<Button color='primary' variant={'contained'} className={classes.button}>
						<span className={classes.overcomplicatedButtonTextLight}>
							{t('actions.learn')}
						</span>
						<span className={classes.overcomplicatedButtonTextRegular}>
							{t('actions.more')}
						</span>
					</Button>					
					<img src={loginImages[number]} className={classes.img} alt="" />
					<img src={sentiDots} className={classes.sentiDots} alt=''/>
				</div>
			</div>
		)
	}
}

export default withStyles(styles)(LoginImages)
