import React, { Component, Fragment } from 'react'
import { withStyles, Button } from '@material-ui/core';
import { CloudUpload, Restore, Check } from '@material-ui/icons'
import { ItemGrid, Success, Warning } from 'components';
// import ImageCarousel from 'components/Devices/ImageCarousel';
import { uploadPictures } from 'variables/dataDevices';
import GridContainer from 'components/Grid/GridContainer';
import DeviceImage from 'components/Devices/DeviceImage';


const styles = theme => ({
	grid: {
		padding: 8,
		justifyContent: 'center'
	},
	button: {
		margin: theme.spacing.unit,
	},
	input: {
		display: 'none',
	},
	imgPreview: {
		maxWidth: 200,
		margin: theme.spacing.unit
	},
	iconButton: {
		marginRight: theme.spacing.unit
	}
});
class ImageUpload extends Component {
	constructor(props) {
		super(props)

		this.state = {
			images: [],
			success: null
		}
	}
	tempUpload = e => {
		if (e.target.files[0]) {
			var imgs = [...e.target.files]
			this.setState({ images: imgs })
		}
	}
	upload = async () => {
		await uploadPictures({
			device_id: this.props.dId,
			files: this.state.images,
		}).then(rs => { this.setState({ success: rs }); return rs })
	}
	finish = () => {
		this.setState({ images: [] })
		if (this.props.callBack)
			this.props.callBack()
		// return this.props.callBack ? this.props.callBack() : ''
	}
	handleReset = () => { this.setState({ images: [] }) }
	render() {
		const { classes } = this.props
		const { images, success } = this.state
		return (
			<GridContainer className={classes.grid}>
				<ItemGrid xs={12} noPadding container zeroMargin extraClass={classes.grid}>
					{images.length > 0 ? <DeviceImage label={'Preview selected images'} images={[...images]} /> : null}
				</ItemGrid>
				<ItemGrid xs={12} container zeroMargin justify={'center'}>
					{images.length > 0 ?
						<Fragment>
							{success ?
								<ItemGrid xs={12} zeroMargin container justify={'center'}>
									{success === true ? <Success>Images uploaded successfully</Success> :
										success === false ?
											<Warning>Images failed to upload! Please refresh and try again</Warning>
											: null}
								</ItemGrid> : null}
							<ItemGrid xs={6} noMargin container justify={'center'}>
								<Button variant="contained" color={success ? "primary" : 'default'} component="span" className={classes.button} onClick={success ? this.finish : this.upload}>
									{!success ? <Fragment>
										<CloudUpload className={classes.iconButton} /> Upload
									</Fragment>
										: <Fragment>
											<Check className={classes.iconButton} /> Finish
										</Fragment>}
								</Button>
							</ItemGrid>
							<ItemGrid xs={6} noMargin container justify={'center'}>
								<Button variant={"contained"} component="span" className={classes.button} onClick={this.handleReset}>
									<Restore className={classes.iconButton} /> Reset
								</Button>
							</ItemGrid>
						</Fragment>
						 :
						<Fragment>
							<input
								accept="image/*"
								className={classes.input}
								id="contained-button-file"
								multiple
								type="file"
								name="sentiFile"
								encType="multipart/form-data"
								onChange={this.tempUpload}
							/>
							<label htmlFor="contained-button-file">
								<Button variant="contained" component="span" className={classes.button}>
									<CloudUpload className={classes.iconButton} /> Add Images
								</Button>
							</label>
						</Fragment>
					}
				</ItemGrid>
			</GridContainer>
		)
	}
}

export default withStyles(styles)(ImageUpload)