import { Grid, IconButton, Menu, MenuItem, Toolbar, Typography, withStyles } from '@material-ui/core';
import { Add, FilterList, MoreVert } from '@material-ui/icons';
import { boxShadow } from 'assets/jss/material-dashboard-react';
import toolbarStyles from 'assets/jss/material-dashboard-react/tableToolBarStyle';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { ItemGrid } from '..';


let selectedRender = props => {
	const { numSelected, t } = props;
	return <Grid container justify={'space-between'} alignItems={'center'}>
		<ItemGrid>
			<Typography color="primary" variant="subheading">
				{numSelected + " " + t("tables.selected")}
			</Typography>
		</ItemGrid>
		<ItemGrid>
			<IconButton
				aria-label={t("menus.more")}
				aria-owns={props.anchorElMenu ? 'long-menu' : null}
				aria-haspopup="true"
				onClick={props.handleToolbarMenuOpen}>
				<MoreVert />
			</IconButton>
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
	const { classes, filterOptions, t } = props;
	const AddNewProject = () => props.history.push('/projects/new')
	return <ItemGrid container justify={'flex-end'} alignItems={'center'}>
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
					aria-label={t("tables.filter")}
					aria-owns={props.anchorFilterMenu ? "filter-menu" : null}
					onClick={props.handleFilterMenuOpen}>
					<FilterList />
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
		</Toolbar>
	);
};


EnhancedTableToolbar.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
};

export default withRouter(withStyles(toolbarStyles)(EnhancedTableToolbar));