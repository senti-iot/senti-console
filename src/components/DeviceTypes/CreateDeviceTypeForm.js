import React, { Fragment, useState } from 'react'
import { Dialog, AppBar, Toolbar, Typography, Button, List, ListItem, ListItemText, Divider, withStyles, Hidden, IconButton, InputAdornment, Tooltip } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { GridContainer, ItemGrid, TextF, ItemG, InfoCard, /* DSelect, */ T, SlideT } from 'components'
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import AssignOrgDialog from 'components/AssignComponents/AssignOrgDialog';
import { useLocalization } from 'hooks'

const CreateDeviceTypeForm = props => {
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

	const renderMetadata = () => {
		const { sensorMetadata, handleRemoveMtdKey, handleAddMetadataKey, handleChangeMetadata, handleChangeMetadataKey,
			handleChangeKey, handleOpenFunc, /*  handleChangeType, */ cfunctions, classes, handleRemoveKey, handleRemoveFunction,
			handleAddKey } = props

		return <Fragment>
			<T variant={'subtitle1'}>{t('sensors.fields.metadata')}</T>
			{sensorMetadata.metadata.map((m, i) => {
				console.log(m)
				return <ItemGrid xs={12} container key={i} alignItems={'center'}>
					<TextF
						id={'metadata-key' + i}
						label={t('cloudfunctions.fields.metadata.key')}
						onChange={handleChangeMetadataKey(i)}
						value={m.key}
						readOnly
						InputProps={{
							style: { marginRight: 8 }
						}}
					/>
					<TextF
						id={'metadata-value' + i}
						label={t('cloudfunctions.fields.metadata.value')}
						onChange={handleChangeMetadata(i)}
						value={m.value}
						readOnly
						InputProps={{
							style: { marginRight: 8 }
						}}
					/>
					<Tooltip title={t('tooltips.devices.removeDataField')}>
						<IconButton
							style={{ marginTop: 6 }}
							onClick={handleRemoveMtdKey(i)}						>
							<Close />
						</IconButton>
					</Tooltip>
				</ItemGrid>
			})}
			<ItemGrid xs={12}>
				<Button variant={'outlined'} onClick={handleAddMetadataKey} color={'primary'}>{t('actions.addMtdKey')}</Button>
			</ItemGrid>
			<T variant={'subtitle1'}>{t('sidebar.cloudfunctions')}</T>
			{sensorMetadata.outbound.map((p, i) => {
				return <ItemGrid xs={12} container key={i + 'outbound'} alignItems={'center'}>
					<TextF
						id={'outbound-key' + i}
						label={t('cloudfunctions.fields.key')}
						onChange={handleChangeKey(p, i)}
						value={p.key}
						readOnly
						InputProps={{
							style: { marginRight: 8 }
						}}
					/>
					<TextF
						id={'outbound-value' + i}
						label={t('sidebar.cloudfunction')}
						value={cfunctions.findIndex(f => f.id === p.nId) > 0 ? cfunctions[cfunctions.findIndex(f => f.id === p.nId)].name : t('no.cloudfunction')}
						readOnly
						onClick={handleOpenFunc(i, 'outbound')}
						onChange={() => { }}
						InputProps={{
							endAdornment: <InputAdornment classes={{ root: classes.IconEndAd }}>
								<Tooltip title={t('tooltips.devices.removeCloudFunction')}>
									<IconButton
										className={classes.smallAction}
										onClick={e => { e.stopPropagation(); handleRemoveFunction(i)() }}
									>
										<Close />
									</IconButton>
								</Tooltip>
							</InputAdornment>,
							style: { marginRight: 8 }
						}}
					/>
					{/* 			<DSelect
						onChange={handleChangeType(i)}
						value={p.type}
						menuItems={[
							{ value: 0, label: t('cloudfunctions.datatypes.timeSeries') },
							{ value: 1, label: t('cloudfunctions.datatypes.average') }
						]}
					/> */}
					<Tooltip title={t('tooltips.devices.removeDataField')}>

						<IconButton
							// className={classes.smallAction}
							style={{ marginTop: 6 }}
							onClick={handleRemoveKey(i)}
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
	const renderMetadataInbound = () => {
		const { sensorMetadata, cfunctions, handleAddInboundFunction, handleOpenFunc, handleRemoveInboundFunction, classes } = props
		return <Fragment>
			{sensorMetadata.inbound.map((p, i) => {
				return <ItemGrid key={i + "inbound"} xs={12} container alignItems={'center'}>
					<TextF
						id={'inbound-function' + i}
						label={t("cloudfunctions.fields.inboundfunc")}
						onClick={handleOpenFunc(i, 'inbound')}
						value={cfunctions.findIndex(f => f.id === p.nId) > 0 ? cfunctions[cfunctions.findIndex(f => f.id === p.nId)].name : t('no.cloudfunction')}
						readOnly
						InputProps={{
							endAdornment: <InputAdornment classes={{ root: classes.IconEndAd }}>
								<Tooltip title={t('tooltips.devices.removeCloudFunction')}>
									<IconButton
										className={classes.smallAction}
										onClick={e => { e.stopPropagation(); handleRemoveInboundFunction(i)() }}
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

	// eslint-disable-next-line no-unused-vars
	const renderSelectOrg = () => {
		const { openOrg, handleCloseOrg, orgs, handleChangeOrg, classes } = props
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
									handleFilterKeyword={handleFilterKeyword}
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
									handleFilterKeyword={handleFilterKeyword}
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
	const renderSelectFunction = () => {
		const { openCF, handleCloseFunc, cfunctions, handleChangeFunc, classes } = props
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={openCF.open}
			onClose={handleCloseFunc}
			TransitionComponent={SlideT}>
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
									handleFilterKeyword={handleFilterKeyword}
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
									handleFilterKeyword={handleFilterKeyword}
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

	render() {
		const { t, handleChange, org, handleOrgChange, deviceType, classes, handleCreate, goToDeviceTypes } = this.props
		return (
			<GridContainer>
				<ItemGrid xs={12}>
					<InfoCard
						noHeader
						noExpand
						content={<ItemG>
							{this.renderSelectFunction()}
							<ItemGrid xs={12}>
								<TextF
									id={'deviceTypeName'}
									label={t('collections.fields.name')}
									onChange={handleChange('name')}
									value={deviceType.name}
								// autoFocus
								/>
							</ItemGrid>
							<Divider style={{ margin: "16px" }} />
							{this.renderMetadata()}
							<Divider style={{ margin: "16px" }} />
							{this.renderMetadataInbound()}
							<Divider style={{ margin: "16px" }} />
							<ItemGrid xs={12}>
								<TextF
									id={'org'}
									value={org.name}
									onClick={() => this.setState({ openOrg: true })}
									readonly
								/>
								<AssignOrgDialog
									t={t}
									open={this.state.openOrg}
									handleClose={() => this.setState({ openOrg: false })}
									callBack={org => { this.setState({ openOrg: false }); handleOrgChange(org) }}
								/>
							</ItemGrid>
							<Divider style={{ margin: "16px" }} />
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
						</ItemG>}
					/>
				</ItemGrid>

			</GridContainer>
		)
	}


	export default withStyles(createprojectStyles)(CreateDeviceTypeForm)