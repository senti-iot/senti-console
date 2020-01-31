import { AppBar, Dialog, Divider, IconButton, List, ListItem, ListItemText, Toolbar, Typography, withStyles, Hidden, Tooltip } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
// import { getAllDeviceTypes } from 'variables/dataDeviceTypes';
import { ItemG, CircularLoader, SlideT } from 'components';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import assignStyles from 'assets/jss/components/assign/assignStyles';
import { useSelector } from 'react-redux'
import TP from 'components/Table/TP';
import { useLocalization } from 'hooks'

// const mapStateToProps = (state, props) => ({
// 	deviceTypes: state.data.deviceTypes,
// 	rowsPerPage: state.appState.trp > 0 ? state.appState.trp : state.settings.trp,
// })

// this used to be a PureComponent, so hopefully the usage of memo is correct here
const AssignDeviceTypeDialog = React.memo(props => {
	const t = useLocalization()
	const deviceTypes = useSelector(state => state.data.deviceTypes)
	// const rowsPerPage = useSelector(state => state.appState.trp > 0 ? state.appState.trp : state.settings.trp)

	// const [stateDeviceTypes, setStateDeviceTypes] = useState([])
	const [selectedDeviceType, /*setSelectedDeviceType*/] = useState(null)
	const [page, setPage] = useState(0)
	const [filters, setFilters] = useState({
		keyword: '',
		startDate: null,
		endDate: null,
		activeDateFilter: false
	})
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		deviceTypes: [],
	// 		selectedDeviceType: null,
	// 		page: 0,
	// 		filters: {
	// 			keyword: '',
	// 			startDate: null,
	// 			endDate: null,
	// 			activeDateFilter: false
	// 		}
	// 	}
	// }
	// componentDidMount = async () => {
	// 	this._isMounted = 1
	// 	// await getAllDeviceTypes().then(rs => this._isMounted ? this.setState({ deviceTypes: rs }) : null)
	// }
	// componentWillUnmount = () => {
	// 	this._isMounted = 0
	// }
	const assignDeviceType = sId => e => {
		// let sId = this.state.selectedDeviceType
		let deviceTypes = props.deviceTypes
		let org = deviceTypes[deviceTypes.findIndex(o => o.id === sId)]
		props.callBack(org)
	}
	// const selectDeviceType = pId => e => {
	// 	e.preventDefault()
	// 	setSelectedDeviceType(pId)
	// 	// this.setState({ selectedDeviceType: pId })
	// }
	const closeDialog = () => {
		props.handleClose(false)
	}
	const handleFilterKeyword = value => {
		setFilters({ ...filters, keyword: value })
		// this.setState({
		// 	filters: {
		// 		...this.state.filters,
		// 		keyword: value
		// 	}
		// })
	}
	const handleChangePage = (event, newpage) => {
		setPage(newpage)
		// this.setState({ page });
	}

	const { classes, open } = props;

	let height = window.innerHeight
	let rows = Math.round((height - 85 - 49 - 49) / 49)
	let rowsPerPage = rows

	const appBarClasses = cx({
		[' ' + classes['primary']]: 'primary'
	});
	return (
		<Dialog
			fullScreen
			open={open}
			// onClose={handleClose}
			TransitionComponent={SlideT}
		>
			<AppBar className={classes.appBar + appBarClasses}>
				<Toolbar>
					<Hidden smDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={3} container alignItems={'center'}>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('sidebar.devicetypes')}
								</Typography>
							</ItemG>
							<ItemG xs>
								<Search
									fullWidth
									open={true}
									focusOnMount
									suggestions={deviceTypes ? suggestionGen(deviceTypes) : []}
									handleFilterKeyword={handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
							<ItemG xs={1}>
								<Tooltip title={t('actions.cancel')}>
									<IconButton color='inherit' onClick={closeDialog} aria-label='Close'>
										<Close />
									</IconButton>
								</Tooltip>
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden mdUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={12} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={closeDialog} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('sidebar.devicetypes')}
								</Typography>
							</ItemG>
							<ItemG xs={12} container alignItems={'center'} justify={'center'}>
								<Search
									noAbsolute
									fullWidth
									open={true}
									focusOnMount
									suggestions={deviceTypes ? suggestionGen(deviceTypes) : []}
									handleFilterKeyword={handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{deviceTypes ? filterItems(deviceTypes, filters).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p, i) => (
					<Fragment key={i}>
						<ListItem button onClick={assignDeviceType(p.id)} value={p.id}
							classes={{
								root: selectedDeviceType === p.id ? classes.selectedItem : null
							}}
						>
							<ListItemText
								primaryTypographyProps={{
									className: selectedDeviceType === p.id ? classes.selectedItemText : null
								}}
								secondaryTypographyProps={{
									classes: { root: selectedDeviceType === p.id ? classes.selectedItemText : null }
								}}
								primary={p.name} />
						</ListItem>
						<Divider />
					</Fragment>
				)
				) : <CircularLoader />}
				<TP
					disableRowsPerPage
					count={deviceTypes ? deviceTypes.length : 0}
					page={page}
					t={t}
					handleChangePage={handleChangePage}
				/>
			</List>
		</Dialog>

	);
})

AssignDeviceTypeDialog.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(assignStyles)(AssignDeviceTypeDialog)