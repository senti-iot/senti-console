import React, { Component } from 'react'
import { /* ItemG, */ T } from 'components';
import loginImages from 'variables/loginImages'
import { Button, withStyles } from '@material-ui/core';
import { sideBarColor } from 'assets/jss/material-dashboard-react';


const styles = theme => ({
	container: {
		background: sideBarColor,
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
		padding: '25px',
		maxWidth: 815
	},
	button: {
		marginBottom: 40
	},
	img: {
		height: 250,
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
					<T reversed variant={'h5'} className={classes.message}>
						{this.generateString(number).map((a, i) => <span key={i}>{a}</span>)}
					</T>
					<Button color='primary' variant={'contained'} className={classes.button}>
						{t('actions.learnMore')}
					</Button>					
					<img src={loginImages[number]} className={classes.img} alt="" />
				</div>
			</div>
		)
	}
}

export default withStyles(styles)(LoginImages)
