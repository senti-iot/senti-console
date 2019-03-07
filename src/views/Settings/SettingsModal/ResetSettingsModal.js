import React, { Component } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { connect } from 'react-redux'
import { resetSettings } from 'redux/settings';

class ResetSettingsModal extends Component {
	handleClose = () => this.props.handleClose()
	handleYes = () => {
		this.props.resetSettings()
		this.props.handleClose(true)
	}
	
	render() {
		const { t, open, classes } = this.props
		return (
			<Dialog open={open} onClose={this.handleClose} aria-labelledby="simple-dialog-title" >
				<DialogTitle disableTypography id="simple-dialog-title">{t('settings.reset.resetSettings')}</DialogTitle>
				<DialogContent>
					{t('settings.reset.message')}
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose}>
						{t('actions.no')}
					</Button>
					<Button onClick={this.handleYes} className={classes.red}>
						{t('actions.yes')}
					</Button>
				</DialogActions>
			</Dialog>
		)
	}
}
const mapStateToProps = (state) => ({
	
})

const mapDispatchToProps = dispatch => ({
	resetSettings: () => dispatch(resetSettings())
})

export default connect(mapStateToProps, mapDispatchToProps)(ResetSettingsModal)
