import React, { Component } from 'react'
import { InfoCard } from 'components';
import { Restore } from 'variables/icons'
import { Grid, withStyles, Button } from '@material-ui/core';
import { settingsStyles } from 'assets/jss/components/settings/settingsStyles';
import { connect } from 'react-redux'
import ResetSettingsModal from '../SettingsModal/ResetSettingsModal'

class ResetSettings extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 open: false
	  }
	}
	handleOpen = () => {
		this.setState({ open: true })
	}
	handleClose = (redirect) => {
		this.setState({ open: false })
		if (redirect) {
			this.props.history.push('/')
		}
	}
	render() {
		const { t, classes } = this.props
		const { open } = this.state
		return (
			<InfoCard
				noExpand
				avatar={<Restore />}
				title={t('settings.reset.resetSettings')}
				content={
					<Grid container>
						<ResetSettingsModal classes={classes} open={open} handleClose={this.handleClose} t={t}/>
						<Button className={classes.red} onClick={this.handleOpen}>
							 {t('settings.reset.restore')}
						</Button>
					</Grid>
				}
			/> 
		)
	}
}
const mapStateToProps = state => {
	return ({

	})
}
const mapDispatchToProps = (dispatch) => {
	return {
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(settingsStyles)(ResetSettings))