import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Paper, Dialog, AppBar, IconButton, withStyles, Toolbar, Button } from '@material-ui/core';
import { ItemG, Dropdown, TextF, SlideT } from 'components';
import cx from 'classnames'
import { Close, Edit, Clear, Palette, Save } from 'variables/icons';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import { connect } from 'react-redux'

import GaugeSData from 'views/Charts/GaugeSData';
import DoubleChart from 'views/Charts/DoubleChart';
import ScorecardAB from 'views/Charts/ScorecardAB';
import WindCard from 'views/Charts/WindCard';
import Scorecard from 'views/Charts/Scorecard';
import { createDash, createGraph, editGraphPos, setGE, removeGE, editDash, generateID, saveDashboard, setLayout, resetCreateDash } from 'redux/dsSystem';
import CreateDashboardToolbar from 'components/Toolbar/CreateDashboardToolbar';
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
	handleSave = () => {
		this.props.saveDashboard()
		this.props.handleCloseDT()
	}
	render() {
		const { openAddDash, handleCloseDT, classes, d, t } = this.props
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});

		return (
			!d ? null :
				<Dialog
					fullScreen
					open={openAddDash}
					onClose={handleCloseDT}
					TransitionComponent={SlideT}
					PaperProps={{
						className: classes[d.color]
					}}
				>
					<AppBar className={classes.cAppBar + ' ' + appBarClasses}>
						<Toolbar>
							<ItemG container alignItems={'center'}>
								<ItemG xs={1} container alignItems={'center'}>
									<IconButton color='inherit' onClick={handleCloseDT} aria-label='Close'>
										<Close />
									</IconButton>
								</ItemG>
								<ItemG container md={10} sm={9} xs={9} justify={'center'} alignItems={'center'}>

									<TextF
										fullWidth={false}
										id={'dashboardName'}
										InputProps={{
											style: {
												color: '#fff'
											}
										}}
										value={d.name}
										handleChange={this.changeName}
										reversed
									/>
									{this.renderColorPicker()}

								</ItemG>
								<ItemG sm={1} xs={1} md={1}>
									<Button color={'primary'} variant={'outlined'} onClick={this.handleSave}>
										<Save style={{ marginRight: 8 }} /> {t('actions.save')}
									</Button>
								</ItemG>
							</ItemG>
						</Toolbar>
					</AppBar>
					<CreateDashboardToolbar
						content={
							<ItemG container style={{ flexWrap: this.state.n === 'sm' || this.state.n === 'xxs' ? 0 : 1 }}>
								<ToolbarItem type={"chart"} name={'Chart'} />
								<ToolbarItem type={"gauge"} name={'Gauge'} />
								{/* <ToolbarItem type={"scorecard"} name={'Scorecard'} />
								<ToolbarItem type={"scorecardAB"} name={'Difference Scorecard'} />
								<ToolbarItem type={"windcard"} name={'Windcard'} /> */}
							</ItemG>

						}>
					</CreateDashboardToolbar>
					<EditGraph d={this.props.d} g={this.props.eGraph} handleCloseEG={this.handleCloseEG} openEditGraph={this.state.openEditGraph} />
					<div style={{ width: '100%', height: 'calc(100% - 118px)' }}>
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