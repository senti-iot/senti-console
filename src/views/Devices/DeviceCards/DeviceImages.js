import React, { Component } from 'react'
import { getAllPictures } from 'variables/dataDevices';
import { Grid, withStyles } from '@material-ui/core';
import InfoCard from 'components/Cards/InfoCard';
import { Image } from '@material-ui/icons'
import deviceStyles from 'assets/jss/views/deviceStyles';
import DeviceImage from 'components/Devices/DeviceImage';
import CircularLoader from 'components/Loader/CircularLoader';
import ImageUpload from '../ImageUpload';

class DeviceImages extends Component {
	constructor(props) {
		super(props)

		this.state = {
			img: []
		}
	}
	componentDidMount = async () => {
		await this.getAllPics(this.props.device.device_id)
	}
	renderImageUpload = (dId) => {
		const getPics = () => {
			this.getAllPics(this.state.device.device_id)
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
		// const { actionAnchor } = this.state
		const { device } = this.props
		return (
			<InfoCard
				title={"Pictures"}
				avatar={<Image />}
				noExpand
				content={
					this.state.img !== null ?
						this.state.img === 0 ?
							this.renderImageUpload(device.device_id) :
							<Grid container justify={'center'}>
								<DeviceImage images={this.state.img} />
								{this.renderImageUpload(device.device_id)}
							</Grid>
						: this.renderImageLoader()} />
		)
	}
}
export default withStyles(deviceStyles)(DeviceImages)