import React, { Component, Fragment } from 'react'
import { Dialog, AppBar, Toolbar, Typography, Button, List, ListItem, ListItemText, Divider, withStyles, Slide, Hidden, IconButton, InputAdornment, Tooltip } from '@material-ui/core';
import { Close, CheckCircle, Block } from 'variables/icons';
import cx from 'classnames'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
// import { Grid, Paper } from '@material-ui/core'
import { GridContainer, ItemGrid, TextF, ItemG, DSelect, InfoCard } from 'components'
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import OpenStreetMap from 'components/Map/OpenStreetMap';
import Info from 'components/Typography/Info';

/**
* @augments {Component<{	t:Function.isRequired,	collection:object.isRequired,	handleChangeDevice:Function.isRequired,	handleCloseDevice:Function.isRequired,	handleOpenDevice:Function.isRequired,	open:boolean.isRequired,	devices:array.isRequired,	device:object.isRequired,	handleCreate:Function.isRequired,	handleChange:Function.isRequired,>}
*/
class CreateSensorForm extends Component {
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
	ProtocolTypes = () => {
		const { t } = this.props
		return [
			{ value: 0, label: t('sensors.fields.protocols.none') },
			{ value: 1, label: t('sensors.fields.protocols.mqtt') },
			{ value: 2, label: t('sensors.fields.protocols.http') },
			{ value: 3, label: `${t('sensors.fields.protocols.mqtt')} & ${t('sensors.fields.protocols.http')}` }
		]
	}

