import React from 'react'
import { CircularLoader, GridContainer, ItemG } from 'components';
import { Paper, Typography, withStyles } from '@material-ui/core';
import CodeSplit from 'assets/img/404/CodeSplit.svg'
const styles = (theme) => {
	return ({
		paper: {
			display: 'flex',
			justifyContent: 'center',
			width: '100%',
			padding: 10
		},
		img: {
			height: '500px',
			width: '100%',
			margin: 24,
			background: theme.palette.type === 'dark' ? "#fff" : "#cecece",
			webkitMask: `url(${CodeSplit}) no-repeat center`,
			mask: `url(${CodeSplit}) no-repeat center`,
		}

	})}
const AsyncLoader = (props) => {
	if (props.isLoading) {
		return <CircularLoader />;
	}
	else if (props.error) {
		console.log(props.error)
		return <GridContainer>
			<Paper className={props.classes.paper}>
				<ItemG container alignItems={'center'} direction={'column'}>
					<Typography variant={'title'}>Uh..Oh.. We've lost a piece of the puzzle along the way...</Typography>
					<div className={props.classes.img}/>
					<Typography variant={'body1'}>Try refreshing...If the issue persists,in the browser console there should be an error, copy it and send it to info@senti.cloud</Typography>
				</ItemG>
			</Paper>
		</GridContainer>
	}
	else {
		return null;
	}
};

export default withStyles(styles)(AsyncLoader)