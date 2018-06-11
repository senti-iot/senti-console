import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { Checkbox } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

const styles = theme => ({
	subheader: {
		padding: 0,
		backgroundColor: '#fff',
		position: 'sticky'
	},
	Checkbox: {
		color: 'red'
	},
});

class ProjectList extends React.Component {
	state = {
		checked: [],
	};

	handleToggle = value => () => {
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
							role={undefined}
							button

							className={classes.listItem}
						>
							<Checkbox
								checked={this.state.checked.indexOf(value) !== -1}
								tabIndex={-1}
								onClick={this.handleToggle(value)}
								disableRipple
								className={classes.Checkbox}
							/>
							<ListItemText className={classes.ListItemText} primary={i.title} secondary={i.description} />
							<ListItemSecondaryAction>
								<IconButton aria-label="Comments">
									<EditIcon />
								</IconButton>
							</ListItemSecondaryAction>
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