	CommunicationTypes = () => {
		const { t, classes } = this.props
		return [
			{ value: 0, icon: <Block className={classes.blocked} />, label: t('sensors.fields.communications.blocked') },
			{ value: 1, icon: <CheckCircle className={classes.allowed} />, label: t('sensors.fields.communications.allowed') }
		]
	}
	LocationTypes = () => {
		const { t } = this.props
		return [
			{ id: 1, label: t('devices.locationTypes.pedStreet') },
			{ id: 2, label: t('devices.locationTypes.park') },
			{ id: 3, label: t('devices.locationTypes.path') },
			{ id: 4, label: t('devices.locationTypes.square') },
			{ id: 5, label: t('devices.locationTypes.crossroads') },
			{ id: 6, label: t('devices.locationTypes.road') },
			{ id: 7, label: t('devices.locationTypes.motorway') },
			{ id: 8, label: t('devices.locationTypes.port') },
			{ id: 9, label: t('devices.locationTypes.office') },
			{ id: 0, label: t('devices.locationTypes.unspecified') }]
	}
	renderSelectType = () => {
		const { t, openDT, handleCloseDT, deviceTypes, handleChangeDT, classes } = this.props
		const { filters } = this.state
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={openDT}
			onClose={handleCloseDT}
			TransitionComponent={this.transition}>
			<AppBar className={classes.appBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={handleCloseDT} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('deviceTypes.pageTitle')}
								</Typography>
							</ItemG>
							<ItemG xs={8}>
								<Search
									fullWidth
									open={true}
									focusOnMount
									suggestions={deviceTypes ? suggestionGen(deviceTypes) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={4} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={handleCloseDT} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('deviceTypes.pageTitle')}
								</Typography>
							</ItemG>
							<ItemG xs={8} container alignItems={'center'} justify={'center'}>
								<Search
									noAbsolute
									fullWidth
									open={true}
									focusOnMount
									suggestions={deviceTypes ? suggestionGen(deviceTypes) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{deviceTypes ? filterItems(deviceTypes, filters).map((o, i) => {
					return <Fragment key={i}>
						<ListItem button onClick={handleChangeDT(o)}>
							<ListItemText primary={o.name} />
						</ListItem>
						<Divider />
					</Fragment>
				}) : null}
			</List>
		</Dialog>
	}
	renderSelectReg = () => {
		const { t, openReg, handleCloseReg, registries, handleChangeReg, classes } = this.props
		const { filters } = this.state
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={openReg}
			onClose={handleCloseReg}
			TransitionComponent={this.transition}>
			<AppBar className={classes.appBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={handleCloseReg} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('registries.pageTitle')}
								</Typography>
							</ItemG>
							<ItemG xs={8}>
								<Search
									fullWidth
									open={true}
									focusOnMount
									suggestions={registries ? suggestionGen(registries) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={4} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={handleCloseReg} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('registries.pageTitle')}
								</Typography>
							</ItemG>
							<ItemG xs={8} container alignItems={'center'} justify={'center'}>
								<Search
									noAbsolute
									fullWidth
									open={true}
									focusOnMount
									suggestions={registries ? suggestionGen(registries) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{registries ? filterItems(registries, filters).map((o, i) => {
					return <Fragment key={i}>
						<ListItem button onClick={handleChangeReg(o)}>
							<ListItemText primary={o.name} />
						</ListItem>
						<Divider />
					</Fragment>
				}) : null}
			</List>
		</Dialog>
	}

	renderSelectFunction = () => { 
		const { t, openCF, handleCloseFunc, cfunctions, handleChangeFunc, classes } = this.props
		const { filters } = this.state
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={openCF.open}
			onClose={handleCloseFunc}
			TransitionComponent={this.transition}>
			<AppBar className={classes.appBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={handleCloseFunc} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('sidebar.cloudfunctions')}
								</Typography>
							</ItemG>
							<ItemG xs={8}>
								<Search
									fullWidth
									open={true}
									focusOnMount
									suggestions={cfunctions ? suggestionGen(cfunctions) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={4} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={handleCloseFunc} aria-label='Close'>
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
									suggestions={cfunctions ? suggestionGen(cfunctions) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{cfunctions ? filterItems(cfunctions, filters).map((o, i) => {
					return <Fragment key={i}>
						<ListItem button onClick={handleChangeFunc(o, openCF.where)}>
							<ListItemText primary={o.name} />
						</ListItem>
						<Divider />
					</Fragment>
				}) : null}
			</List>
		</Dialog>
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
	renderMetadata = () => {
		const { sensorMetadata, t, handleOpenFunc, cfunctions, classes, handleRemoveKey, handleRemoveFunction, handleAddKey } = this.props
		return <Fragment>
			{sensorMetadata.outbound.map((p, i) => {
				return <ItemGrid xs={12} container key={i} alignItems={'center'}>
					<TextF
						label={t('cloudfunctions.fields.key')}
						value={p.key}
						readOnly
						InputProps={{
							style: { marginRight: 8 }
						}}
					/>
					<TextF
						label={t('sidebar.cloudfunction')}
						value={cfunctions.findIndex(f => f.id === p.nId) > 0 ? cfunctions[cfunctions.findIndex(f => f.id === p.nId)].name : t('no.cloudfunction')}
						readOnly
						handleClick={handleOpenFunc(p, 'outbound')}
						handleChange={() => { }}
						InputProps={{
							endAdornment: <InputAdornment classes={{ root: classes.IconEndAd }}>
								<Tooltip title={t('tooltips.devices.removeCloudFunction')}>
									<IconButton
										className={classes.smallAction}
										onClick={e => { e.stopPropagation(); handleRemoveFunction(p)() }}
									>
										<Close />
									</IconButton>
								</Tooltip>
							</InputAdornment>
						}}
					/>
					<Tooltip title={t('tooltips.devices.removeDataField')}>

						<IconButton
						// className={classes.smallAction}
							style={{ marginTop: 6 }}
							onClick={handleRemoveKey(p)}
						>
							<Close />
						</IconButton>
					</Tooltip>
				</ItemGrid>

			})}
			<ItemGrid xs={12}>
				<Button variant={'outlined'} onClick={handleAddKey} color={'primary'}>{t('actions.addKey')}</Button>
			</ItemGrid>
		</Fragment>
	}
	renderMetadataInbound = () => { 
		const { sensorMetadata, cfunctions, t, handleAddInboundFunction, handleOpenFunc, handleRemoveInboundFunction, classes } = this.props
		return <Fragment>
			{sensorMetadata.inbound.map(p => {
				console.log('P', p)
				return <ItemGrid xs={12} container alignItems={'center'}>
					<TextF
						label={t("cloudfunctions.fields.inboundfunc")}
						handleClick={handleOpenFunc(p, 'inbound')}
						value={cfunctions.findIndex(f => f.id === p.nId) > 0 ? cfunctions[cfunctions.findIndex(f => f.id === p.nId)].name : t('no.cloudfunction')}
						readOnly
						InputProps={{	
							endAdornment: <InputAdornment classes={{ root: classes.IconEndAd }}>
								<Tooltip title={t('tooltips.devices.removeCloudFunction')}>
									<IconButton
										className={classes.smallAction}
										onClick={e => { e.stopPropagation(); handleRemoveInboundFunction(p)() }}
									>
										<Close />
									</IconButton>
								</Tooltip>
							</InputAdornment>
						}}
					/>
				</ItemGrid>
			})}
			<ItemGrid xs={12}>
				<Button variant={'outlined'} onClick={handleAddInboundFunction} color={'primary'}>{t('actions.addInboundFunc')}</Button>
			</ItemGrid>
			
		</Fragment> 

	}

	render() {
		const { t, handleOpenReg, handleOpenDT,
			handleChange, sensor, getLatLngFromMap,
			classes, handleCreate, goToRegistries, select } = this.props
		console.log(sensor)
		return (
			<GridContainer>
				<ItemGrid xs={12}>
					{/* `normalize`, description, lat, lng, address, locType, available, communication, tags, logging*/}
					<InfoCard
						title={t('devices.fields.description')}
						noExpand
						noHeader
						content={
							<ItemG>
								{this.renderSelectFunction()}
								<ItemGrid xs={12}>
									<TextF
										id={'sensorName'}
										label={t('devices.fields.name')}
										handleChange={handleChange('name')}
										value={sensor.name}
										autoFocus
									/>

								</ItemGrid>
								<ItemGrid xs={12}>
									<TextF
										id={'sensorDescription'}
										label={t('devices.fields.description')}
										handleChange={handleChange('description')}
										value={sensor.description}
										multiline
										rows={3}
									/>
								</ItemGrid>
								<ItemGrid xs={12}>
									{this.renderSelectReg()}
									<TextF
										id={'regID'}
										label={t('sensors.fields.registry')}
										value={select.reg.name}
										readOnly
										handleClick={handleOpenReg}
										handleChange={() => { }}
										InputProps={{
											onChange: handleOpenReg,
											readOnly: true
										}}
									/>
								</ItemGrid>
								<Divider style={{ margin: "16px" }} />
								<ItemGrid xs={12}>
									{this.renderSelectType()}
									<TextF
										id={'regID'}
										label={t('sensors.fields.deviceType')}
										value={select.dt.name}
										readOnly
										handleClick={handleOpenDT}
										handleChange={() => { }}
										InputProps={{
											onChange: handleOpenDT,
											readOnly: true
										}}
									/>
								</ItemGrid>
								{this.renderMetadata()}
								<Divider style={{ margin: "16px" }} />
								{this.renderMetadataInbound()}
								<Divider style={{ margin: "16px" }} />
								<ItemGrid xs={12}>
									{/* <ItemG xs={12}> */}
									<div style={{ height: 400 }}>
										<OpenStreetMap
											mapTheme={this.props.mapTheme}
											calibrate
											height={400}
											width={400}
											markers={[{ lat: sensor.lat ?  sensor.lat : 56, long: sensor.lng ? sensor.lng : 9 }]}
											getLatLng={getLatLngFromMap}
										/>
									</div>
									{/* </ItemG> */}
								</ItemGrid>
								<ItemGrid xs={12}>
									<Info>
										{`${sensor.lat} ${sensor.lng}`}
									</Info>
									<TextF
										id={'sensorName'}
										label={t('devices.fields.address')}
										handleChange={handleChange('address')}
										value={sensor.address}
									/>
								</ItemGrid>
								<Divider style={{ margin: "16px" }} />
								<ItemGrid xs={12}>
									<DSelect
										label={t('devices.fields.locType')}
										value={sensor.locType}
										onChange={handleChange('locType')}
										menuItems={this.LocationTypes().map(m => ({
											value: m.id,
											label: m.label
										}))}
									/>
								</ItemGrid>
								<ItemGrid xs={12}>
									<DSelect
										label={t('sensors.fields.communication')}
										handleChange={handleChange('communication')}
										value={sensor.communication}
										menuItems={this.CommunicationTypes()}
									/>
								</ItemGrid>
								<ItemGrid container>
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
							</ItemG>
						}
					/>
				</ItemGrid>
			</GridContainer>

		)
	}
}


export default withStyles(createprojectStyles)(CreateSensorForm)