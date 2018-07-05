import React, { Component } from 'react'
import { getAllPictures } from 'variables/dataDevices';
import { Grid, withStyles, Menu, MenuItem } from '@material-ui/core';
import InfoCard from 'components/Cards/InfoCard';
import { Image,  MoreVert, CloudUpload } from '@material-ui/icons'
import deviceStyles from 'assets/jss/views/deviceStyles';
import DeviceImage from 'components/Devices/DeviceImage';
import CircularLoader from 'components/Loader/CircularLoader';
import ImageUpload from '../ImageUpload';
import { ItemGrid, IconButton } from 'components';

class DeviceImages extends Component {
	constructor(props) {
		super(props)

		this.state = {
			img: null,
			actionAnchor: null
		}
	}
	componentDidMount = async () => {
		await this.getAllPics(this.props.device.device_id)
	}
	renderImageUpload = (dId) => {
		const getPics = () => {
			this.getAllPics(this.props.device.device_id)
		}
		return <ImageUpload dId={dId} imgUpload={this.getAllPics} callBack={getPics} />
	}
	getAllPics = (id) => {
		getAllPictures(id).then(rs => this.setState({ img: rs }))
	}
	renderImageLoader = () => {
		return <CircularLoader notCentered />
	}
	render() {
		const { actionAnchor } = this.state
		const { classes } = this.props
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
							onClick={this.handleOpenActionsHardware}>
							<MoreVert />
						</IconButton>
						<Menu
							id="long-menu"
							anchorEl={actionAnchor}
							open={Boolean(actionAnchor)}
							onClose={this.handleCloseActionsHardware}
							PaperProps={{
								style: {
									maxHeight: 200,
									minWidth: 200
								}
							}}>
							<MenuItem onClick={() => this.props.history.push(`${this.props.match.url}/edit-hardware`)}>
								<CloudUpload className={classes.leftIcon} />Upload Pictures
							</MenuItem>
							))}
						</Menu>
					</ItemGrid>
				}
				noExpand
				content={
					this.state.img !== null ?
						<Grid container justify={'center'}>
							<DeviceImage images={this.state.img} />
							{/* {this.renderImageUpload(device.device_id)} */}
						</Grid>
						: this.renderImageLoader()}
			/>
		)
	}
}
export default withStyles(deviceStyles)(DeviceImages)