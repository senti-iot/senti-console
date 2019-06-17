import React, { Component } from 'react'
import breadcrumbs from 'routes/breadcrumbs';
import { Link } from 'react-router-dom'
import { Typography, withStyles, /* IconButton */ } from '@material-ui/core';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
// import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import { connect } from 'react-redux'
// import { ExpandMore } from 'variables/icons';
// import FilterToolbar from 'components/Table/FilterToolbar';

// const ExpansionPanel = withStyles({
// 	root: {
// 		//   border: '1px solid rgba(0,0,0,.125)',
// 		boxShadow: 'none',
// 		'&:not(:last-child)': {
// 			borderBottom: 0,
// 		},
// 		'&:before': {
// 			display: 'none',
// 		},
// 	},
// 	expanded: {
// 		margin: 'auto',
// 	},
// })(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
	root: {
		//   backgroundColor: 'rgba(0,0,0,.03)',
		//   borderBottom: '1px solid rgba(0,0,0,.125)',
		cursor: "default !important",
		marginBottom: -1,
		minHeight: 56,
		'&$expanded': {
			minHeight: 56,
		},

	},
	content: {
		margin: 0,
		'&$expanded': {
			// margin: '12px 0',
		},
		'&:last-child': {
		}
	},
	expanded: {},
})(props => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';

// const ExpansionPanelDetails = withStyles(theme => ({
// 	root: {
// 		padding: theme.spacing.unit * 2,
// 	},
// }))(MuiExpansionPanelDetails);

const styles = theme => ({
	breadcrumbs: {
		display: 'flex',
		margin: "24px 24px 0px 24px",
		[theme.breakpoints.down('md')]: {
			margin: "8px 8px 0px 8px"
		}
	},
})
class BC extends Component {
	constructor(props) {
		super(props)

		this.state = {
			open: false,
		}
	}

	render() {
		const { defaultRoute, bc, t, classes, globalBC } = this.props
		// const { open } = this.state
		const bcs = breadcrumbs(t, bc.name, bc.extra)[bc.id]
		return (
		
			// <ExpansionPanel
			// 	expanded={open}
			// >
			// 	<ExpansionPanelSummary>
			bc.dontShow || !globalBC ? null : <Breadcrumbs separator="›" arial-label="Breadcrumb" className={classes.breadcrumbs}>
				<Link color="inherit" to={defaultRoute}>
					{t(`sidebar.home`)}
				</Link>}
				{bcs && bcs.map((bc, index) => {
					const last = bcs.length - 1 === index
					return last ? (
						<Typography color="textPrimary" key={index}>
							{bc.label}
						</Typography>
					) : (
						<Link color="inherit" to={bc.path} key={index}>
							{bc.label}
						</Link>
					);
				})}
			</Breadcrumbs>
			// 		<div style={{ paddingRight: 0, marginLeft: 'auto', color: '#fff', padding: '0px !important' }}>
			// 			<IconButton onClick={() => this.setState({ open: !this.state.open })}>
			// 				<ExpandMore />
			// 			</IconButton>
			// 		</div>
			// 	</ExpansionPanelSummary>
			// 	<ExpansionPanelDetails>
			// 		<FilterToolbar
			// 			reduxKey={bc.name}
			// 			filters={[]}
			// 			t={t}
			// 		/>
			// 	</ExpansionPanelDetails>
			// </ExpansionPanel>
		)
	}
}
const mapStateToProps = (state) => ({
	globalBC: state.settings.breadcrumbs
})

export default connect(mapStateToProps)(withStyles(styles)(BC))
