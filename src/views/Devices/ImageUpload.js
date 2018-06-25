import React, { Component } from 'react'
import { withStyles, Button } from '@material-ui/core';


const RenderIMG = ({ ...props }) => {
	return (
		
		<img src={props.img} alt="" className={props.className}/>
		
	)
}

const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	input: {
		display: 'none',
	},
	imgPreview: {
		height: 200,
		width: 200
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
		console.log([...e.target.files])
		var imgs = [...e.target.files]
		var arr = []
		imgs.forEach(image => {
			arr.push(URL.createObjectURL(image))
		});
		console.log(arr)
		this.setState({ images: arr })
	}
	render() {
		const { classes } = this.props
		return (
		  <div>
				{/* <Button
					variant={"raised"}
					containerElement='label' // <-- Just add me!
					label='My Label'>
					<input type="file" style={{ display: 'none' }}  />
				</Button> */}
				<input
					accept="image/*"
					className={classes.input}
					id="contained-button-file"
					multiple
					type="file"
					onChange={this.tempUpload}
				/>
				<label htmlFor="contained-button-file">
					<Button variant="contained" component="span" className={classes.button}>
						Upload
					</Button>
				</label>
				<img src={this.state.images[0]} alt={"it should work"} className={classes.imgPreview}/>
				{this.state.images.length > 0 ? (this.state.images.forEach((image, index) => {
					console.log(this.state.images[0], index, this.state.images[index])
					return <RenderIMG key={index} img={this.state.images[index]} className={classes.imgPreview} />})) : null}
				
		  </div>
		)
	}
}

export default withStyles(styles)(ImageUpload)