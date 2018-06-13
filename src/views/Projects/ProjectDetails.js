import React from 'react'
import { Grid, /* ListItemText */ } from '@material-ui/core';
import { /* ItemGrid */ } from 'components';

const ProjectDetails = ({ ...props }) => {
	console.log(props.project.img)
	return (
		<React.Fragment>
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
