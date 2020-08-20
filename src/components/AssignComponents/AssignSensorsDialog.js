import { AppBar, Dialog, Divider, IconButton, List, ListItem, ListItemText, Toolbar, Typography, Hidden, Tooltip, Button } from '@material-ui/core'
import { Close } from 'variables/icons'
import cx from 'classnames'
import React, { Fragment, useState } from 'react'
import { ItemG, CircularLoader, SlideT } from 'components'
import Search from 'components/Search/Search'
import { suggestionGen, filterItems } from 'variables/functions'
import assignStyles from 'assets/jss/components/assign/assignStylesHooks'
import TP from 'components/Table/TP'
import { useLocalization, useSelector } from 'hooks'


const AssignSensorsDialog = (props) => {

	//Hooks
	const t = useLocalization()
	const classes = assignStyles()
	//Redux
	const sensors = useSelector(s => props.deviceTypeId ? s.data.sensors.filter(d => d.type_id === props.deviceTypeId) : s.data.sensors)

	//State
	const [selectedSensors, setSelectedSensors] = useState(props.selected ? props.selected : [])
	const [page, setPage] = useState(0)
	const [filterWord, setFilterWord] = useState('')

	const handleSelectSensor = (sId, sName, sUuid) => e => {
		selectSensor(sId, sName, sUuid)
	}

	//Const
	const { open } = props
	const height = window.innerHeight
	const rowsPerPage = Math.round((height - 85 - 49 - 49) / 49)
	const appBarClasses = cx({
		[' ' + classes['primary']]: 'primary'
	})

	//useCallbacks

	//useEffects

	//Handlers

	const selectSensor = (sId, sName, sUuid) => {
		console.log(sId, sName, sUuid)
		let sS = [...selectedSensors]
		if (selectedSensors.findIndex(s => s.id === sId) > -1) {
			sS.splice(selectedSensors.findIndex(s => s.id === sId), 1)
		}
		else {
			sS.push({ id: sId, name: sName, uuid: sUuid })
		}

		setSelectedSensors(sS)
	}
	const handleClose = () => {
		props.handleClose(false)
	}
	const handleSave = () => {
		props.handleSave(selectedSensors)
		props.handleClose(false)
	}
	const handleFilterKeyword = value => {
		setFilterWord(value)
	}

	const handleChangePage = (event, page) => {
		setPage(page)
	}

	return (
		<Dialog
			fullScreen
			open={open}
			onClose={handleClose}
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
									searchValue={filterWord} />
							</ItemG>
							<ItemG xs={2}>
								<Button color='inherit' onClick={handleSave}>
									{t('actions.save')}
								</Button>
							</ItemG>
							<ItemG xs={1}>
								<Tooltip title={t('actions.cancel')}>
									<IconButton color='inherit' onClick={handleClose} aria-label='Close'>
										<Close />
									</IconButton>
								</Tooltip>
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden mdUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={12} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={handleClose} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('sidebar.devices')}
								</Typography>
								<Button variant={'contained'} color='primary' onClick={handleSave}>
									{t('actions.save')}
								</Button>
							</ItemG>
							<ItemG xs={12} container alignItems={'center'} justify={'center'}>
								<Search
									noAbsolute
									fullWidth
									open={true}
									focusOnMount
									suggestions={sensors ? suggestionGen(sensors) : []}
									handleFilterKeyword={handleFilterKeyword}
									searchValue={filterWord} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{sensors ? filterItems(sensors, { keyword: filterWord }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((s, i) => (
					<Fragment key={i}>
						<ListItem
							button
							onClick={handleSelectSensor(s.id, s.name, s.uuid)}
							value={s.id}
							selected={selectedSensors.findIndex(c => c.id === s.id) > -1 ? true : false}
						>
							<ListItemText primary={s.name} />
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

	)
}




export default AssignSensorsDialog