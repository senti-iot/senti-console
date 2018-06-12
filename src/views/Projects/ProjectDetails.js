import React from 'react'
import { CardMedia, Grid, ListItemText } from '@material-ui/core';
import { ItemGrid } from 'components';

const ProjectDetails = ({ ...props }) => {
	console.log(props.project.img)
	return (
		<React.Fragment>
			<CardMedia
				// className={props.classes.media}
				src={"https://78.media.tumblr.com/a4d7adcd25f0bd5b5bb17bffb4daff88/tumblr_mnh0n9pHJW1st5lhmo1_1280.jpg"}
				title=""
			/>
			<Grid container spacing={8}>
				{/* {Object.keys(props.project).map((key, ikey) => */}
				{/* <ItemGrid key={ikey} xs={3}> */}
				{/* <ListItemText primary={key} secondary={props.project[key]} /> */}
				{/* </ItemGrid> */}
				{/* )} */}
			</Grid>

		</React.Fragment>
	)
}

export default ProjectDetails
