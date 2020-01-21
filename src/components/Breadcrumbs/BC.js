import React, { Component } from 'react'
import breadcrumbs from 'routes/breadcrumbs';
import { Link } from 'react-router-dom'
import { Typography, withStyles, /* IconButton */ Link as MuiLink } from '@material-ui/core';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import { connect } from 'react-redux'


const ExpansionPanelSummary = withStyles({
	root: {
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
		},
		'&:last-child': {
		}
	},
	expanded: {},
})(props => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';

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

			bc.dontShow || !globalBC ? null : <Breadcrumbs separator="›" arial-label="Breadcrumb" className={classes.breadcrumbs}>
				<MuiLink component={Link} color="inherit" to={defaultRoute}>
					{t(`sidebar.home`)}
				</MuiLink>
				{bcs && bcs.map((bc, index) => {
					const last = bcs.length - 1 === index
					return last ? (
						<Typography color="textPrimary" key={index}>
							{bc.label}
						</Typography>
					) : (<MuiLink component={Link} color="inherit" to={bc.path} key={index}>
						{bc.label}
					</MuiLink>);
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
