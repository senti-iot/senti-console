import React, { Component, Fragment } from 'react'
import { Dialog, AppBar, Toolbar, Typography, Button, List, ListItem, ListItemText, Divider, withStyles, Slide, Hidden, IconButton } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { Grid, Paper } from '@material-ui/core'
import { GridContainer, ItemGrid, TextF, ItemG, DSelect } from 'components'
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
	renderProtocol = () => {
		const { t, registry, handleChange } = this.props
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
	renderRegion = () => {
		const { t, registry, handleChange } = this.props
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
	render() {
		const { t, handleChange, registry, classes, handleCreate, goToRegistries } = this.props
		return (
			<GridContainer>
				<Paper className={classes.paper}>
					<form className={classes.form}>
						<Grid container>
							<ItemGrid xs={12}>
								<TextF
									id={'registryName'}
									label={t('collections.fields.name')}
									handleChange={handleChange('name')}
									value={registry.name}
									autoFocus
								/>
							</ItemGrid>

							<ItemGrid xs={12}>
								{this.renderRegion()}
							</ItemGrid>
							<ItemGrid xs={12}>
								{this.renderProtocol()}
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
}


export default withStyles(createprojectStyles)(CreateCollectionForm)