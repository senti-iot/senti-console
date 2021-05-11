/* eslint-disable react-hooks/rules-of-hooks */
import { Grid, IconButton, Menu, MenuItem, Toolbar, Typography, Divider, /* Tooltip, DialogContent, Dialog, DialogTitle, DialogActions */ } from '@material-ui/core'
import { /*  HelpOutlineIcon, */ MoreVert as MoreVertIcon } from 'variables/icons'
import { boxShadow } from 'assets/jss/material-dashboard-react'
import toolbarStyles from 'assets/jss/material-dashboard-react/tableToolBarStyle'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { ItemGrid, /* T */ } from 'components'
import { ItemG } from 'components/index'
import FilterToolbar from './FilterToolbar'
// import { useLocalization } from 'hooks'
// import deviceAdeviceB from 'assets/img/help/deviceAORdeviceB.png'

let selectedRender = props => {
	const { numSelected, t } = props
	const [anchor, setAnchor] = useState(null)
	return <Grid container justify={'space-between'} alignItems={'center'}>
		<ItemGrid>
			<Typography variant='subtitle1'>
				{numSelected + ' ' + t('tables.selected')}
			</Typography>
		</ItemGrid>
		<ItemGrid>
			<IconButton
				aria-label={t('menus.more')}
				aria-owns={anchor ? 'long-menu' : null}
				aria-haspopup='true'
				onClick={e => setAnchor(e.target)}>
				<MoreVertIcon />
			</IconButton>
			<Menu
				disableEnforceFocus
				id='long-menu'
				anchorEl={anchor}
				disablePortal
				open={Boolean(anchor)}
				onClose={e => setAnchor(null)}
				PaperProps={{ style: { boxShadow: boxShadow } }}
			>
				{props.options().map((option, i) => {
					if (option.dontShow)
						return null
					if (option.isDivider)
						return <Divider style={{ margin: "3px 1px" }} key={i} />
					if (option.single)
						return numSelected === 1 ? <MenuItem disabled={option.disabled} key={i} onClick={() => { option.func(); setAnchor(null) }}>
							<option.icon className={props.classes.leftIcon} />{option.label}
						</MenuItem> : null
					else {
						return <MenuItem disabled={option.disabled} key={i} onClick={() => { option.func(); setAnchor(null) }}>
							<option.icon className={props.classes.leftIcon} />{option.label}
						</MenuItem>
					}
				}
				)}
			</Menu>
		</ItemGrid>
	</Grid>
}
let defaultRender = props => {
	//Hooks
	// const t = useLocalization()

	//Redux

	//State
	// const [openHelpDialog, setOpenHelpDialog] = useState(true)

	//Const

	//useCallbacks

	//useEffects

	//Handlers

	// const renderHelpDialog = () => {
	// 	return <Dialog
	// 		style={{ minWidth: '70vw' }}
	// 		open={openHelpDialog}
	// 		onClose={() => setOpenHelpDialog(false)}
	// 	>
	// 		<DialogTitle>
	// 			{t('dialogs.filterToolbar.title')}
	// 		</DialogTitle>
	// 		<DialogContent>
	// 			<T variant={'h5'}>{t('dialogs.filterToolbar.titleFreeSearch')}</T>
	// 			<Divider />
	// 			<T>'Free search' or fast search can be used directly by typing the desired text to be searched in all the fields of the items in the list.</T>
	// 			<T variant={'h5'} style={{ marginTop: 8 }}>Search By field</T>
	// 			<Divider />
	// 			<T>'Search by field' is a more refined search compared to 'Free search' where you can select which field to be searched on.<br/>
	// 				By pressiong on the "Add Filter" button on the left side of the search toolbar, a dropdown with the searchable fields will be shown.<br />
	// 				Upon selecting a field a Filter Card will be shown asking for the desired text to be searched and the type of filter.<br />
	// 				By pressing the "Add Filter", the new filter will eb added and the items in the list will be updated with the results of the filter.
	// 			</T>
	// 			<T variant={'h5'} style={{ marginTop: 8 }}>AND / OR difference</T>
	// 			<Divider />
	// 			<T variant={'h6'}>AND</T>
	// 			<T>AND type filter is used to filter the current list of items and return the result.<br/>
	// 				Adding multiple "AND" type filters will filter the list in the order of filters, each time returning a new list.<br />
	// 				Use case: Refining a search where you want to see the list of all devices having a type of model, then refining to a more specific device.
	// 				Example: Having 2 filters for text "foo" and "bar", the list will be first filtered for items containing "foo", then the list will be filtered one more time for items containing "bar".<br />
	// 			</T>
	// 			<T variant={'h6'}>OR</T>
	// 			<T>OR type filter is used to filter the "previous" list of items filtered by an AND filter.<br />
	// 				Note: Having just an OR filter would return all items.
	// 				Use Case: Searching and displaying multiple specific devices.
	// 				Example: In the list you have 'DeviceA', 'DeviceB' and 'DeviceC' and you want to display only 'A' and 'B'. You would have to create 2 filters, first for 'DeviceA' as an AND filter and second for 'DeviceB' as an OR filter.
	// 				<img alt={"ExampleOR"} src={deviceAdeviceB}/>
	// 			</T>
	// 			<Divider />
	// 		</DialogContent>
	// 		<DialogActions>

	// 		</DialogActions>
	// 	</Dialog>
	// }
	const { content } = props
	return <ItemG style={{ width: '100%', flexWrap: 'nowrap' }} container alignItems={'center'}>
		{props.ft ? <FilterToolbar
			reduxKey={props.reduxKey}
			filters={props.ft}
			t={props.t}
		/> : null}
		{/* <Tooltip title={t()}>
			<IconButton onClick={() => setOpenHelpDialog(true)}>
				<HelpOutlineIcon />
			</IconButton>
		</Tooltip>
		{renderHelpDialog()} */}
		{content ? content : null}

	</ItemG>

}
let TableToolbar = props => {
	//Hooks
	const classes = toolbarStyles()
	//Redux

	//State

	//Const

	//useCallbacks

	//useEffects

	//Handlers

	const { numSelected } = props
	return (
		<Toolbar
			className={classNames(classes.root, {
				[classes.highlight]: numSelected > 0,
			})}>

			<ItemG container alignItems={'center'}>
				{numSelected > 0 ? (
					selectedRender(props)
				) :
					defaultRender(props)
				}
			</ItemG>

		</Toolbar>
	)
}


TableToolbar.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
}

export default withRouter(TableToolbar)