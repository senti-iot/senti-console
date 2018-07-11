import React, { Component, Fragment } from 'react'
import { getAllPictures } from 'variables/dataDevices';
import { Grid, withStyles, Menu, MenuItem, IconButton, Modal } from '@material-ui/core';
import InfoCard from 'components/Cards/InfoCard';
import { Image,  MoreVert, CloudUpload } from '@material-ui/icons'
import deviceStyles from 'assets/jss/views/deviceStyles';
import DeviceImage from 'components/Devices/DeviceImage';
import CircularLoader from 'components/Loader/CircularLoader';
// import ImageUpload from '../ImageUpload';
import { ItemGrid } from 'components';
import DeviceImageUpload from '../ImageUpload';

class DeviceImages extends Component {
	constructor(props) {
		super(props)

		this.state = {
			img: null,
			actionAnchor: null,
			openImageUpload: false
		}
	}
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
		getAllPictures(id).then(rs => this.setState({ img: rs }))
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
	handleCloseImageUpload = () => {
		this.setState({ openImageUpload: false })
	}
	renderImageLoader = () => {
		return <CircularLoader notCentered />
	}
	render() {
		const { actionAnchor, openImageUpload } = this.state
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
							))}
						</Menu>
					</ItemGrid>
				}
				noExpand
				content={
					this.state.img !== null ?
						<Fragment>
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
	
								<DeviceImage images={this.state.img} />
								{/* {this.renderImageUpload(device.device_id)} */}
							</Grid>
						</Fragment>
						: this.renderImageLoader()}
			/>
		)
	}
}
export default withStyles(deviceStyles)(DeviceImages)