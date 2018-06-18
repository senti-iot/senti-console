import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Grid, ExpansionPanelActions, Grow, Typography, Popover, IconButton, Menu, MenuItem } from '@material-ui/core';
// import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';

// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ItemGrid from '../Grid/ItemGrid';
import { primaryColor, hoverColor, boxShadow } from 'assets/jss/material-dashboard-react';

const styles = theme => ({
	button: {
		color: "#FFF",
		backgroundColor: primaryColor,
		'&:hover': {
			backgroundColor: hoverColor
		}
	},
	subheader: {
		padding: 0,
		backgroundColor: '#fff',
	},
	Checkbox: {
		color: primaryColor,
		'&$checked': {
			color: primaryColor
		},
	},
	expSumContent: {
		"&:last-child": {
			padding: 0
		}
	},
	expSumRoot: {
		"&:last-child": {
			padding: 0
		}
	},
	paper: {
		padding: theme.spacing.unit,
		boxShadow: boxShadow
	},
	popover: {
		pointerEvents: 'none',
	},
	checked: {
	},
	leftSecondaryAction: {
		left: '-5px',
		right: 0
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular,
	},
	listItem: {
		width: '100%'
	},
	ListItemText: {
		margin: theme.spacing.unit
	},
	expSumAction: {
		padding: 0
	},
	contactPerson: {
		"&:hover": {
			background: 'red',
			color: '#fff'
		}
	}
});

const options = [
	'Export to PDF',
	'Delete'
];
class ProjectList extends React.Component {
	state = {
		checked: [],
		open: false,
		anchorEl: null,
		anchorElMenu: null
	};
	handleClick = event => {
		event.stopPropagation()
		this.setState({ anchorElMenu: event.currentTarget });
	};

	handleClose = e => {
		e.stopPropagation()
		this.setState({ anchorElMenu: null });
	};

	handlePopoverOpen = event => {
		this.setState({ anchorEl: event.target });
	};
	handlePopoverClose = () => {
		this.setState({ anchorEl: null });
	};
	handleToggle = value => e => {
		e.stopPropagation()
		const { checked } = this.state;
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		this.setState({
			checked: newChecked,
		});
	};
	handleEditButton = project => e => {
		e.stopPropagation()
	}
	handleSeeMoreButton = project => e => {
		e.stopPropagation()
		this.props.history.push('/project/' + project.id)
	}
	render() {
		const { classes, items } = this.props;
		const { anchorElMenu } = this.state
		// console.log(items)
		let open = !!this.state.anchorEl
		return (
			<div>
				<List className={classes.list}>
					{items.length > 0 ? items.map((i, value) => (
						<Grow key={value} in style={{ transformOrigin: '0 0 0' }} timeout={value * 100}>
							<ListItem
								key={value}
								className={classes.listItem}
							>
								<ExpansionPanel className={classes.listItem}>
									<ExpansionPanelSummary
										classes={{
											content: classes.expSumContent,
											root: classes.expSumRoot
										}}>
										<ListItemText className={classes.ListItemText} disableTypography={true}>
											<Typography>
												{i.title}
											</Typography>
											<Typography color={'textSecondary'}>
												{i.description}
											</Typography>
										</ListItemText>
										<ExpansionPanelActions className={classes.expSumContent} classes={{ root: classes.expSumAction }}>
											<IconButton
												aria-label="More"
												aria-owns={anchorElMenu ? 'long-menu' : null}
												aria-haspopup="true"
												onClick={this.handleClick}>
												<MoreVertIcon />
											</IconButton>
											<Menu
												id="long-menu"
												anchorEl={anchorElMenu}
												open={Boolean(anchorElMenu)}
												onClose={this.handleClose}
												PaperProps={{
													style: {
														// maxHeight: ITEM_HEIGHT * 4.5,
														width: 200,
														boxShadow: boxShadow
													}
												}}
												PopoverClasses={
													classes.paper
												}
											>
												{options.map(option => (
													<MenuItem key={option} onClick={this.handleClose}>
														{option}
													</MenuItem>
												))}
											</Menu>
											{/* <Button mini variant="fab" aria-label="edit" className={classes.button} onClick={this.handleEditButton(i)}>
												<EditIcon />
											</Button> */}
										</ExpansionPanelActions>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<div className={classes.listItem}>
											<Grid container>
												<ItemGrid xs>
													<ListItemText className={classes.ListItemText} >
														<Typography color={'textSecondary'}>
															{"Start Date"}
														</Typography>
														<Typography>
															{i.open_date}
														</Typography>
													</ListItemText>
												</ItemGrid>
												<ItemGrid xs>
													<ListItemText className={classes.ListItemText}>
														<Typography color={'textSecondary'}>
															{"End Date"}
														</Typography>
														<Typography>
															{i.close_date}
														</Typography>
													</ListItemText>
												</ItemGrid>
												<ItemGrid xs>
													<ListItemText className={classes.ListItemText}>
														<Typography color={'textSecondary'}>
															{"Created"}
														</Typography>
														<Typography>
															{i.created}
														</Typography>
													</ListItemText>
												</ItemGrid>
											</Grid>
											<Grid container>
												<ItemGrid xs>
													<ListItemText className={classes.ListItemText}>
														<Typography color={'textSecondary'}>
															{"Progress"}
														</Typography>
														<Typography>
															{i.progress}
														</Typography>
													</ListItemText>
												</ItemGrid>
												<ItemGrid xs>
													<ListItemText className={classes.ListItemText}>
														<Typography color={'textSecondary'} style={{ cursor: 'default' }}>
															{"Contact Person"}
														</Typography>
														<Typography style={{ cursor: 'default', width: '200px' }} onMouseOver={this.handlePopoverOpen} onMouseOut={this.handlePopoverClose}>
															{i.user.vcFirstName + ' ' + i.user.vcLastName}
														</Typography>
													</ListItemText>
													<Popover
														className={classes.popover}
														classes={{
															paper: classes.paper
														}}
														open={open}
														anchorEl={this.state.anchorEl}
														anchorOrigin={{
															vertical: 'bottom',
															horizontal: 'center',
														}}
														transformOrigin={{
															vertical: 'top',
															horizontal: 'left',
														}}
														onClose={this.handlePopoverClose}
														disableRestoreFocus>
														<Typography color={'textSecondary'} style={{ cursor: 'default' }}>
															{"Phone"}
														</Typography>
														<Typography style={{ cursor: 'default' }}>
															{i.user.vcPhone}
														</Typography>
														<Typography color={'textSecondary'} style={{ cursor: 'default' }}>
															{"Email"}
														</Typography>
														<Typography style={{ cursor: 'default' }}>
															{i.user.vcEmail}
														</Typography>
													</Popover>

												</ItemGrid>
												{/* <ItemGrid xs>
													<Button mini variant="fab" aria-label="edit" className={classes.button} onClick={this.handleSeeMoreButton(i)}>
														<SeeMoreIcon />
													</Button>
												</ItemGrid> */}

											</Grid>
										</div>

									</ExpansionPanelDetails>
								</ExpansionPanel>


							</ListItem>
						</Grow>
					)) : null}
				</List>
			</div>)
	}
}

ProjectList.propTypes = {
	classes: PropTypes.object.isRequired,
	items: PropTypes.array.isRequired
};

export default withStyles(styles)(ProjectList);