import { AppBar, Dialog, Divider, IconButton, List, ListItem, ListItemText, Toolbar, Typography, Hidden, Tooltip } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames';
import React, { Fragment, useState } from 'react';
import { ItemG, CircularLoader, SlideT } from 'components';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import assignStyles from 'assets/jss/components/assign/assignStyles';
import { useSelector } from 'react-redux'
import TP from 'components/Table/TP';
import { useLocalization } from 'hooks';

const AssignSensorDialog = props => {

	//Hooks
	const t = useLocalization()
	const classes = assignStyles()

	//Redux
	const sensors = useSelector(state => state.data.sensors)

	//State
	const [page, setPage] = useState(0)
	const [filters, setFilters] = useState({
		keyword: '',
		value: null,
		endDate: null,
		activeDateFilter: false
	})

	//Const
	const { open } = props;
	const height = window.innerHeight
	const rows = Math.round((height - 85 - 49 - 49) / 49)
	const appBarClasses = cx({
		[' ' + classes['primary']]: 'primary'
	});

	//useCallbacks

	//useEffects

	//Handlers


	const assignSensor = sId => e => {
		let org = sensors[sensors.findIndex(o => o.id === sId)]
		props.callBack(org)
	}
	const closeDialog = () => {
		props.handleClose(false)
	}
	const handleFilterKeyword = value => {
		setFilters({ ...filters, keyword: value })

	}
	const handleChangePage = (event, newpage) => {
		setPage(newpage)
	}

	return (
		<Dialog
			fullScreen
			open={open}
			TransitionComponent={SlideT}
		>
			<AppBar className={classes.appBar + appBarClasses}>
				<Toolbar>
					<Hidden smDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={3} container alignItems={'center'}>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('sidebar.devices')}
								</Typography>
							</ItemG>
							<ItemG xs>
								<Search
									fullWidth
									open={true}
									focusOnMount
									suggestions={sensors ? suggestionGen(sensors) : []}
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
									{t('sidebar.devices')}
								</Typography>
							</ItemG>
							<ItemG xs={12} container alignItems={'center'} justify={'center'}>
								<Search
									noAbsolute
									fullWidth
									open={true}
									focusOnMount
									suggestions={sensors ? suggestionGen(sensors) : []}
									handleFilterKeyword={handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{sensors ? filterItems(sensors, filters).slice(page * rows, page * rows + rows).map((p, i) => (
					<Fragment key={i}>
						<ListItem button onClick={assignSensor(p.id)} value={p.id}>
							<ListItemText primary={p.name} />
						</ListItem>
						<Divider />
					</Fragment>
				)
				) : <CircularLoader />}
				<TP
					disableRowsPerPage
					count={sensors ? sensors.length : 0}
					page={page}
					t={t}
					handleChangePage={handleChangePage}
				/>
			</List>
		</Dialog>

	);
}


export default AssignSensorDialog