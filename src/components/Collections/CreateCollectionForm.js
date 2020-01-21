import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Dialog, AppBar, Toolbar, Typography, Button, List, ListItem, ListItemText, Divider, withStyles, Hidden, IconButton } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { Grid, Paper } from '@material-ui/core'
import { GridContainer, ItemGrid, TextF, ItemG, DSelect, SlideT } from 'components'
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
/**
* @augments {Component<{	t:Function.isRequired,	collection:object.isRequired,	handleChangeDevice:Function.isRequired,	handleCloseDevice:Function.isRequired,	handleOpenDevice:Function.isRequired,	open:boolean.isRequired,	devices:array.isRequired,	device:object.isRequired,	handleCreate:Function.isRequired,	handleChange:Function.isRequired,>}
*/
class CreateCollectionForm extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filters: {
				keyword: ''
			}
		}
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
	renderSelectState = () => {
		const { t, collection, handleChange } = this.props
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
			TransitionComponent={SlideT}>
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
		const { t, handleChange, collection, classes, handleOpenDevice, handleOpenOrg, handleCreate, device, org, goToCollection } = this.props
		return (
			<GridContainer>
				<Paper className={classes.paper}>
					<form className={classes.form}>
						<Grid container>
							<ItemGrid xs={12}>
								<TextF
									id={'collectionName'}
									label={t('collections.fields.name')}
									onChange={handleChange('name')}
									value={collection.name}
									autoFocus

								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<TextF
									id={'collectionDescription'}
									label={t('collections.fields.description')}
									onChange={handleChange('description')}
									value={collection.description}
									multiline
									rows={3}

								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								{this.renderSelectOrg()}
								<TextF
									id={'collectionOrg'}
									label={t('collections.fields.org')}
									value={org.name}
									onClick={handleOpenOrg}
									onChange={() => { }}
									InputProps={{
										onChange: handleOpenOrg,
										readOnly: true
									}}
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								{this.renderSelectDevice()}
								<TextF
									id={'collectionDevice'}
									label={t('collections.fields.activeDevice')}
									helperText={t('collections.helper.availableDevicesForOrg')}
									value={device.name}
									onClick={handleOpenDevice}
									onChange={() => { }}
									InputProps={{
										onChange: handleOpenDevice,
										readOnly: true
									}}
								/>
							</ItemGrid>

							<ItemGrid xs={12}>
								{this.renderSelectState()}
							</ItemGrid>
							<ItemGrid container /* style={{ margin: 16 }} */>
								<div className={classes.wrapper}>
									<Button
										variant='outlined'
										onClick={goToCollection}
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

CreateCollectionForm.propTypes = {
	t: PropTypes.func.isRequired,
	collection: PropTypes.object.isRequired,
	handleChangeDevice: PropTypes.func.isRequired,
	handleCloseDevice: PropTypes.func.isRequired,
	handleOpenDevice: PropTypes.func.isRequired,
	openDevice: PropTypes.bool.isRequired,
	devices: PropTypes.array,
	device: PropTypes.object.isRequired,
	handleCreate: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
}
export default withStyles(createprojectStyles)(CreateCollectionForm)