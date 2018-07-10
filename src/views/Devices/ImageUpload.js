import React, { Component } from 'react'
import { withStyles, Button, Grid } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons'
import { ItemGrid } from 'components';
// import ImageCarousel from 'components/Devices/ImageCarousel';
import DeviceImage from 'components/Devices/DeviceImage';


const styles = theme => ({
	grid: {
		justifyContent:	"center"
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
		marginLeft: theme.spacing.unit
	}
});
class ImageUpload extends Component {
	constructor(props) {
		super(props)

		this.state = {
			images: []
		}
	}
	tempUpload = e => {
		if (e.target.files[0]) {
			var imgs = [...e.target.files]
			this.setState({ images: imgs })
			this.props.imgUpload(imgs)
		}
	}
	render() {
		const { classes } = this.props
		const { images } = this.state
		return (
			<Grid container className={classes.grid}>
				<ItemGrid xs={12} noPadding container extraClass={classes.grid}>
					{images.length > 0 ? <DeviceImage images={[...images]} /> : null}
				</ItemGrid>
				<ItemGrid xs={12} container justify={'center'}>
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
				</ItemGrid>
			</Grid>
		)
	}
}

export default withStyles(styles)(ImageUpload)