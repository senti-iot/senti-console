import React, { Component } from 'react'
import { Button, Dialog, DialogTitle, /*  DialogContent, DialogContentText, */ DialogActions, Snackbar } from '@material-ui/core';
import { GridContainer, InfoCard, ItemGrid } from 'components';
import { resetDevice } from 'variables/dataDevices';

export default class ResetDevice extends Component {
	constructor(props) {
		super(props)

		this.state = {
			success: null,
			resetDialog: false,
			openSnackbar: false
		}
	}

	handleReset = async () => {
		await resetDevice(this.props.match.params.id).then(rs => {
			this.setState({ success: rs, resetDialog: false, openSnackbar: true })
		})
	}
	handleOpenResetDialog = () => { this.setState({ resetDialog: true }) }
	handleCloseResetDialog = () => { this.setState({ resetDialog: false }) }
	renderResetDialog = () => {
		return <Dialog
			open={this.state.resetDialog}
			onClose={this.handleCloseResetDialog}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">Reset Device?</DialogTitle>
			{/* <DialogContent>
				<DialogContentText id="alert-dialog-description">
				 ?
				</DialogContentText>
			</DialogContent> */}
			<DialogActions>
				<Button onClick={this.handleCloseResetDialog} color="primary">
					No
				</Button>
				<Button onClick={this.handleReset} color="primary" autoFocus>
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	}
	renderSnackbar = () => <Snackbar
		anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
		open={this.state.openSnackbar}
		autoHideDuration={5000}
		onClose={() => { this.setState({ openSnackbar: false }) }}
		message={

			<ItemGrid zeroMargin noPadding justify={'center'} alignItems={'center'} container id="message-id">
				{this.state.success ? "Reset Successful" : "Reset Failed"}
			</ItemGrid>
		}
	/>

	render() {
		console.log(this.state.success ? this.state.success : null)
		return (
			<GridContainer>
				<InfoCard
					noAvatar
					noExpand
					title={"Reset device: " + this.props.match.params.id}
					content={
						<Button variant={'contained'} onClick={this.handleOpenResetDialog}>
							Reset Device
			  		</Button>
					} />
				{this.renderResetDialog()}
				{this.renderSnackbar()}
			</GridContainer>
		)
	}
}
