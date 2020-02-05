import React, { useState } from 'react'
import PropTypes from 'prop-types'
import CollectionCard from 'components/Collections/CollectionCard';
import { ItemG, GridContainer } from 'components';
import { useSelector } from 'react-redux'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';
import { withStyles } from '@material-ui/core';
import CP from 'components/Table/CP';
import { useLocalization } from 'hooks'

// const mapStateToProps = (state) => ({
// 	rowsPerPage: state.appState.CPP
// })

// @Andrei
const CollectionsCards = props => {
	const t = useLocalization()
	const rowsPerPage = useSelector(state => state.appState.CPP)
	const [page, setPage] = useState(0)
	// constructor(props) {
	//   super(props)

	// 	this.state = {
	// 		page: 0
	//   }
	// }

	const handleChangePage = (event, newpage) => {
		setPage(newpage)
		// this.setState({ page });
	}

	const { collections, classes } = props
	// const { page } = this.state
	return (
		<GridContainer spacing={2} justify={'center'}>
			{collections ? collections.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p, i) =>
				<ItemG container key={i} justify={'center'} xs={12} sm={6} md={4}><CollectionCard history={props.history} t={t} key={p.id} d={p} /></ItemG>
			) : null}
			<ItemG xs={12}>
				<CP
					count={collections ? collections.length : 0}
					classes={classes}
					page={page}
					t={t}
					handleChangePage={handleChangePage}
				/>
			</ItemG>
		</GridContainer>

	)
}

CollectionsCards.propTypes = {
	collections: PropTypes.array,
}

export default withStyles(devicetableStyles, { withTheme: true })(CollectionsCards)