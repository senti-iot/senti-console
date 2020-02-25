import React, { useState } from 'react'
import PropTypes from 'prop-types'
import DeviceCard from 'components/Devices/DeviceCard';
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
const DevicesCards = props => {
	const t = useLocalization()
	const rowsPerPage = useSelector(state => state.appState.CPP)
	const [page, setPage] = useState(0)
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		page: 0
	// 	}
	// }

	const handleChangePage = (event, newpage) => {
		setPage(newpage)
		// this.setState({ page });
	}

	const { devices, classes } = props
	// const { page } = this.state
	return (
		<GridContainer spacing={2} justify={'center'}>
			{devices ? devices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p, i) =>
				<ItemG container key={i} justify={'center'} xs={12} sm={6} md={4}><DeviceCard t={t} key={p.id} d={p} /></ItemG>
			) : null}
			<ItemG xs={12}>
				<CP
					count={devices ? devices.length : 0}
					classes={classes}
					page={page}
					t={t}
					handleChangePage={handleChangePage}
				/>
			</ItemG>
		</GridContainer>
	)
}

DevicesCards.propTypes = {
	devices: PropTypes.array,
}

export default withStyles(devicetableStyles, { withTheme: true })(DevicesCards)