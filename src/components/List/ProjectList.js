import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Checkbox, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Grid, Button, ExpansionPanelActions } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ItemGrid from '../Grid/ItemGrid';
import { primaryColor, hoverColor } from 'assets/jss/material-dashboard-react';

const styles = theme => ({
	button: {
		// margin: theme.spacing.unit,
		// marginRight: '20px',
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
	}
});

class ProjectList extends React.Component {
	state = {
		checked: [],
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
		console.log(project)
	}
	render() {
		const { classes, items } = this.props;
		console.log(items)
		return (
			<div>
				<List className={classes.list}>
					{items.length > 0 ? items.map((i, value) => (
						<ListItem
							key={value}
							className={classes.listItem}
						>

							<ExpansionPanel className={classes.listItem}>
								<ExpansionPanelSummary
									classes={{
										content: classes.expSumContent,
										root: classes.expSumRoot
									}}
								>

									<ListItemText className={classes.ListItemText} primary={i.title} secondary={i.description} />
									<ExpansionPanelActions className={classes.expSumContent} classes={{
										root: classes.expSumAction
									}}>
										<Button mini variant="fab" aria-label="edit" className={classes.button} onClick={this.handleEditButton(i)}>
											<EditIcon />
										</Button>
									</ExpansionPanelActions>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails>
									<div className={classes.listItem}>
										<Grid container>
											<ItemGrid xs>
												<ListItemText className={classes.ListItemText} primary={i.open_date} secondary={"Start Date"} />
											</ItemGrid>
											<ItemGrid xs>
												<ListItemText className={classes.ListItemText} primary={i.close_date} secondary={"End Date"} />
											</ItemGrid>
											<ItemGrid xs>
												<ListItemText className={classes.ListItemText} primary={i.created} secondary={"Created"} />
											</ItemGrid>
										</Grid>
										<Grid container>
											<ItemGrid xs>
												<ListItemText className={classes.ListItemText} primary={i.progress} secondary={"Progress"} />
											</ItemGrid>
											<ItemGrid xs>
												<ListItemText className={classes.ListItemText} primary={i.user.vcFirstName + ' ' + i.user.vcLastName} secondary={"Contact Person"} />
											</ItemGrid>
										</Grid>
									</div>

								</ExpansionPanelDetails>
							</ExpansionPanel>


						</ListItem>
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