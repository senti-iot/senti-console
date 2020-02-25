import React, { useState, useEffect } from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import { Paper, Dialog, AppBar, IconButton, Toolbar, Button, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'
import { ItemG, Dropdown, TextF, SlideT, T, Warning } from 'components'
import cx from 'classnames'
import { Close, Edit, Clear, Palette, Save } from 'variables/icons'
import { useDispatch, useSelector } from 'react-redux'

import GaugeSData from 'views/Charts/GaugeSData'
import DoubleChart from 'views/Charts/DoubleChart'
import ScorecardAB from 'views/Charts/ScorecardAB'
import WindCard from 'views/Charts/WindCard'
import Scorecard from 'views/Charts/Scorecard'
import { createGraph, setGE, removeGE, editDash, saveDashboard, setLayout, resetEditDash, loadDash } from 'redux/dsSystem'
import EditGraph from './EditGraph'
import { red } from '@material-ui/core/colors'
import DropZone from './DropZone'
import { weekendColorsDropdown } from 'variables/functions'
import { graphType } from 'variables/dsSystem/graphTypes'
import MapData from 'views/Charts/MapData'
import MultiSourceChart from 'views/Charts/MultiSourceChart'
import ToolbarContainer from 'views/Dashboard/ToolbarContainer'
import { useLocalization } from 'hooks'
import createDashboardStyle from 'assets/jss/components/dashboards/createDashboardStyles'


const ResponsiveReactGridLayout = WidthProvider(Responsive)


const EditDashboard = props => {
	//Hooks
	const t = useLocalization()
	const dispatch = useDispatch()
	const classes = createDashboardStyle()
	//Redux
	const d = useSelector(s => s.dsSystem.cDash)
	const gs = useSelector(s => s.dsSystem.cGraphs)
	const eGraph = useSelector(s => s.dsSystem.eGraph)

	//State
	// const [grapsh, setGrapsh] = useState([])
	const [openEditGraph, setOpenEditGraph] = useState(false)
	const [openSave, setOpenSave] = useState(false)
	const [openClose, setOpenClose] = useState(false)

	//Const
	const { open, eDash, handleClose } = props
	const appBarClasses = cx({
		[' ' + classes['primary']]: 'primary'
	})
	const cols = { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 }
	//useCallbacks

	//useEffects
	/* if ((props.open !== prevProps.open) && props.open) {
		props.loadDashboard(props.eDash)
	}
	if (prevProps.gs !== props.gs) {
		 setState({
		 	layout: {
		 		lg: props.gs.map((g) => ({
		 			i: g.id,
		 			...g.grid
		 */
	useEffect(() => {
		if (open && !d && eDash) {
			dispatch(loadDash(eDash))
		}
		return () => {
			// dispatch(resetEditDash())
		}
		//eslint-disable-next-line
	}, [open, d])

	useEffect(() => {
		return () => {
			dispatch(resetEditDash())
		}
	}, [dispatch])
	//Handlers
	const handleOnDrop = item => {
		dispatch(createGraph(item.type))
	}

	const handleOpenEditGraph = () => setOpenEditGraph(true)
	const handleCloseEditGraph = () => setOpenEditGraph(false)

	const handleGraphOpen = l => e => {
		dispatch(setGE(l))
		handleOpenEditGraph()
		// handleCloseEditGraph()
	}
	const handleRemoveGraph = l => e => {
		dispatch(removeGE(l))
		// props.removeGE(l)
	}

	const gridCoords = (type) => {
		switch (type) {
			case 0:
				return 'chart'
			case 1:
				return 'gauge'
			case 2:
				return 'scorecardAB'
			case 3:
				return 'scorecard'
			case 4:
				return 'windcard'
			default:
				break
		}
	}
	const typeChildren = (g, i) => {
		let grid = g.grid ? g.grid : graphType(gridCoords(g.type)).grid
		if (!grid.minW || !grid.minH) {
			grid = {
				...graphType(gridCoords(g.type)).grid,
				...grid
			}
		}
		switch (g.type) {
			case 1:
				return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
					{renderPos(g.grid)}
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
				return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
					{renderPos(g.grid)}
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
				return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
					{renderPos(g.grid)}
					<ScorecardAB
						create
						title={g.name}
						color={d.color}
						gId={g.id}
						dId={d.id}
						single={true}
						t={t}
					/>
				</Paper>
			case 3:
				return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
					{renderPos(g.grid)}
					<Scorecard
						create
						title={g.name}
						color={d.color}
						gId={g.id}
						dId={d.id}
						single={true}
						t={t}
					/>
				</Paper>
			case 4:
				return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
					{renderPos(g.grid)}
					<WindCard
						create
						title={g.name}
						color={d.color}
						gId={g.id}
						dId={d.id}
						single={true}
						t={t}
					/>
				</Paper>
			case 5:
				return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
					{renderPos(g.grid)}
					<MapData
						create
						title={g.name}
						color={d.color}
						g={g}
						// gId={g.id}

						dId={d.id}
						single={true}
						t={t}
					/>
				</Paper>
			case 6:
				return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
					{renderPos(g.grid)}
					<MultiSourceChart
						create
						title={g.name}
						gId={g.id}
						dId={d.id}
						color={d.color}
						single={true}
					/>
				</Paper>
			default:
				return null
		}
	}
	const renderGraphs = () => {
		return gs.map((g, i) => typeChildren(g, i))
	}

	const handleChangeColor = (value) => {
		let newD = Object.assign({}, d)
		newD.color = value
		dispatch(editDash(newD, true))
	}

	const handleChangeName = (e) => {
		let newD = Object.assign({}, d)
		newD.name = e.target.value
		dispatch(editDash(newD, true))
	}
	const handleChangeDescription = (e) => {
		let newD = Object.assign({}, d)
		newD.description = e.target.value
		dispatch(editDash(newD, true))
	}


	const handleCloseEG = () => {
		dispatch(setGE(null))
		handleCloseEditGraph()
		// props.setGE(null)
		// setState({ openEditGraph: false })

	}
	const handleLayoutChange = (layout) => {
		dispatch(setLayout(layout))
	}
	const handleOpenConfirmClose = () => setOpenClose(true)
	const handleCloseConfirmClose = () => setOpenClose(false)

	const handleConfirmClose = () => {
		props.handleClose()
		handleCloseConfirmClose()
	}

	const handleSave = () => {
		dispatch(saveDashboard())
		// props.saveDashboard(true)
		handleClose()
	}
	const handleOpenSave = () => setOpenSave(true)
	const handleCloseSave = () => setOpenSave(false)

	const renderConfirmClose = () => {
		return <Dialog
			open={openClose}
		>
			<DialogTitle>{t('dialogs.dashboards.close.title')}</DialogTitle>
			<DialogContent>
				<T style={{ marginBottom: 8 }}>{t('dialogs.dashboards.close.message')}</T>
				<Warning>{t('dialogs.dashboards.close.warning')}</Warning>
			</DialogContent>
			<DialogActions>
				<Button variant={'outlined'} onClick={handleCloseConfirmClose}>
					{t('actions.no')}
				</Button>
				<Button variant={'outlined'} onClick={handleConfirmClose}>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>

	}
	const renderSaveDialog = () => {
		return <Dialog
			open={openSave}
		>
			<DialogContent>
				<TextF
					fullWidth
					id={'dashboardNameSave'}
					label={t('dashboard.fields.name')}
					value={d.name}
					onChange={handleChangeName}
					reversed
				/>
				<TextF
					fullWidth
					id={'dashboardDesc'}
					// InputProps={{
					// 	style: {
					// 		color: '#fff'
					// 	}
					// }}
					multiline
					rows={4}
					label={t('dashboard.fields.description')}
					value={d.description}
					onChange={handleChangeDescription}
					reversed
				/>
			</DialogContent>
			<DialogActions style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Button variant={'outlined'} onClick={handleCloseSave}>
					{t('actions.close')}
				</Button>
			</DialogActions>
		</Dialog>
	}

	const renderColorPicker = () => {
		return <Dropdown
			cIcon
			icon={<Palette style={{ color: "#FFF" }} />}
			menuItems={weekendColorsDropdown(t)}
			onChange={handleChangeColor}
		/>
	}
	const renderPos = (l) => {
		return <div className={classes.editGraph}>
			<ItemG container justify={'center'} alignItems={'center'}>
				<ItemG xs={6} container justify={'flex-end'}>
					<Button style={{ width: 125, margin: 4 }} variant={'contained'} color={'primary'} onClick={handleGraphOpen(l)}>
						<Edit style={{ marginRight: 8 }} />{t('actions.edit')}
					</Button>
				</ItemG>
				<ItemG xs={6}>
					<Button variant={'contained'} style={{ width: 125, margin: 4, background: red[600], color: '#fff' }} onClick={handleRemoveGraph(l)}>
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
	return (
		!d ? null :
			<Dialog
				fullScreen
				open={open}
				onClose={handleOpenConfirmClose}
				TransitionComponent={SlideT}
				PaperProps={{
					className: classes[d.color]
				}}
			>
				<AppBar className={classes.cAppBar + ' ' + appBarClasses}>
					<Toolbar>
						<ItemG container alignItems={'center'}>
							<ItemG xs={1} container alignItems={'center'}>
								<IconButton color='inherit' onClick={handleOpenConfirmClose} aria-label='Close'>
									<Close />
								</IconButton>
							</ItemG>
							<ItemG xs={4} container>
								<ToolbarContainer />
							</ItemG>
							<ItemG container xs={6} alignItems={'center'}>

								<TextF
									id={'dashboardName'}
									InputProps={{
										style: {
											color: '#fff'
										}
									}}
									margin='none'
									value={d.name}
									// onChange={changeName}
									onClick={handleOpenSave}
									reversed
								/>
								{renderColorPicker()}

							</ItemG>
							<ItemG xs={1}>
								<Button color={'primary'} variant={'outlined'} onClick={handleSave}>
									<Save style={{ marginRight: 8 }} /> {t('actions.save')}
								</Button>
							</ItemG>
						</ItemG>
					</Toolbar>
				</AppBar>
				{renderConfirmClose()}
				{renderSaveDialog()}
				<EditGraph
					d={d}
					g={eGraph}
					handleCloseEG={handleCloseEG}
					openEditGraph={openEditGraph} />
				<div style={{ width: '100%', height: 'calc(100% - 70px)' }}>
					<DropZone color={d.color} onDrop={handleOnDrop}>
						<ResponsiveReactGridLayout
							{...props}
							cols={cols}
							draggableCancel={".disableDrag"}
							draggableHandle={".dragHandle"}
							className={"layout"}
							rowHeight={25}
							preventCollision={false}
							measureBeforeMount={false}
							onLayoutChange={handleLayoutChange}
							useCSSTransforms={true}
						>
							{renderGraphs()}
						</ResponsiveReactGridLayout>
					</DropZone>
				</div>
			</Dialog>
	)
}




export default EditDashboard