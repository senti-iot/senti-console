import React, { useState } from 'react'
import { Button, Dialog, DialogTitle, /*  DialogContent, DialogContentText, */ DialogActions } from '@material-ui/core';
import { GridContainer, InfoCard } from 'components';
import { resetDevice } from 'variables/dataDevices';
import { useSnackbar } from 'hooks';

// @Andrei
export default function ResetDevice(props) {
	const s = useSnackbar().s
	const [/* success */, setSuccess] = useState(null)
	const [resetDialog, setResetDialog] = useState(false)
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		success: null,
	// 		resetDialog: false,
	// 	}
	// }

	const handleReset = async () => {
		await resetDevice(props.match.params.id).then(rs => {
			setSuccess(rs)
			setResetDialog(false)
			// this.setState({ success: rs, resetDialog: false })
		})
	}
	const handleOpenResetDialog = () => {  /* this.setState({ resetDialog: true }) */ setResetDialog(true) }
	const handleCloseResetDialog = () => {
		setResetDialog(false)
		// this.setState({ resetDialog: false })
		s('snackbars.resetDeviceSuccess')
	}
	const renderResetDialog = () => {
		return <Dialog
			open={resetDialog}
			onClose={handleCloseResetDialog}
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
				<Button onClick={handleCloseResetDialog} color='primary'>
					No
				</Button>
				<Button onClick={handleReset} color='primary' autoFocus>
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	}


	return (
		<GridContainer>
			<InfoCard
				noAvatar
				noExpand
				title={'Reset device: ' + props.match.params.id}
				content={
					<Button variant={'outlined'} onClick={handleOpenResetDialog}>
						Reset Device
			  		</Button>
				} />
			{renderResetDialog()}
		</GridContainer>
	)
}
