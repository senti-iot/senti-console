import React, { Fragment, useState, useEffect } from 'react'
import { getAllPictures, deletePicture } from 'variables/dataDevices';
import { Grid, withStyles, Modal, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import InfoCard from 'components/Cards/InfoCard';
import { Image, CloudUpload, Delete } from 'variables/icons'
import deviceStyles from 'assets/jss/views/deviceStyles';
import DeviceImage from 'components/Devices/DeviceImage';
import CircularLoader from 'components/Loader/CircularLoader';
import { Caption, Dropdown } from 'components';
import DeviceImageUpload from 'views/Devices/ImageUpload';
import { useLocalization, /* useSnackbar */ } from 'hooks';

const DeviceImages = props => {
	const t = useLocalization()
	// const s = useSnackbar().s
	const [activeStep, setActiveStep] = useState(0)
	const [img, setImg] = useState(null)
	const [openImageUpload, setOpenImageUpload] = useState(false)
	const [openDeleteImage, setOpenDeleteImage] = useState(false)
	const [/* deletingPicture */, setDeletingPicture] = useState(false)
	// const [deleted, setDeleted] = useState(null)
	// const [openSnackbar, setOpenSnackbar] = useState(0)
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		activeStep: 0,
	// 		img: null,
	// 		openImageUpload: false,
	// 		openDeleteImage: false,
	// 		deletingPicture: false,
	// 		deleted: null,
	// 		openSnackbar: 0
	// 	}
	// }

	const handleStepChange = newActiveStep => {
		setActiveStep(newActiveStep)
		// this.setState({ activeStep });
	};
	useEffect(() => {
		const asyncFunc = async () => {
			await getAllPics(props.device.id)
		}
		asyncFunc()
	}, [props.device.id])
	// componentDidMount = async () => {
	// 	this._isMounted = 1
	// 	await this.getAllPics(this.props.device.id)
	// }
	// componentWillUnmount = () => {
	// 	this._isMounted = 0
	// }
	const getPicsCallBack = () => {
		getAllPics(props.device.id)
	}
	const renderImageUpload = (dId) => {
		return <DeviceImageUpload
			t={t}
			dId={dId}
			imgUpload={getAllPics}
			callBack={getPicsCallBack}
		/>
	}
	const getAllPics = (id) => {
		getAllPictures(id).then(rs => { return setImg(rs) })
	}
	const handleOpenImageUpload = () => {
		setOpenImageUpload(true)
		// this.setState({ openImageUpload: true })
	}
	const handleOpenDeletePictureDialog = () => {
		setOpenDeleteImage(true)
		// this.setState({ openDeleteImage: true })
	}
	const handleCloseDeletePictureDialog = () => {
		setOpenDeleteImage(false)
		// this.setState({ openDeleteImage: false })
	}
	const handleCloseImageUpload = () => {
		setOpenImageUpload(false)
		// this.setState({ openImageUpload: false })
	}
	const handleDeletePicture = async () => {
		// const { img, activeStep } = this.state
		const dId = props.device.id
		setDeletingPicture(true)
		// this.setState({ deletingPicture: true })
		var deleted = await deletePicture(dId, img[activeStep].filename).then(rs => rs)
		if (deleted) {
			setImg(null)
			setOpenDeleteImage(false)
			// setOpenSnackbar(1)
			// this.setState({ img: null, openDeleteImage: false, openSnackbar: 1 })
			getAllPics(dId)
		}
		else {
			// setOpenSnackbar(2)
			setOpenDeleteImage(false)
			// this.setState({ openSnackbar: 2, openDeleteImage: false })
		}
	}

	// const snackBarMessages = () => {
	// 	// const { s } = this.props
	// 	let msg = openSnackbar
	// 	switch (msg) {
	// 		case 1:
	// 			s('snackbars.pictureDeleted')
	// 			break
	// 		case 2:
	// 			s('snackbars.pictureNotDeleted')
	// 			break
	// 		default:
	// 			break;
	// 	}
	// }
	const renderImageLoader = () => {
		return <CircularLoader fill />
	}
	const renderDeleteDialog = () => {
		// const { t } = this.props
		return <Dialog
			open={openDeleteImage}
			// onClose={handleCloseImageDelete}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.deviceImage')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.deviceImage')}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseDeletePictureDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={handleDeletePicture} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}


	// const { openImageUpload, img } = this.state
	const { classes, device } = props
	return (
		<InfoCard
			noHiddenPadding
			noPadding
			title={t('devices.cards.pictures')}
			avatar={<Image />}
			topAction={
				<Dropdown menuItems={
					[
						{ label: t('actions.uploadImages'), icon: CloudUpload, func: handleOpenImageUpload },
						{ label: t('actions.deletePicture'), icon: Delete, func: handleOpenDeletePictureDialog },
					]
				} />
			}
			hiddenContent={
				<Fragment>
					{img !== null ? img !== 0 ?
						<Fragment>
							{renderDeleteDialog()}
							<Grid container justify={'center'}>
								<DeviceImage
									t={t}
									useParent
									handleStep={handleStepChange}
									images={img ? img.map(m => m.image) : null} />
							</Grid>
						</Fragment>
						: <Grid container justify={'center'}> <Caption>{t('devices.noImages')}</Caption></Grid> : renderImageLoader()}
					<Modal
						aria-labelledby='simple-modal-title'
						aria-describedby='simple-modal-description'
						open={openImageUpload}
						onClose={handleCloseImageUpload}>
						<div className={classes.modal}>
							{renderImageUpload(device.id)}
						</div>
					</Modal>
				</Fragment>}
		/>
	)
}
export default withStyles(deviceStyles)(DeviceImages)