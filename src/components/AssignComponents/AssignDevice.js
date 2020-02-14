/* eslint-disable indent */
import { AppBar, Button, Dialog, Divider, IconButton, List, ListItem, ListItemText, Toolbar, Typography, Hidden } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import { getAvailableDevices } from 'variables/dataDevices';
import { ItemG, CircularLoader, Info, SlideT } from 'components';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import { assignDeviceToCollection } from 'variables/dataCollections';
import assignStyles from 'assets/jss/components/assign/assignStyles';
import { useLocalization } from 'hooks'

const AssignDevice = props => {
	const classes = assignStyles()
	const t = useLocalization()
	const [devices, setDevices] = useState([])
	const [selectedDevices, setSelectedDevices] = useState([])
	const [noData, setNoData] = useState(false)
	const [filters, setFilters] = useState({
		keyword: '',
		startDate: null,
		endDate: null,
		activeDateFilter: false
	})
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		devices: [],
	// 		selectedDevices: [],
	// 		noData: false,
	// 		filters: {
	// 			keyword: '',
	// 			startDate: null,
	// 			endDate: null,
	// 			activeDateFilter: false
	// 		}
	// 	}
	// }

	//#region Lifecycle

	useEffect(() => {
		const asyncFunc = async () => {
			const { orgId } = props
			await getAvailableDevices(orgId).then(rs => {
				return rs ? setDevices(rs) : () => {
					setDevices(null)
					setNoData(true)
				}
			})
		}
		asyncFunc()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	this._isMounted = 1
	// 	const { orgId } = this.props
	// 	await getAvailableDevices(orgId).then(rs => {
	// 		return rs ? this.setState({ devices: rs }) : this.setState({ devices: null, noData: true })
	// 	})
	// }
	// componentWillUnmount = () => {
	// 	this._isMounted = 0
	// }

	//#endregion

	//#region External

	const assignDevice = async () => {
		const { collectionId } = props
		await assignDeviceToCollection({
			id: collectionId,
			deviceId: selectedDevices
		}).then(() => {
			let device = devices[devices.findIndex(d => d.id === selectedDevices)].name
			props.handleClose(true, device)
		})
	}

	//#endregion

	//#region Handlers

	const handleSelectDevice = pId => e => {
		e.preventDefault()
		if (selectedDevices === pId)
			setSelectedDevices({ id: 0 })
		else setSelectedDevices(pId)
		// this.setState({ selectedDevices: { id: 0 } })
		// else { this.setState({ selectedDevices: pId }) }
	}

	// const handleClick = (event, id) => {
	// 	event.stopPropagation()
	// 	const selectedIndex = selectedDevices.indexOf(id)
	// 	let newSelected = [];

	// 	if (selectedIndex === -1) {
	// 		newSelected = newSelected.concat(selectedDevices, id);
	// 	} else if (selectedIndex === 0) {
	// 		newSelected = newSelected.concat(selectedDevices.slice(1))
	// 	} else if (selectedIndex === selectedDevices.length - 1) {
	// 		newSelected = newSelected.concat(selectedDevices.slice(0, -1))
	// 	} else if (selectedIndex > 0) {
	// 		newSelected = newSelected.concat(
	// 			selectedDevices.slice(0, selectedIndex),
	// 			selectedDevices.slice(selectedIndex + 1),
	// 		);
	// 	}
	// 	setSelectedDevices(newSelected)
	// 	// this.setState({ selectedDevices: newSelected })
	// }


	const handleCloseDialog = () => {
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

	const isSelected = id => selectedDevices === id ? true : false

	//#endregion

	const { open } = props;
	const appBarClasses = cx({
		[' ' + classes['primary']]: 'primary'
	});
	return (
		<div>
			<Dialog
				fullScreen
				open={open}
				onClose={handleCloseDialog}
				TransitionComponent={SlideT}
			>
				<AppBar className={classes.appBar + appBarClasses}>
					<Toolbar>
						<Hidden mdDown>
							<ItemG container alignItems={'center'}>
								<ItemG xs={2} container alignItems={'center'}>
									<IconButton color='inherit' onClick={props.handleCancel} aria-label='Close'>
										<Close />
									</IconButton>
									<Typography variant='h6' color='inherit' className={classes.flex}>
										{t('devices.pageTitle')}
									</Typography>
								</ItemG>
								<ItemG xs={8}>
									<Search
										fullWidth
										open={true}
										focusOnMount
										suggestions={devices ? suggestionGen(devices) : []}
										handleFilterKeyword={handleFilterKeyword}
										searchValue={filters.keyword} />
								</ItemG>
								<ItemG xs={2}>
									<Button color='inherit' onClick={assignDevice}>
										{t('actions.save')}
									</Button>
								</ItemG>
							</ItemG>
						</Hidden>
						<Hidden lgUp>
							<ItemG container alignItems={'center'}>
								<ItemG xs={12} container alignItems={'center'}>
									<IconButton color={'inherit'} onClick={props.handleCancel} aria-label='Close'>
										<Close />
									</IconButton>
									<Typography variant='h6' color='inherit' className={classes.flex}>
										{t('devices.pageTitle')}
									</Typography>
									<Button variant={'contained'} color='primary' onClick={assignDevice}>
										{t('actions.save')}
									</Button>
								</ItemG>
								<ItemG xs={12} container alignItems={'center'} justify={'center'}>
									<Search
										noAbsolute
										fullWidth
										open={true}
										focusOnMount
										suggestions={devices ? suggestionGen(devices) : []}
										handleFilterKeyword={handleFilterKeyword}
										searchValue={filters.keyword} />
								</ItemG>
							</ItemG>
						</Hidden>
					</Toolbar>
				</AppBar>
				{noData ? <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Info>{t('no.devices')}</Info>
				</div> : <List>
						{devices ? filterItems(devices, filters).map((p, i) => (
							<Fragment key={i}>
								<ListItem button
									onClick={handleSelectDevice(p.id)}
									classes={{ root: isSelected(p.id) ? classes.selectedItem : null }}>
									<ListItemText
										primaryTypographyProps={{ className: isSelected(p.id) ? classes.selectedItemText : null }}
										secondaryTypographyProps={{ classes: { root: isSelected(p.id) ? classes.selectedItemText : null } }}
										primary={p.name} secondary={p.id} />
								</ListItem>
								<Divider />
							</Fragment>
						)
						) : <CircularLoader />}
					</List>}
			</Dialog>
		</div>
	);
}

AssignDevice.propTypes = {
	// classes: PropTypes.object.isRequired,
	orgId: PropTypes.number.isRequired,
	collectionId: PropTypes.number.isRequired,
};

export default AssignDevice