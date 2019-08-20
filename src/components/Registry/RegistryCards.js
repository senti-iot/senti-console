import React, { Component } from 'react'
import PropTypes from 'prop-types'
import RegistryCard from './RegistryCard';
import { ItemG, GridContainer } from 'components';
import { connect } from 'react-redux'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';
import { withStyles } from '@material-ui/core';
import CP from 'components/Table/CP';

class RegistryCards extends Component {
	constructor(props) {
	  super(props)
	
		this.state = {
			page: 0
	  }
	}
	
	static propTypes = {
		projects: PropTypes.array,
	}
	
	handleChangePage = (event, page) => {
		this.setState({ page });
	}

	render() {
		const { registries, t,  rowsPerPage, classes } = this.props
		const { page } = this.state
		return (
			<GridContainer spacing={2}>			
				{registries ? registries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p, i) =>
					<ItemG container key={i} justify={'center'} xs={12} sm={6} md={4}><RegistryCard t={t} key={p.id} p={p} /></ItemG>
				) : null}
				<ItemG xs={12}>
					<CP
						count={registries ? registries.length : 0}
						classes={classes}
						page={page}
						t={t}
						handleChangePage={this.handleChangePage}
					/>
				</ItemG>
			</GridContainer>

		)
	}
}
const mapStateToProps = (state) => ({
	rowsPerPage: state.appState.CPP
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(devicetableStyles, { withTheme: true })(RegistryCards))