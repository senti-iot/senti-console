/* eslint-disable no-unused-vars */
import React, { useState, Fragment } from 'react'
import { Dialog, AppBar, Toolbar, Typography, Button, List, ListItem, ListItemText, Divider, withStyles, Hidden, IconButton } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { Grid, Paper } from '@material-ui/core'
import { GridContainer, ItemGrid, TextF, ItemG, DSelect, SlideT } from 'components'
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import AssignOrgDialog from 'components/AssignComponents/AssignOrgDialog';
import { useLocalization } from 'hooks'
/**
* @augments {Component<{	t:Function.isRequired,	collection:object.isRequired,	handleChangeDevice:Function.isRequired,	handleCloseDevice:Function.isRequired,	handleOpenDevice:Function.isRequired,	open:boolean.isRequired,	devices:array.isRequired,	device:object.isRequired,	handleCreate:Function.isRequired,	handleChange:Function.isRequired,>}
*/

// @Andrei
const CreateRegistryForm = props => {
	const t = useLocalization()
	const [filters, setFilters] = useState({ keyword: '' })
	const [openOrg, setOpenOrg] = useState(false)
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		filters: {
	// 			keyword: ''
	// 		},
	// 		openOrg: false
	// 	}
	// }

	const handleFilterKeyword = value => {
		setFilters({ ...filters, keyword: value })
		// this.setState({
		// 	filters: {
		// 		keyword: value
		// 	}
		// })
	}
	const renderSelectDevice = () => {
		const { openDevice, handleCloseDevice, devices, handleChangeDevice, classes } = props
		// const { filters } = this.state
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={openDevice}
			onClose={handleCloseDevice}
			TransitionComponent={SlideT}>
			<AppBar className={classes.appBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={handleCloseDevice} aria-label='Close'>
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
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={4} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={handleCloseDevice} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('devices.pageTitle')}
								</Typography>
							</ItemG>
							<ItemG xs={8} container alignItems={'center'} justify={'center'}>
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
			<List>
				{devices ? filterItems(devices, filters).map((o, i) => {
					return <Fragment key={i}>
						<ListItem button onClick={handleChangeDevice(o)}>
							<ListItemText primary={o.name} />
						</ListItem>
						<Divider />
					</Fragment>
				}) : null}
			</List>
		</Dialog>
	}
	const renderProtocol = () => {
		const { registry, handleChange } = props
		return <DSelect
			margin={'normal'}
			label={t('registries.fields.protocol')}
			value={registry.protocol}
			onChange={handleChange('protocol')}
			menuItems={[
				{ value: 0, label: t('registries.fields.protocols.none') },
				{ value: 1, label: t('registries.fields.protocols.mqtt') },
				{ value: 2, label: t('registries.fields.protocols.http') },
				{ value: 3, label: `${t('registries.fields.protocols.mqtt')} & ${t('registries.fields.protocols.http')}` }
			]}
		/>
	}
	const renderRegion = () => {
		const { registry, handleChange } = props
		return <DSelect
			margin={'normal'}
			label={t('registries.fields.region')}
			value={registry.region}
			onChange={handleChange('region')}
			menuItems={[
				{ value: 'europe', label: t('registries.fields.regions.europe') },
				// { value: 1, label: t('registries.fields.protocols.mqtt') },
				// { value: 2, label: t('registries.fields.protocols.http') },
				// { value: 3, label: `${t('registries.fields.protocols.mqtt')} && ${t('registries.fields.protocols.http')}` }
			]}
		/>
	}
	const renderSelectState = () => {
		const { collection, handleChange } = props
		return <DSelect
			margin={'normal'}
			label={t('collections.fields.status')}
			value={collection.state}
			onChange={handleChange('state')}
			menuItems={[
				{ value: 1, label: t('collections.fields.state.active') },
				{ value: 2, label: t('collections.fields.state.inactive') }
			]}
		/>
	}

	const { org, handleOrgChange, handleChange, registry, classes, handleCreate, goToRegistries } = props
	return (
		<GridContainer>
			<Paper className={classes.paper}>
				<form className={classes.form}>
					<Grid container>
						<ItemGrid xs={12}>
							<TextF
								id={'registryName'}
								label={t('collections.fields.name')}
								onChange={handleChange('name')}
								value={registry.name}
								autoFocus
							/>
						</ItemGrid>

						<ItemGrid xs={12}>
							{renderRegion()}
						</ItemGrid>
						<ItemGrid xs={12}>
							{renderProtocol()}
						</ItemGrid>
						<ItemGrid xs={12}>
							<TextF
								value={org.name}
								onClick={() => setOpenOrg(true)}
								readonly
							/>
							<AssignOrgDialog
								t={t}
								open={openOrg}
								handleClose={() => setOpenOrg(false)}
								callBack={org => { setOpenOrg(false); handleOrgChange(org) }}
							/>
						</ItemGrid>

						<ItemGrid container style={{ margin: 16 }}>
							<div className={classes.wrapper}>
								<Button
									variant='outlined'
									onClick={goToRegistries}
									className={classes.redButton}
								>
									{t('actions.cancel')}
								</Button>
							</div>
							<div className={classes.wrapper}>
								<Button onClick={handleCreate} variant={'outlined'} color={'primary'}>
									{t('actions.save')}
								</Button>
							</div>
						</ItemGrid>
					</Grid>
				</form>
			</Paper>
		</GridContainer>
	)
}


export default withStyles(createprojectStyles)(CreateRegistryForm)