import { Grid, IconButton, Menu, MenuItem, Toolbar, Typography, withStyles } from '@material-ui/core';
import { MoreVert as MoreVertIcon } from 'variables/icons';
// import FilterListIcon from '@material-ui/icons/FilterList';
import { boxShadow } from 'assets/jss/material-dashboard-react';
import toolbarStyles from 'assets/jss/material-dashboard-react/tableToolBarStyle';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { ItemGrid } from 'components';
import { ItemG } from 'components/index';
import FilterToolbar from './FilterToolbar';

let selectedRender = props => {
	const { numSelected, t } = props;
	return <Grid container justify={'space-between'} alignItems={'center'}>
		<ItemGrid>
			<Typography color='primary' variant='subtitle1'>
				{numSelected + ' ' + t('tables.selected')}
			</Typography>
		</ItemGrid>
		<ItemGrid>
			<IconButton
				aria-label={t('menus.more')}
				aria-owns={props.anchorElMenu ? 'long-menu' : null}
				aria-haspopup='true'
				onClick={props.handleToolbarMenuOpen}>
				<MoreVertIcon />
			</IconButton>
			<Menu
				id='long-menu'
				anchorEl={props.anchorElMenu}
				open={Boolean(props.anchorElMenu)}
				onClose={props.handleToolbarMenuClose}
				PaperProps={{
					style: {
						// maxHeight: ITEM_HEIGHT * 4.5,
						// width: 200,
						boxShadow: boxShadow
					}
				}}
			>
				{props.options().map((option, i) => {
					if (option.dontShow)
						return null
					if (option.single)
						return numSelected === 1 ? <MenuItem key={i} onClick={option.func}>
							<option.icon className={props.classes.leftIcon}/>{option.label}
						</MenuItem> : null
					else {
						return <MenuItem key={i} onClick={option.func}>
							<option.icon className={props.classes.leftIcon}/>{option.label}
						</MenuItem>
					}}
				)}
			</Menu>
		</ItemGrid>
	</Grid>
}
let defaultRender = props => {
	const { content } = props
	return <Fragment>
		<ItemG xs container alignItems={'center'}>
			<FilterToolbar
				addFilter={props.addFilter}
				removeFilter={props.removeFilter}
				filters={props.ft}
				t={props.t}
			/>
		</ItemG>
		<ItemG xs={2} container justify={'flex-end'} alignItems={'center'}>
			{content ? content : null}
		</ItemG>
	</Fragment>
}
let TableToolbar = props => {
	const { numSelected, classes } = props;
	return (
		<Toolbar
			className={classNames(classes.root, {
				[classes.highlight]: numSelected > 0,
			})}>

			<ItemG container alignItems={'center'}>
				{numSelected > 0 ? (
					selectedRender(props)
				) :
					defaultRender(props)
				}
			</ItemG>
			
		</Toolbar>
	);
};


TableToolbar.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
};

export default withRouter(withStyles(toolbarStyles)(TableToolbar));