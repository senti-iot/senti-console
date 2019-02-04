import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CollectionCard from 'components/Collections/CollectionCard';
import { ItemG, GridContainer } from 'components';
import { connect } from 'react-redux'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';
import { withStyles } from '@material-ui/core';
import CP from 'components/Table/CP';

class CollectionsCards extends Component {
	constructor(props) {
	  super(props)
	
		this.state = {
			page: 0
	  }
	}
	
	static propTypes = {
		collections: PropTypes.array,
	}
	
	handleChangePage = (event, page) => {
		this.setState({ page });
	}

	render() {
		const { collections, t,  rowsPerPage, classes } = this.props
		const { page } = this.state
		return (
			<GridContainer spacing={8} justify={'center'}>			
				{collections ? collections.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p, i) =>
					<ItemG container key={i} justify={'center'} xs={12} sm={6} md={4}><CollectionCard history={this.props.history} t={t} key={p.id} d={p} /></ItemG>
				) : null}
				<ItemG xs={12}>
					<CP
						count={collections ? collections.length : 0}
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(devicetableStyles, { withTheme: true })(CollectionsCards))