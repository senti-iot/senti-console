/* eslint-disable indent */
import { AppBar, Dialog, Divider, IconButton, List, ListItem, ListItemText, Toolbar, Typography, withStyles, Hidden, Tooltip } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
// import { getAllOrgs } from 'variables/dataOrgs';
import { ItemG, CircularLoader, SlideT } from 'components';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import assignStyles from 'assets/jss/components/assign/assignStyles';
import { useSelector } from 'react-redux'
import { useLocalization } from 'hooks';


// const mapStateToProps = (state) => ({
// 	orgs: state.data.orgs
// })

const AssignOrgDialog = React.memo(props => {
	const t = useLocalization()
	const orgs = useSelector(state => state.data.orgs)
	// const [stateOrgs, setStateOrgs] = useState([])
	const [selectedOrg, /* setSelectedOrg */] = useState(null)
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
	// componentDidMount = async () => {
	// 	this._isMounted = 1
	// 	// await getAllOrgs().then(rs => this._isMounted ? this.setState({ orgs: rs }) : null)
	// }
	// componentWillUnmount = () => {
	// 	this._isMounted = 0
	// }
	const assignOrg = sId => e => {
		// let sId = this.state.selectedOrg
		let org = orgs[orgs.findIndex(o => o.id === sId)]
		props.callBack(org)
	}

	// const selectOrg = pId => e => {
	// 	e.preventDefault()
	// 	setSelectedOrg(pId)
	// 	// this.setState({ selectedOrg: pId })
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
					<Hidden smDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={3} container alignItems={'center'}>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('orgs.pageTitle')}
								</Typography>
							</ItemG>
							<ItemG xs>
								<Search
									fullWidth
									open={true}
									focusOnMount
									suggestions={orgs ? suggestionGen(orgs) : []}
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
									{t('orgs.pageTitle')}
								</Typography>
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
						<ListItem button onClick={assignOrg(p.id)} value={p.id}
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
								primary={p.name} />
						</ListItem>
						<Divider />
					</Fragment>
				)
				) : <CircularLoader />}
			</List>
		</Dialog>

	)
})

AssignOrgDialog.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(assignStyles)(AssignOrgDialog)