import React, { Component, Fragment } from 'react'
import { withStyles, Button, Grid } from '@material-ui/core';
import { CloudUpload, Restore, Check } from '@material-ui/icons'
import { ItemGrid, Success, Warning } from 'components';
import ImageCarousel from 'components/Devices/ImageCarousel';
import { uploadPictures } from 'variables/data';


const styles = theme => ({
	grid: {
		justifyContent: "center"
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
		console.log(this.props.dId)
		await uploadPictures({
			device_id: this.props.dId,
			files: this.state.images,
		}).then(rs => { this.setState({ success: rs }); return rs})
	}
	finish = () => {
		this.setState({ images: [] })
		return this.props.callBack ? this.props.callBack() : ''
	}
	handleReset = () => { this.setState({ images: [] }) }
	render() {
		const { classes } = this.props
		const { images, success } = this.state
		return (
			<Grid container className={classes.grid}>
				<ItemGrid xs={12} noPadding container extraClass={classes.grid}>
					{images.length > 0 ? <ImageCarousel label={'Preview selected images'} images={[...images]} /> : null}
				</ItemGrid>
				<ItemGrid xs={12} container justify={'center'}>
					{images.length > 0 ?
						<Grid container justify={'center'}>
							<ItemGrid xs={12} container justify={'center'}>
								{success ?
									<Success>Images uploaded successfully</Success> :
									success === false ?
										<Warning>Images failed to upload! Please refresh and try again</Warning>
										: null}
							</ItemGrid>
							<ItemGrid xs={12} container justify={'center'}>
								<Button variant="contained" color={success ? "primary" : ''} component="span" className={classes.button} onClick={success ? this.finish : this.upload}>
									{!success ? <Fragment>
										<CloudUpload className={classes.iconButton} /> Upload
									</Fragment>
										: <Fragment>
											<Check className={classes.iconButton} /> Finish
										</Fragment>}
								</Button>
								<Button variant={"contained"} component="span" className={classes.button} onClick={this.handleReset}>
									<Restore className={classes.iconButton} /> Reset 
								</Button>
							</ItemGrid>
						</Grid> :
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
			</Grid>
		)
	}
}

export default withStyles(styles)(ImageUpload)