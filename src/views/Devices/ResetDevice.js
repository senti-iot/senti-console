import React, { Component } from 'react'
import { Button, Dialog, DialogTitle, /*  DialogContent, DialogContentText, */ DialogActions } from '@material-ui/core';
import { GridContainer, InfoCard } from 'components';
import { resetDevice } from 'variables/dataDevices';

export default class ResetDevice extends Component {
	constructor(props) {
		super(props)

		this.state = {
			success: null,
			resetDialog: false,
		}
	}

	handleReset = async () => {
		await resetDevice(this.props.match.params.id).then(rs => {
			this.setState({ success: rs, resetDialog: false })
		})
	}
	handleOpenResetDialog = () => { this.setState({ resetDialog: true }) }
	handleCloseResetDialog = () => {
		this.setState({ resetDialog: false })
		this.props.s('snackbars.resetDeviceSuccess')
	}
	renderResetDialog = () => {
		return <Dialog
			open={this.state.resetDialog}
			onClose={this.handleCloseResetDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>Reset Device?</DialogTitle>
			{/* <DialogContent>
				<DialogContentText id='alert-dialog-description'>
				 ?
				</DialogContentText>
			</DialogContent> */}
			<DialogActions>
				<Button onClick={this.handleCloseResetDialog} color='primary'>
					No
				</Button>
				<Button onClick={this.handleReset} color='primary' autoFocus>
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	}
	

	render() {
		return (
			<GridContainer>
				<InfoCard
					noAvatar
					noExpand
					title={'Reset device: ' + this.props.match.params.id}
					content={
						<Button variant={'contained'} onClick={this.handleOpenResetDialog}>
							Reset Device
			  		</Button>
					} />
				{this.renderResetDialog()}
			</GridContainer>
		)
	}
}
