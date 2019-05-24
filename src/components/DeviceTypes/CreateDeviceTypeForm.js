import React, { Component, Fragment } from 'react'
import { Dialog, AppBar, Toolbar, Typography, Button, List, ListItem, ListItemText, Divider, withStyles, Slide, Hidden, IconButton } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { Grid, Paper } from '@material-ui/core'
import { GridContainer, ItemGrid, TextF, ItemG, DSelect, /* DSelect */ } from 'components'
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
/**
* @augments {Component<{	t:Function.isRequired,	collection:object.isRequired,	handleChangeDevice:Function.isRequired,	handleCloseDevice:Function.isRequired,	handleOpenDevice:Function.isRequired,	open:boolean.isRequired,	devices:array.isRequired,	device:object.isRequired,	handleCreate:Function.isRequired,	handleChange:Function.isRequired,>}
*/
class CreateDeviceTypeForm extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filters: {
				keyword: ''
			}
		}
	}

	transition = (props) => {
		return <Slide direction='up' {...props} />;
	}
	handleFilterKeyword = value => {
		this.setState({
			filters: {
				keyword: value
			}
		})
	}
	renderSelectDevice = () => {
		const { t, openDevice, handleCloseDevice, devices, handleChangeDevice, classes } = this.props
		const { filters } = this.state
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={openDevice}
			onClose={handleCloseDevice}
			TransitionComponent={this.transition}>
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
									handleFilterKeyword={this.handleFilterKeyword}
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
									handleFilterKeyword={this.handleFilterKeyword}
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
	// renderProtocol = () => {
	// 	const { t, deviceType, handleChange } = this.props
	// 	return <DSelect
	// 		margin={'normal'}
	// 		label={t('registries.protocol')}
	// 		value={deviceType.protocol}
	// 		onChange={handleChange('protocol')}
	// 		menuItems={[
	// 			{ value: 0, label: t('registries.fields.protocols.none') },
	// 			{ value: 1, label: t('registries.fields.protocols.mqtt') },
	// 			{ value: 2, label: t('registries.fields.protocols.http') },
	// 			{ value: 3, label: `${t('registries.fields.protocols.mqtt')} && ${t('registries.fields.protocols.http')}` } 
	// 		]}
	// 	/>
	// }
	// renderRegion = () => {
	// 	const { t, deviceType, handleChange } = this.props
	// 	return <DSelect
	// 		margin={'normal'}
	// 		label={t('registries.region')}
	// 		value={deviceType.region}
	// 		onChange={handleChange('region')}
	// 		menuItems={[
	// 			{ value: 'europe', label: t('registries.fields.regions.europe') },
	// 			// { value: 1, label: t('registries.fields.protocols.mqtt') },
	// 			// { value: 2, label: t('registries.fields.protocols.http') },
	// 			// { value: 3, label: `${t('registries.fields.protocols.mqtt')} && ${t('registries.fields.protocols.http')}` } 
	// 		]}
	// 	/>
	// }
	// renderSelectState = () => {
	// 	const { t, collection, handleChange } = this.props
	// 	return <DSelect
	// 		margin={'normal'}
	// 		label={t('collections.fields.status')}
	// 		value={collection.state}
	// 		onChange={handleChange('state')}
	// 		menuItems={[
	// 			{ value: 1, label: t('collections.fields.state.active') },
	// 			{ value: 2, label: t('collections.fields.state.inactive') }
	// 		]}
	// 	/>
	// }
	renderStructure = () => {
		const { deviceType, t, handleAddKeyToStructure, keyName, value, handleStrChange } = this.props
		return <ItemG container>
			<ItemG xs={12} container>
				<TextF value={keyName} handleChange={handleStrChange('keyName')} InputProps={{ style: { marginRight: 8 } }} label={t('devicetypes.fields.structure.key')} />
				<DSelect
					value={value}
					onChange={handleStrChange('value')}
					menuItems={[
						{ label: t('devicetypes.fields.structure.types.string'), value: 'string' },
						{ label: t('devicetypes.fields.structure.types.int'), value: 'int' },
						{ label: t('devicetypes.fields.structure.types.boolean'), value: 'boolean' },
						{ label: t('devicetypes.fields.structure.types.array'), value: 'array' }
					]}
					label={t('devicetypes.fields.structure.type')}
				/>
			</ItemG>
			<ItemG xs={12}>
				<Button variant={'outlined'} color={'primary'} onClick={handleAddKeyToStructure}>{t('devicetypes.actions.addKey')}</Button>
			</ItemG>
			<ItemG xs={12}>
				{deviceType.structure ? Object.keys(deviceType.structure).map((k, i) => {
					return <TextF label={k} readOnly value={deviceType.structure[k]} />
				}) : null}
			</ItemG>
		</ItemG>
	}
	renderSelectOrg = () => {
		const { t, openOrg, handleCloseOrg, orgs, handleChangeOrg, classes } = this.props
		const { filters } = this.state
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={openOrg}
			onClose={handleCloseOrg}
			TransitionComponent={this.transition}>
			<AppBar className={classes.appBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={handleCloseOrg} aria-label='Close'>
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
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={4} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={handleCloseOrg} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('orgs.pageTitle')}
								</Typography>
							</ItemG>
							<ItemG xs={8} container alignItems={'center'} justify={'center'}>
								<Search
									noAbsolute
									fullWidth
									open={true}
									focusOnMount
									suggestions={orgs ? suggestionGen(orgs) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{orgs ? filterItems(orgs, filters).map((o, i) => {
					return <Fragment key={i}>
						<ListItem button onClick={handleChangeOrg(o)}>
							<ListItemText primary={o.name} />
						</ListItem>
						<Divider />
					</Fragment>
				}) : null}
			</List>
		</Dialog>
	}
	render() {
		const { t, handleChange, deviceType, classes, handleCreate, goToDeviceTypes } = this.props
		return (
			<GridContainer>
				<Paper className={classes.paper}>
					<form className={classes.form}>
						<Grid container>
							<ItemGrid xs={12}>
								<TextF
									id={'deviceTypeName'}
									label={t('collections.fields.name')}
									handleChange={handleChange('name')}
									value={deviceType.name}
									// autoFocus
								/>
							</ItemGrid>

							<ItemGrid xs={12}>
								{/* {this.renderRegion()} */}
								{this.renderStructure()}
							</ItemGrid>
							<ItemGrid xs={12}>
								{/* {this.renderProtocol()} */}
							</ItemGrid>


							<ItemGrid container>
								<div className={classes.wrapper}>
									<Button
										variant='outlined'
										onClick={goToDeviceTypes}
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
}


export default withStyles(createprojectStyles)(CreateDeviceTypeForm)