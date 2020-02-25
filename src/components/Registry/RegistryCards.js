import React, { useState } from 'react'
import PropTypes from 'prop-types'
import RegistryCard from './RegistryCard';
import { ItemG, GridContainer } from 'components';
import { useSelector } from 'react-redux'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';
// import { withStyles } from '@material-ui/core';
import CP from 'components/Table/CP';
import { useLocalization, /* useHistory */ } from 'hooks';

// const mapStateToProps = (state) => ({
// 	rowsPerPage: state.appState.CPP
// })

const RegistryCards = props => {
	const classes = devicetableStyles()
	const t = useLocalization()
	// const history = useHistory()
	const rowsPerPage = useSelector(store => store.appState.CPP)
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

	const { registries } = props
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
					handleChangePage={handleChangePage}
				/>
			</ItemG>
		</GridContainer>
	)
}

RegistryCards.propTypes = {
	projects: PropTypes.array
}

export default RegistryCards