import React, { PureComponent, Fragment } from 'react'
import { getAllPictures, deletePicture } from 'variables/dataDevices';
import { Grid, withStyles, Modal, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import InfoCard from 'components/Cards/InfoCard';
import { Image, CloudUpload, Delete } from 'variables/icons'
import deviceStyles from 'assets/jss/views/deviceStyles';
import DeviceImage from 'components/Devices/DeviceImage';
import CircularLoader from 'components/Loader/CircularLoader';
import { Caption, Dropdown } from 'components';
import DeviceImageUpload from 'views/Devices/ImageUpload';

class DeviceImages extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			activeStep: 0,
			img: null,
			openImageUpload: false,
			openDeleteImage: false,
			deletingPicture: false,
			deleted: null,
			openSnackbar: 0
		}
	}

	handleStepChange = activeStep => {
		this.setState({ activeStep });
	};
	componentDidMount = async () => {
		this._isMounted = 1
		await this.getAllPics(this.props.device.id)
	}
	componentWillUnmount = () => { 
		this._isMounted = 0
	}
	getPicsCallBack = () => {
		this.getAllPics(this.props.device.id)
	}
	renderImageUpload = (dId) => {

		return <DeviceImageUpload
			t={this.props.t}
			dId={dId}
			imgUpload={this.getAllPics}
			callBack={this.getPicsCallBack}
		/>
	}
	getAllPics = (id) => {
		getAllPictures(id).then(rs => { return this._isMounted ? this.setState({ img: rs }) : null})
	}
	handleOpenImageUpload = () => {
		this.setState({ openImageUpload: true })
	}
	handleOpenDeletePictureDialog = () => {
		this.setState({ openDeleteImage: true })
	}
	handleCloseDeletePictureDialog = () => {
		this.setState({ openDeleteImage: false })
	}
	handleCloseImageUpload = () => {
		this.setState({ openImageUpload: false })
	}
	handleDeletePicture = async () => {
		const { img, activeStep } = this.state
		const dId = this.props.device.id
		this.setState({ deletingPicture: true })
		var deleted = await deletePicture(dId, img[activeStep].filename).then(rs => rs)
		if (deleted) {
			this.setState({ img: null, openDeleteImage: false, openSnackbar: 1 })
			this.getAllPics(dId)
		}
		else { 
			this.setState({ openSnackbar: 2, openDeleteImage: false })
		}
	}
	snackBarMessages = () => {
		const { s } = this.props
		let msg = this.state.openSnackbar
		switch (msg) {
			case 1:
				s('snackbars.pictureDeleted')
				break
			case 2:
				s('snackbars.pictureNotDeleted')
				break
			default:
				break;
		}
	}
	renderImageLoader = () => {
		return <CircularLoader notCentered />
	}
	renderDeleteDialog = () => {
		const { t } = this.props
		return <Dialog
			open={this.state.openDeleteImage}
			onClose={this.handleCloseImageDelete}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle id='alert-dialog-title'>{t('dialogs.delete.title.deviceImage')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.deviceImage')}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeletePictureDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={this.handleDeletePicture} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}

	
	render() {
		const { openImageUpload, img } = this.state
		const { classes, device, t  } = this.props
		return (
			<InfoCard
				noHiddenPadding
				noPadding
				title={t('devices.cards.pictures')}
				avatar={<Image />}
				topAction={
					<Dropdown menuItems={
						[
							{ label: t('actions.uploadImages'), icon: <CloudUpload className={classes.leftIcon} />, func: this.handleOpenImageUpload },
							{ label: t('actions.deletePicture'), icon: <Delete className={classes.leftIcon} />, func: this.handleOpenDeletePictureDialog },
						]
					} />
				}
				hiddenContent={
					<Fragment>
						{img !== null ? img !== 0 ?
							<Fragment>
								{this.renderDeleteDialog()}
								<Grid container justify={'center'}>
									<DeviceImage
										t={this.props.t}
										useParent
										handleStep={this.handleStepChange}
										images={img ? img.map(m => m.image) : null} />
								</Grid>
							</Fragment>
							: <Grid container justify={'center'}> <Caption>{t('devices.noImages')}</Caption></Grid> : this.renderImageLoader()}
						<Modal
							aria-labelledby='simple-modal-title'
							aria-describedby='simple-modal-description'
							open={openImageUpload}
							onClose={this.handleCloseImageUpload}>
							<div className={classes.modal}>
								{this.renderImageUpload(device.id)}
							</div>
						</Modal>
					</Fragment>}
			/>
		)
	}
}
export default withStyles(deviceStyles)(DeviceImages)