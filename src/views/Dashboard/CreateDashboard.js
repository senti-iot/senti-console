import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Paper, Dialog, AppBar, IconButton, withStyles, Toolbar, Button, Divider, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { ItemG, Dropdown, TextF, SlideT, T, Warning } from 'components';
import cx from 'classnames'
import { Close, Edit, Clear, Palette, Save, Menu } from 'variables/icons';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import { connect } from 'react-redux'

import GaugeSData from 'views/Charts/GaugeSData';
import DoubleChart from 'views/Charts/DoubleChart';
import ScorecardAB from 'views/Charts/ScorecardAB';
import WindCard from 'views/Charts/WindCard';
import Scorecard from 'views/Charts/Scorecard';
import { createDash, createGraph, editGraphPos, setGE, removeGE, editDash, generateID, saveDashboard, setLayout, resetCreateDash } from 'redux/dsSystem';
// import CreateDashboardToolbar from 'components/Toolbar/CreateDashboardToolbar';
import EditGraph from './EditGraph';
import { red } from '@material-ui/core/colors';
import ToolbarItem from './ToolbarItem';
import DropZone from './DropZone';
import { weekendColorsDropdown } from 'variables/functions';


const ResponsiveReactGridLayout = WidthProvider(Responsive);
class CreateDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			graphs: [],
			currentBreakpoint: "lg",
			compactType: 'vertical',
			openEditGraph: false,
			openToolbox: true,
			openSave: false,
			openClose: false
		};
		this.cols = { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 }
	}

	componentDidMount = () => {
		//temp
		// this.props.createDash()
	}
	componentWillUnmount() {
		this.props.resetCreateDash()
	}

	componentDidUpdate(prevProps, prevState) {
		if ((this.props.openAddDash !== prevProps.openAddDash) && this.props.openAddDash) {
			this.props.createDash()
		}
	}
	editGraphOpen = l => e => {
		this.props.setGE(l)
		this.setState({ openEditGraph: true })
	}
	removeGraph = l => e => {
		this.props.removeGE(l)
	}
	renderPos = (l) => {
		const { classes, t } = this.props
		return <div className={classes.editGraph}>
			<ItemG container justify={'center'} alignItems={'center'}>
				<ItemG xs={6} container justify={'flex-end'}>
					<Button style={{ width: 125, margin: 4 }} variant={'contained'} color={'primary'} onClick={this.editGraphOpen(l)}>
						<Edit style={{ marginRight: 8 }} />{t('actions.edit')}
					</Button>
				</ItemG>
				<ItemG xs={6}>
					<Button variant={'contained'} style={{ width: 125, margin: 4, background: red[600], color: '#fff' }} onClick={this.removeGraph(l)}>
						<Clear style={{ marginRight: 8 }} /> {t('actions.delete')}
					</Button>
				</ItemG>
				<ItemG xs={12} container justify={'center'} alignItems={'center'}>
					<div className={'dragHandle'} style={{ marginTop: 50 }}>
						<Button variant={'outlined'} disableRipple style={{ padding: "25px 50px", cursor: 'move' }}>
							{t('actions.move')}
						</Button>
					</div>
				</ItemG>
			</ItemG>

		</div>
	}
	typeChildren = (g, i) => {
		const { t } = this.props
		// const { d } = this.state
		let d = this.props.d
		switch (g.type) {
			case 1:
				return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={g.grid}>
					{this.renderPos(g.grid)}
					<GaugeSData
						create
						title={g.name}
						period={g.period}
						t={t}
						color={d.color}
						gId={g.id}
						dId={d.id}
						single
					/>
				</Paper>
			case 0:
				return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={g.grid}>
					{this.renderPos(g.grid)}
					<DoubleChart
						create
						title={g.name}
						gId={g.id}
						dId={d.id}
						color={d.color}
						single={true}
						t={t}
					/>
				</Paper>
			case 2:
				return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={g.grid}>
					{this.renderPos(g.grid)}
					<ScorecardAB
						create
						title={g.name}
						gId={g.id}
						dId={d.id}
						color={d.color}
						single={true}
						t={t}
					/>
				</Paper>
			case 3:
				return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={g.grid}>
					{this.renderPos(g.grid)}
					<Scorecard
						create
						title={g.name}
						gId={g.id}
						dId={d.id}
						color={d.color}
						single={true}
						t={t}
					/>
				</Paper>
			case 4:
				return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={g.grid}>
					{this.renderPos(g.grid)}
					<WindCard
						create
						title={g.name}
						gId={g.id}
						dId={d.id}
						color={d.color}
						single={true}
						t={t}
					/>
				</Paper>
			default:
				return null;
		}
	}
	generateDOM = () => {
		const gs = this.props.gs
		return gs.map((g, i) => this.typeChildren(g, i))
	}

	changeColor = (value) => {
		const { d } = this.props
		let newD = Object.assign({}, d)
		newD.color = value
		this.props.editDashboard(newD)
	}

	changeName = (e) => {
		const { d } = this.props
		let newD = Object.assign({}, d)
		newD.name = e.target.value
		newD.id = generateID(newD.name)
		this.props.editDashboard(newD)
	}
	changeDescription = e => {
		const { d } = this.props
		let newD = Object.assign({}, d)
		newD.description = e.target.value
		this.props.editDashboard(newD)
	}
	renderColorPicker = () => {
		const { t } = this.props
		return <Dropdown
			icon={<Palette style={{ color: "#FFF" }} />}
			menuItems={weekendColorsDropdown(t)}
			onChange={this.changeColor}
		/>
	}
	handleCloseEG = () => {
		this.props.setGE(null)
		this.setState({ openEditGraph: false })

	}
	onLayoutChange = (layout) => {
		this.props.setLayout(layout)
	}

	handleOpenConfirmClose = () => this.setState({ openClose: true })
	handleCloseConfirmClose = () => this.setState({ openClose: false })
	handleConfirmClose = () => {
		this.props.handleCloseDT()
		this.handleCloseConfirmClose()
	}
	renderConfirmClose = () => {
		const { t } = this.props
		const { openClose } = this.state
		return <Dialog
			open={openClose}
		>
			<DialogTitle>{t('dialogs.dashboards.close.title')}</DialogTitle>
			<DialogContent>
				<T style={{ marginBottom: 8 }}>{t('dialogs.dashboards.close.message')}</T>
				<Warning>{t('dialogs.dashboards.close.warning')}</Warning>
				{/* <DialogContentText>{`${t('dialogs.dashboards.close.message')} ${t('dialogs.dashboards.close.warning')}`}</DialogContentText> */}

			</DialogContent>
			<DialogActions>
				<Button variant={'outlined'} onClick={this.handleCloseConfirmClose}>
					{t('actions.no')}
				</Button>
				<Button variant={'outlined'} onClick={this.handleConfirmClose}>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>

	}

	handleOpenSave = () => this.setState({ openSave: true })
	handleCloseSave = () => this.setState({ openSave: false })

	renderSaveDialog = () => {
		const { openSave } = this.state
		const { t, d } = this.props
		return <Dialog
			open={openSave}
		>
			<DialogContent>
				<TextF
					fullWidth
					id={'dashboardNameSave'}
					// margin={'none'}
					label={t('dashboard.fields.name')}
					value={d.name}
					onChange={this.changeName}
					reversed
				// notched={false}
				/>
				<TextF
					fullWidth
					id={'dashboardDesc'}
					InputProps={{
						style: {
							color: '#fff'
						}
					}}
					multiline
					rows={4}
					label={t('dashboard.fields.description')}
					// margin={'none'}
					value={d.description}
					onChange={this.changeDescription}
					reversed
				// notched={false}
				/>
			</DialogContent>
			<DialogActions style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				{/* <Button variant={'outlined'} onClick={this.handleCloseSave}>
					{t('actions.cancel')}
				</Button> */}
				<Button variant={'outlined'} onClick={this.handleCloseSave}>
					{t('actions.close')}
				</Button>
			</DialogActions>
		</Dialog>
	}

	handleSave = () => {
		this.props.saveDashboard()
		this.props.handleCloseDT()
	}
	render() {
		const { openAddDash, classes, d, t } = this.props
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});

		return (
			!d ? null :
				<Dialog
					fullScreen
					open={openAddDash}
					onClose={this.handleCloseConfirmClose}
					TransitionComponent={SlideT}
					PaperProps={{
						className: classes[d.color]
					}}
				>
					<AppBar className={classes.cAppBar + ' ' + appBarClasses}>
						<Toolbar>
							<ItemG container alignItems={'center'}>
								<ItemG xs={1} container alignItems={'center'}>
									<IconButton color='inherit' onClick={this.handleOpenConfirmClose} aria-label='Close'>
										<Close />
									</IconButton>
								</ItemG>
								<ItemG xs={4} container /* style={{ flexWrap: this.state.n === 'sm' || this.state.n === 'xxs' ? 0 : 1 }} */>
									<ItemG container style={{ background: 'teal', borderRadius: 4, padding: 4, margin: "0px 16px" }}>
										{/* <CreateDashboardToolbar> */}
										{/* <ItemG xs={1} container alignItems="center" justify={'center'}> */}
										<IconButton size={'small'}/* onClick={this.expandToolbar} */ style={{ color: '#fff', borderRadius: 0 }}>
											<Menu />
										</IconButton>
										{/* </ItemG> */}
										<Divider style={{ width: 2, height: '100%' }} />
										<ToolbarItem type={"chart"} name={'Chart'} />
										<ToolbarItem type={"gauge"} name={'Gauge'} />
										<ToolbarItem type={"scorecard"} name={'Scorecard'} />
										{/*<ToolbarItem type={"scorecardAB"} name={'Difference Scorecard'} />*/}
										{/*<ToolbarItem type={"windcard"} name={'Windcard'} /> */}
									</ItemG>
									{/* </CreateDashboardToolbar> */}
								</ItemG>
								<ItemG container xs={6} /* justify={'center'} */ alignItems={'center'}>

									<TextF
										fullWidth={false}
										id={'dashboardName'}
										InputProps={{
											// onClick: this.handleOpenSave,
											style: {
												color: '#fff'
											}
										}}
										margin={'none'}
										value={d.name}

										// onChange={this.handleOpenSave}
										handleClick={this.handleOpenSave}
										readOnly
										reversed
										notched={false}
									/>
									{this.renderColorPicker()}

								</ItemG>
								<ItemG xs={1}>
									<Button color={'primary'} variant={'outlined'} onClick={this.handleSave}>
										<Save style={{ marginRight: 8 }} /> {t('actions.save')}
									</Button>
								</ItemG>
							</ItemG>
						</Toolbar>
					</AppBar>
					{/* <CreateDashboardToolbar
						content={
							<ItemG container style={{ flexWrap: this.state.n === 'sm' || this.state.n === 'xxs' ? 0 : 1 }}>
								<ToolbarItem type={"chart"} name={'Chart'} />
								<ToolbarItem type={"gauge"} name={'Gauge'} />
								<ToolbarItem type={"scorecard"} name={'Scorecard'} />
								<ToolbarItem type={"scorecardAB"} name={'Difference Scorecard'} />
								<ToolbarItem type={"windcard"} name={'Windcard'} />
							</ItemG>

						}>
					</CreateDashboardToolbar> */}
					{this.renderConfirmClose()}
					{this.renderSaveDialog()}
					<EditGraph d={this.props.d} g={this.props.eGraph} handleCloseEG={this.handleCloseEG} openEditGraph={this.state.openEditGraph} />
					<div style={{ width: '100%', height: 'calc(100% - 70px)' }}>
						<DropZone color={d.color} onDrop={item => { this.props.createGraph(item.type) }}>
							<ResponsiveReactGridLayout
								{...this.props}
								cols={this.cols}
								draggableCancel={".disableDrag"}
								draggableHandle={".dragHandle"}
								className={"layout"}
								rowHeight={25}
								preventCollision={false}
								measureBeforeMount={false}
								onLayoutChange={this.onLayoutChange}
								useCSSTransforms={true}
							>
								{this.generateDOM()}
							</ResponsiveReactGridLayout>
						</DropZone>
					</div>
				</Dialog>
		);
	}
}


const mapStateToProps = (state) => ({
	d: state.dsSystem.cDash,
	gs: state.dsSystem.cGraphs,
	eGraph: state.dsSystem.eGraph,
	// cols: { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 },
	// draggableCancel: ".disableDrag",
	// draggableHandle: ".dragHandle",
	// className: "layout",
	// rowHeight: 25,
	// preventCollision: false,
})

const mapDispatchToProps = dispatch => ({
	createDash: () => dispatch(createDash()),
	createGraph: (type) => dispatch(createGraph(type)),
	editGraphPos: (g) => dispatch(editGraphPos(g)),
	editDashboard: (d) => dispatch(editDash(d)),
	setGE: g => dispatch(setGE(g)),
	removeGE: g => dispatch(removeGE(g)),
	saveDashboard: () => dispatch(saveDashboard()),
	setLayout: (l) => dispatch(setLayout(l)),
	resetCreateDash: () => dispatch(resetCreateDash())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dashboardStyle)(CreateDashboard))