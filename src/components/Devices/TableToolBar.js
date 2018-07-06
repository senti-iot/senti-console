import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
// import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { boxShadow } from 'assets/jss/material-dashboard-react';
import { Menu, MenuItem, Grid, /* Tooltip */ } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
// import KeyArrRight from '@material-ui/icons/KeyboardArrowRight';
// import KeyArrLeft from '@material-ui/icons/KeyboardArrowLeft';

import Add from "@material-ui/icons/Add"
import IntegrationAutosuggest from 'components/Search/Search'
// import { DatePicker } from 'material-ui-pickers';
// import MomentUtils from 'material-ui-pickers/utils/moment-utils';
// import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import ItemGrid from '../Grid/ItemGrid';
import { withRouter } from 'react-router-dom'
import { toolbarStyles } from 'assets/jss/views/tabletoolbar';


let selectedRender = props => {
	const { numSelected, } = props;
	return <Grid container justify={'space-between'} alignItems={'center'}>
		<ItemGrid>
			<Typography color="primary" variant="subheading">
				{numSelected} selected
			</Typography>
		</ItemGrid>
		<ItemGrid>
			{/* <Tooltip title="Options"> */}
			<IconButton
				aria-label="More"
				aria-owns={props.anchorElMenu ? 'long-menu' : null}
				aria-haspopup="true"
				onClick={props.handleToolbarMenuOpen}>
				<MoreVertIcon />
			</IconButton>
			{/* </Tooltip> */}
			<Menu
				id="long-menu"
				anchorEl={props.anchorElMenu}
				open={Boolean(props.anchorElMenu)}
				onClose={props.handleToolbarMenuClose}
				PaperProps={{
					style: {
						// maxHeight: ITEM_HEIGHT * 4.5,
						width: 200,
						boxShadow: boxShadow
					}
				}}
			>
				{props.options().map((option, i) => {
					if (option.single)
						return numSelected === 1 ? <MenuItem key={i} onClick={option.func}>
							{option.label}
						</MenuItem> : null
					else {
						return <MenuItem key={i} onClick={option.func}>
							{option.label}
						</MenuItem>
					}


				}
				)}
			</Menu>
		</ItemGrid>
	</Grid>
}
let defaultRender = props => {
	const { classes, filterOptions } = props;
	const AddNewProject = () => props.history.push('/projects/new')
	return <Grid container justify={'space-between'} alignItems={'center'}>
		<ItemGrid xs={8}>
			<IntegrationAutosuggest
				suggestions={props.suggestions}
				handleFilterKeyword={props.handleFilterKeyword}
				searchValue={props.filters.keyword} />
		</ItemGrid>
		<ItemGrid xs={2} container justify={'flex-end'}>
			{props.noAdd ? null :
				// <Tooltip title={'Add New Project'}>
				<IconButton aria-label="Add new project" onClick={AddNewProject}>
					<Add />
				</IconButton>
				// </Tooltip>
			}
			{props.noFilterIcon ? null :
				<Fragment>
					{/* <Tooltip title="Filter list"> */}
					<IconButton
						className={classes.secondAction}
						aria-label="Filter list"
						aria-owns={props.anchorFilterMenu ? "filter-menu" : null}
						onClick={props.handleFilterMenuOpen}>
						<FilterListIcon />
					</IconButton>
					{/* </Tooltip> */}
					<Menu
						id="filter-menu"
						anchorEl={props.anchorFilterMenu}
						open={Boolean(props.anchorFilterMenu)}
						onClose={props.handleFilterMenuClose}
						PaperProps={{ style: { width: 200, boxShadow: boxShadow } }}>

						{filterOptions.map(option => {
							return <MenuItem key={option.id} onClick={props.handleFilter}>
								{option.label}
							</MenuItem>
						})}
					</Menu>
				</Fragment>}
		</ItemGrid>
	</Grid>
}
let EnhancedTableToolbar = props => {
	const { numSelected, classes } = props;
	return (
		<Toolbar
			className={classNames(classes.root, {
				[classes.highlight]: numSelected > 0,
			})}>

			<div className={classes.title}>
				{numSelected > 0 ? (
					selectedRender(props)
				) :
					defaultRender(props)
				}
			</div>
			{/* <div className={classes.spacer} /> */}
			{/* <div className={classes.actions}>
				{numSelected > 0 ? (
					
				) : null
				}
			</div> */}
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
};

export default withRouter(withStyles(toolbarStyles)(EnhancedTableToolbar));