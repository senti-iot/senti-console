import React, { Component, Fragment } from 'react'
import { getAllPictures, deletePicture } from 'variables/dataDevices';
import { Grid, withStyles, Menu, MenuItem, IconButton, Modal, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import InfoCard from 'components/Cards/InfoCard';
import { Image,  MoreVert, CloudUpload, Delete } from '@material-ui/icons'
import deviceStyles from 'assets/jss/views/deviceStyles';
import DeviceImage from 'components/Devices/DeviceImage';
import CircularLoader from 'components/Loader/CircularLoader';
// import ImageUpload from '../ImageUpload';
import { ItemGrid, Caption } from 'components';
import DeviceImageUpload from '../ImageUpload';

class DeviceImages extends Component {
	constructor(props) {
		super(props)

		this.state = {
			activeStep: 0,
			img: null,
			actionAnchor: null,
			openImageUpload: false,
			openDeleteImage: false,
			deletingPicture: false,
			deleted: null
		}
	}

	handleStepChange = activeStep => {
		this.setState({ activeStep });
	};
	componentDidMount = async () => {
		await this.getAllPics(this.props.device.device_id)
	}
	getPicsCallBack = () => {
		this.getAllPics(this.props.device.device_id)
	}
	renderImageUpload = (dId) => {

		return <DeviceImageUpload dId={dId} imgUpload={this.getAllPics} callBack={this.getPicsCallBack} />
	}
	getAllPics = (id) => {
		getAllPictures(id).then(rs => { return this.setState({ img: rs }) })
	}
	handleOpenActionsImages = e => {
		this.setState({ actionAnchor: e.currentTarget })
	}
	handleCloseActionsImages = e => {
		this.setState({ actionAnchor: null })
	}
	handleOpenImageUpload = () => {
		this.setState({ openImageUpload: true, actionAnchor: null })
	}
	handleOpenDeletePictureDialog = () => {
		this.setState({ openDeleteImage: true, actionAnchor: null })
	}
	handleCloseDeletePictureDialog = () => {
		this.setState({ openDeleteImage: false })
	}
	handleCloseImageUpload = () => {
		this.setState({ openImageUpload: false })
	}
	handleDeletePicture = async () => {
		const { img, activeStep } = this.state
		const dId = this.props.device.device_id
		this.setState({ deletingPicture: true })
		var deleted = await deletePicture(dId, img[activeStep].filename).then(rs => rs)
		if (deleted) {	
			this.setState({ img: null, openDeleteImage: false })
			this.getAllPics(dId)
		}
	}
	renderImageLoader = () => {
		return <CircularLoader notCentered />
	}
	render() {
		const { actionAnchor, openImageUpload, openDeleteImage, img } = this.state
		const { classes, device } = this.props
		return (
			<InfoCard
				title={"Pictures"}
				avatar={<Image />}
				topAction={
					<ItemGrid>
						<IconButton
							aria-label="More"
							aria-owns={actionAnchor ? 'long-menu' : null}
							aria-haspopup="true"
							onClick={this.handleOpenActionsImages}>
							<MoreVert />
						</IconButton>
						<Menu
							id="long-menu"
							anchorEl={actionAnchor}
							open={Boolean(actionAnchor)}
							onClose={this.handleCloseActionsImages}
							PaperProps={{
								style: {
									maxHeight: 200,
									minWidth: 200
								}
							}}>
							<MenuItem onClick={this.handleOpenImageUpload}>
								<CloudUpload className={classes.leftIcon} />Upload Pictures
							</MenuItem>
							<MenuItem onClick={this.handleOpenDeletePictureDialog}>
								<Delete className={classes.leftIcon} />Delete this picture
							</MenuItem>
							))}
						</Menu>
					</ItemGrid>
				}
				noExpand
				content={
					img !== null ? img !== 0 ?
						<Fragment>
							<Dialog
								open={openDeleteImage}
								onClose={this.handleCloseImageDelete}
								aria-labelledby="alert-dialog-title"
								aria-describedby="alert-dialog-description"
							>
								<DialogTitle id="alert-dialog-title">Delete Picture</DialogTitle>
								<DialogContent>
									<DialogContentText id="alert-dialog-description">
										Are you sure you want to delete the picture? 
									</DialogContentText>
								</DialogContent>
								<DialogActions>
									<Button onClick={this.handleCloseDeletePictureDialog} color="primary">
										No
									</Button>
									<Button onClick={this.handleDeletePicture} color="primary" autoFocus>
										Yes
									</Button>
								</DialogActions>
							</Dialog>
							<Modal
								aria-labelledby="simple-modal-title"
								aria-describedby="simple-modal-description"
								open={openImageUpload}
								onClose={this.handleCloseImageUpload}>
								<div className={classes.modal}>
									{this.renderImageUpload(device.device_id)}
								</div>
							</Modal>
							<Grid container justify={'center'}>
	
								<DeviceImage
									useParent
									handleStep={this.handleStepChange}
									images={ img ? img.map(m => m.image ) : null} />
								{/* {this.renderImageUpload(device.device_id)} */}
							</Grid>
						</Fragment>
						: <Grid container justify={'center'}> <Caption> There are no pictures uploaded</Caption></Grid> : this.renderImageLoader()}
			/>
		)
	}
}
export default withStyles(deviceStyles)(DeviceImages)