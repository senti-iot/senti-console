import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InfoCard } from 'components';
import { Laptop } from '@material-ui/icons'
import { Button } from '@material-ui/core';

export default class DisplaySettings extends Component {
	static propTypes = {
		language: PropTypes.string.isRequired
	}
	onClickFunc = () => {
		// console(this.props.lasnm)
		if (this.props.language === "en")
			this.props.changeLanguage("dk")
		else {
			this.props.changeLanguage("en")
		 }
	}
	render() {
		const { language } = this.props
		return (
			<InfoCard
				noExpand
				avatar={<Laptop />}
				title={"Display"}
				content={<Button variant={'contained'} onClick={this.onClickFunc}>{"The Language is set to: " + language}</Button>} />
		)
	}
}
