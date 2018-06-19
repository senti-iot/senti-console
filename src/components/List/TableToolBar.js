import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
// import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { primaryColor, boxShadow } from 'assets/jss/material-dashboard-react';
import { Menu, MenuItem, Grid, Tooltip } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import KeyArrRight from '@material-ui/icons/KeyboardArrowRight';
import KeyArrLeft from '@material-ui/icons/KeyboardArrowLeft';

import Add from "@material-ui/icons/Add"
import IntegrationAutosuggest from 'components/Search/Search'
import { DatePicker } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import ItemGrid from '../Grid/ItemGrid';
import teal from '@material-ui/core/colors/teal'
import { withRouter } from 'react-router-dom'

const toolbarStyles = theme => ({
	secondAction: {
		[theme.breakpoints.down("sm")]: {
			marginTop: theme.spacing.unit * 3
		}
	},
	tooltip: {
		margin: 0,
		transition: "all 500ms ease"
	},
	open: {
		marginTop: 24
	},

	textField: {
		paddingBottom: 8,
		width: '100%'
	},
	root: {
		paddingRight: theme.spacing.unit,
		paddingLeft: "16px"
	},
	highlight:
		theme.palette.type === 'light'
			? {
				color: primaryColor,
				backgroundColor: lighten(theme.palette.secondary.light, 0.85),
			}
			: {
				color: theme.palette.text.primary,
				backgroundColor: theme.palette.secondary.dark,
			},
	spacer: {
		flex: '1 1 33%',
	},
	actions: {
		color: theme.palette.text.secondary,
	},
	title: {
		flex: '1 1 33%',
	},
	headerFilter: {
		flex: '1 1 33%'
	},
	froot: {
		opacity: 0.42
	},
	label: {
		'&$focused': {
			color: teal[500],
		},
	},
	focused: {},
	underline: {
		'&:after': {
			borderBottomColor: teal[500],
		},
	},
});

let EnhancedTableToolbar = props => {
	const { numSelected, classes, filterOptions } = props;
	return (
		<Toolbar
			className={classNames(classes.root, {
				[classes.highlight]: numSelected > 0,
			})}
		>
			<div className={classes.title}>
				{numSelected > 0 ? (
					<Typography color="primary" variant="subheading">
						{numSelected} selected
					</Typography>
				) :
					<MuiPickersUtilsProvider utils={MomentUtils}>
						<Grid container >
							<ItemGrid xs={12} sm={6} >
								<IntegrationAutosuggest
									suggestions={props.suggestions}
									handleFilterKeyword={props.handleFilterKeyword}
									searchValue={props.filters.keyword}
								/>
							</ItemGrid>
							{props.noDatePickers ? null :
								<React.Fragment>
									<ItemGrid xs>
										<DatePicker
											autoOk
											label="Start Date"
											clearable
											fullWidth
											format="DD.MM.YYYY"
											value={props.filters.startDate}
											onChange={props.handleFilterStartDate}
											animateYearScrolling={false}
											color="primary"
											rightArrowIcon={<KeyArrRight />}
											leftArrowIcon={<KeyArrLeft />}
											InputLabelProps={
												{
													FormLabelClasses: {
														root: classes.label,
														focused: classes.focused,
													},
												}
											}
											InputProps={{
												classes: {
													underline: classes.underline,
												}
											}}
										/>
									</ItemGrid>
									<ItemGrid xs>
										<DatePicker
											color="primary"
											autoOk
											label="End Date"
											clearable
											fullWidth
											format="DD.MM.YYYY"
											value={props.filters.endDate}
											onChange={props.handleFilterEndDate}
											animateYearScrolling={false}
											rightArrowIcon={<KeyArrRight />}
											leftArrowIcon={<KeyArrLeft />}
											InputLabelProps={
												{
													FormLabelClasses: {
														root: classes.label,
														focused: classes.focused,
													},
												}
											}
											InputProps={{
												classes: {
													underline: classes.underline,
												}
											}}
										
										/>
									</ItemGrid>
								</React.Fragment>
							}
						</Grid>
					</MuiPickersUtilsProvider>
				}
			</div>
			{/* <div className={classes.spacer} /> */}
			<div className={classes.actions}>
				{numSelected > 0 ? (
					<Fragment>
						<Tooltip title="Options">
							<IconButton
								aria-label="More"
								aria-owns={props.anchorElMenu ? 'long-menu' : null}
								aria-haspopup="true"
								onClick={props.handleToolbarMenuOpen}>
								<MoreVertIcon />
							</IconButton>
						</Tooltip>
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
							{props.options.map((option, i) => (
								<MenuItem key={i} onClick={option.func}>
									{option.label}
								</MenuItem>
							))}
						</Menu>
					</Fragment>
				) :
					(<Fragment>
						{props.noAdd ? null :
							<Tooltip title={'Add New Project'} placement={'bottom'}
								classes={{
									open: classes.open,
									tooltip: classes.tooltip
								}}
							>
								<IconButton aria-label="Add new project" onClick={() => props.history.push('/newproject')}>
									<Add />
								</IconButton>
							</Tooltip>
						}
						{props.noFilterIcon ? null :
							<Fragment>
								<Tooltip title="Filter list"
									classes={{
										open: classes.open,
										tooltip: classes.tooltip
									}}>
									<IconButton
										className={classes.secondAction}
										aria-label="Filter list"
										aria-owns={props.anchorFilterMenu ? "filter-menu" : null}
										onClick={props.handleFilterMenuOpen}>
										<FilterListIcon />
									</IconButton>
								</Tooltip>
								<Menu
									id="filter-menu"
									anchorEl={props.anchorFilterMenu}
									open={Boolean(props.anchorFilterMenu)}
									onClose={props.handleFilterMenuClose}
									PaperProps={{
										style: {
										// maxHeight: ITEM_HEIGHT * 4.5,
											width: 200,
											boxShadow: boxShadow
										}
									}}
								>
									{filterOptions.map(option => (
										<MenuItem key={option.id} onClick={props.handleFilter}>
											{option.label}
										</MenuItem>
									))}
								</Menu>
							</Fragment>}		
					</Fragment>)
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