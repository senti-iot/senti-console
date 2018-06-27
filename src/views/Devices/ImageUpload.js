import React, { Component } from 'react'
import { withStyles, Button, Grid } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons'
import { ItemGrid } from 'components';


const styles = theme => ({
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
		var imgs = [...e.target.files]
		// console.log(arr)
		this.setState({ images: imgs })
		this.props.imgUpload(imgs)
	}
	render() {
		const { classes } = this.props
		const { images } = this.state
		return (
			<div>

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
						Upload<CloudUpload className={classes.iconButton} />
					</Button>
				</label>
				<Grid container> 
					{
						[...images].map((img, index) => {
							let blob = URL.createObjectURL(img)
							return <ItemGrid xs={2} key={index}>
								<img src={blob} alt={'preview'} className={classes.imgPreview} />
							</ItemGrid>
						})
					}
				</Grid>			

				<form action="https://senti.cloud/rest/senti/device/image/8020/" method="POST" encType="multipart/form-data">
					<input type="file" name="sentiFile" />
					<input type="submit" />
				</form>
				
		  </div>
		)
	}
}

export default withStyles(styles)(ImageUpload)