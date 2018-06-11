import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { Checkbox, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ItemGrid from '../Grid/ItemGrid';
import { primaryColor } from 'assets/jss/material-dashboard-react';

const styles = theme => ({
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

	render() {
		const { classes, items } = this.props;

		return (
			<div>
				<List className={classes.list}>
					{items.map((i, value) => (
						<ListItem
							key={value}
							className={classes.listItem}
						>

							<ExpansionPanel>
								<ExpansionPanelSummary
									expandIcon={<ExpandMoreIcon />}>
									<Checkbox
										checked={this.state.checked.indexOf(value) !== -1}
										onClick={this.handleToggle(value)}
										classes={{
											root: classes.Checkbox,
											checked: classes.checked,
										}}
									/>
									<ListItemText className={classes.ListItemText} primary={i.title} secondary={i.description} />
									<ListItemSecondaryAction>
										<IconButton aria-label="Edit">
											<EditIcon />
										</IconButton>
									</ListItemSecondaryAction>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails>
									<div>
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
					))}
				</List>
			</div>)
	}
}

ProjectList.propTypes = {
	classes: PropTypes.object.isRequired,
	items: PropTypes.array.isRequired
};

export default withStyles(styles)(ProjectList);