/* eslint-disable react-hooks/rules-of-hooks */
import { Grid, IconButton, Menu, MenuItem, Toolbar, Typography, Divider, Tooltip, DialogContent, Dialog, DialogTitle, DialogActions } from '@material-ui/core'
import {  HelpOutlineIcon, MoreVert as MoreVertIcon } from 'variables/icons'
import { boxShadow } from 'assets/jss/material-dashboard-react'
import toolbarStyles from 'assets/jss/material-dashboard-react/tableToolBarStyle'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { ItemGrid, T } from 'components'
import { ItemG } from 'components/index'
import FilterToolbar from './FilterToolbar'
import { useLocalization } from 'hooks'

//#region Images
import ANDANDdemo from 'assets/img/help/ANDANDdemo.png'
import ANDFreeSearch from 'assets/img/help/ANDFreeSearch.png'
import deviceAORdeviceB from 'assets/img/help/deviceAORdeviceB.png'
import FieldSearch from 'assets/img/help/FieldSearch.png'
import FieldSearchCard from 'assets/img/help/FieldSearchCard.png'
import FieldSearchCardFilledAND from 'assets/img/help/FieldSearchCardFilledAND.png'
import FieldSearchMenu from 'assets/img/help/FieldSearchMenu.png'
import FreeSearchInput from 'assets/img/help/FreeSearchInput.png'

//#endregion


let defaultRender = props => {

	//Hooks
	const t = useLocalization()

	//Redux

	//State
	const [openHelpDialog, setOpenHelpDialog] = useState(false)

	//Const

	//useCallbacks

	//useEffects

	//Handlers

	const renderHelpDialog = () => {

		return <Dialog
			style={{ width: '100%' }}
			maxWidth={'md'}
			fullWidth
			open={openHelpDialog}
			onClose={() => setOpenHelpDialog(false)}
		>
			<DialogTitle>
				{t('dialogs.filterToolbar.title')}
			</DialogTitle>
			<DialogContent>

				{/* Free Search */}
				<T variant={'h5'}>{t('help.filterToolbar.titles.freeSearch')}</T>
				<Divider style={{ margin: "8px 0px 16px 0px" }}/>
				<T>{t('help.filterToolbar.content.freeSearch1')}</T>
				<img src={FreeSearchInput} alt="" />
				<T>{t('help.filterToolbar.img.freeSearch1', { type: 'markdown' })}</T>
				<img src={ANDFreeSearch} alt='' />
				<T>{t('help.filterToolbar.img.freeSearch2', { type: 'markdown' })}</T>

				<Divider style={{ margin: "16px" }} />

 				{/* Filter Field */}
				<T variant="h5">{t('help.filterToolbar.titles.searchByField')}</T>
				<Divider style={{ margin: "8px 0px 16px 0px" }} />
				<T>{t('help.filterToolbar.content.filterSearch1')}</T>
				<T>{t('help.filterToolbar.content.filterSearch2')}</T>
				<img src={FieldSearchMenu} alt='' />
				<T>{t('help.filterToolbar.img.filterSearch1', { type: 'markdown' })}</T>
				<T>{t('help.filterToolbar.content.filterSearch3')}</T>
				<img src={FieldSearchCard} alt='' />
				<T>{t('help.filterToolbar.img.filterSearch2', { type: 'markdown' })}</T>
				<img src={FieldSearchCardFilledAND} alt='' />
				<T>{t('help.filterToolbar.img.filterSearch3', { type: 'markdown' })}</T>
				<T>{t('help.filterToolbar.content.filterSearch4')}</T>
				<img src={FieldSearch} alt='' />
				<T>{t('help.filterToolbar.img.filterSearch4', { type: 'markdown' })}</T>

				<Divider style={{ margin: "16px" }} />

				{/* AND / OR Filter Types */}
				<T variant="h5">{t('help.filterToolbar.titles.andOrFilters')}</T>
				<Divider style={{ margin: "8px 0px 16px 0px" }} />
				<T variant='h6'>{t('help.filterToolbar.subtitles.ANDfilter')}</T>
				<T>{t('help.filterToolbar.content.and1', { type: 'markdown' })}</T>
				<T>{t('help.filterToolbar.content.and2', { type: 'markdown' })}</T>
				<img src={ANDANDdemo} alt='' />
				<T>{t('help.filterToolbar.img.and1', { type: 'markdown' })}</T>

				<Divider style={{ margin: "16px" }} />

				<T variant='h6'>{t('help.filterToolbar.subtitles.ORfilter')}</T>
				<T>{t('help.filterToolbar.content.or1', { type: 'markdown' })}</T>
				<T>{t('help.filterToolbar.content.or2', { type: 'markdown' })}</T>
				<img src={deviceAORdeviceB} alt='' />
				<T>{t('help.filterToolbar.img.or1', { type: 'markdown' })}</T>
				<Divider style={{ margin: "16px" }} />

			</DialogContent>
			<DialogActions>

			</DialogActions>
		</Dialog>
	}
	const { content } = props
	return <ItemG style={{ width: '100%', flexWrap: 'nowrap' }} container alignItems={'center'}>
		{props.ft ? <FilterToolbar
			reduxKey={props.reduxKey}
			filters={props.ft}
			t={props.t}
		/> : null}
		<Tooltip title={t("dialogs.filterToolbar.title")}>
			<IconButton onClick={() => setOpenHelpDialog(true)}>
				<HelpOutlineIcon />
			</IconButton>
		</Tooltip>
		{renderHelpDialog()}
		{content ? content : null}

	</ItemG>

}
let TableToolbar = props => {
	//Hooks
	const classes = toolbarStyles()
	const t = useLocalization()

	//Redux

	//State
	const [anchor, setAnchor] = useState(null)

	//Const

	//useCallbacks

	//useEffects

	//Handlers

	const { numSelected } = props
	let selectedRender = () => {
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
								<option.icon className={classes.leftIcon} />{option.label}
							</MenuItem> : null
						else {
							return <MenuItem disabled={option.disabled} key={i} onClick={() => { option.func(); setAnchor(null) }}>
								<option.icon className={classes.leftIcon} />{option.label}
							</MenuItem>
						}
					}
					)}
				</Menu>
			</ItemGrid>
		</Grid>
	}
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