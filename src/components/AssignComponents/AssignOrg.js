/* eslint-disable indent */
import { AppBar, Button, Dialog, Divider, IconButton, List, ListItem, ListItemText, Toolbar, Typography, withStyles, Hidden } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import { getAllOrgs } from 'variables/dataOrgs';
import { updateDevice } from 'variables/dataDevices'
import { updateCollection } from 'variables/dataCollections';
import { ItemG, CircularLoader, SlideT } from 'components';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import assignStyles from 'assets/jss/components/assign/assignStyles';
import { useLocalization } from 'hooks'



const AssignOrg = React.memo(props => {
	const t = useLocalization()
	const [orgs, setOrgs] = useState([])
	const [selectedOrg, setSelectedOrg] = useState(null)
	const [filters, setFilters] = useState({
		keyword: '',
		startDate: null,
		endDate: null,
		activeDateFilter: false
	})
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		orgs: [],
	// 		selectedOrg: null,
	// 		filters: {
	// 			keyword: '',
	// 			startDate: null,
	// 			endDate: null,
	// 			activeDateFilter: false
	// 		}
	// 	}
	// }
	useEffect(() => {
		const asyncFunc = async () => {
			await getAllOrgs().then(rs => setOrgs(rs))
		}
		asyncFunc()
	}, [])
	// componentDidMount = async () => {
	// 	this._isMounted = 1
	// 	await getAllOrgs().then(rs => this._isMounted ? this.setState({ orgs: rs }) : null)
	// }
	// componentWillUnmount = () => {
	// 	this._isMounted = 0
	// }


	const assignOrg = async () => {
		if (props.devices)
			Promise.all(props.deviceId.map(e =>
				updateDevice({ ...e, org: { id: selectedOrg } }).then(rs => rs)
			)).then(rs => {
				props.handleClose(true)
			})
		if (props.collections) {
			Promise.all(props.collectionId.map(e => {
				return updateCollection({ ...e, org: { id: selectedOrg } })
			})).then(rs => {
				props.handleClose(true)
			}
			)
		}
	}

	// function Transition(props) {
	// 	return <Slide direction='up' {...props} />;
	// }
	const selectOrg = pId => e => {
		e.preventDefault()
		setSelectedOrg(pId)
		// this.setState({ selectedOrg: pId })
	}
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
	const { classes, open } = props;
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
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={closeDialog} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('orgs.pageTitle')}
								</Typography>
							</ItemG>
							<ItemG xs={8}>
								<Search
									fullWidth
									open={true}
									focusOnMount
									suggestions={orgs ? suggestionGen(orgs) : []}
									handleFilterKeyword={handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
							<ItemG xs={2}>
								<Button color='inherit' onClick={assignOrg}>
									{t('actions.save')}
								</Button>
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={12} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={closeDialog} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('orgs.pageTitle')}
								</Typography>
								<Button variant={'contained'} color='primary' onClick={assignOrg}>
									{t('actions.save')}
								</Button>
							</ItemG>
							<ItemG xs={12} container alignItems={'center'} justify={'center'}>
								<Search
									noAbsolute
									fullWidth
									open={true}
									focusOnMount
									suggestions={orgs ? suggestionGen(orgs) : []}
									handleFilterKeyword={handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{orgs ? filterItems(orgs, filters).map((p, i) => (
					<Fragment key={i}>
						<ListItem button onClick={selectOrg(p.id)} value={p.id}
							classes={{
								root: selectedOrg === p.id ? classes.selectedItem : null
							}}
						>
							<ListItemText primaryTypographyProps={{
								className: selectedOrg === p.id ? classes.selectedItemText : null
							}}
								secondaryTypographyProps={{
									classes: { root: selectedOrg === p.id ? classes.selectedItemText : null }
								}}
								primary={p.name} /* secondary={p.user.organisation} */ />
						</ListItem>
						<Divider />
					</Fragment>
				)
				) : <CircularLoader />}
			</List>
		</Dialog>
	);
})

AssignOrg.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(assignStyles)(AssignOrg);