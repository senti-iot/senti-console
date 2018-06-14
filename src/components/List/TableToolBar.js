import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
// import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { primaryColor, boxShadow } from 'assets/jss/material-dashboard-react';
import { Menu, MenuItem, TextField } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const options = [
	'Export to PDF',
	'Delete'
];
const toolbarStyles = theme => ({
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: "calc( 100vw - 120px)",
		paddingBottom: 16
	},
	root: {
		paddingRight: theme.spacing.unit,
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
		flex: '1 1 66%',
	},
	actions: {
		color: theme.palette.text.secondary,
	},
	title: {
		flex: '1 1 auto',
	},
});

let EnhancedTableToolbar = props => {
	const { numSelected, classes } = props;
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
					<TextField
						id="search"
						label="Search ..."
						className={classes.textField}
						// value={this.state.name}
						// onChange={this.handleChange('name')}
						margin="none"
					/>
				}
			</div>
			<div className={classes.spacer} />
			<div className={classes.actions}>
				{numSelected > 0 ? (
					<React.Fragment>
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
							{options.map(option => (
								<MenuItem key={option} onClick={props.handleToolbarMenuClose}>
									{option}
								</MenuItem>
							))}
						</Menu>
					</React.Fragment>
				) :
					<Tooltip title="Filter list">
						<IconButton aria-label="Filter list">
							<FilterListIcon />
						</IconButton>
					</Tooltip>
				}
			</div>
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
};

export default withStyles(toolbarStyles)(EnhancedTableToolbar);