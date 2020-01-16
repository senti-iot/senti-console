import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Paper, Dialog, AppBar, IconButton, Toolbar, Button, Divider, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { ItemG, Dropdown, TextF, SlideT, T, Warning } from 'components';
import cx from 'classnames'
import { Close, Edit, Clear, Palette, Save, Menu } from 'variables/icons';
import createDashboardStyle from 'assets/jss/components/dashboards/createDashboardStyles';

import { useSelector, useDispatch, useLocalization } from 'hooks'

import GaugeSData from 'views/Charts/GaugeSData';
import DoubleChart from 'views/Charts/DoubleChart';
import MultiSourceChart from 'views/Charts/MultiSourceChart';
import ScorecardAB from 'views/Charts/ScorecardAB';
import WindCard from 'views/Charts/WindCard';
import Scorecard from 'views/Charts/Scorecard';
import MapCard from 'views/Charts/MapData';
import { createDash, createGraph, setGE, removeGE, editDash, generateID, saveDashboard, setLayout, resetCreateDash } from 'redux/dsSystem';
// import CreateDashboardToolbar from 'components/Toolbar/CreateDashboardToolbar';
import EditGraph from './EditGraph';
import { red } from '@material-ui/core/colors';
import ToolbarItem from './ToolbarItem';
import DropZone from './DropZone';
import { weekendColorsDropdown } from 'variables/functions';


const ResponsiveReactGridLayout = WidthProvider(Responsive);
const RenderPos = (props) => {
	const { l, editGraphOpen, removeGraph } = props
	const t = useLocalization()
	const classes = createDashboardStyle()
	return <div className={classes.editGraph}>
		<ItemG container justify={'center'} alignItems={'center'}>
			<ItemG xs={6} container justify={'flex-end'}>
				<Button style={{ width: 125, margin: 4 }} variant={'contained'} color={'primary'} onClick={editGraphOpen(l)}>
					<Edit style={{ marginRight: 8 }} />{t('actions.edit')}
				</Button>
			</ItemG>
			<ItemG xs={6}>
				<Button variant={'contained'} style={{ width: 125, margin: 4, background: red[600], color: '#fff' }} onClick={removeGraph(l)}>
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
const RenderConfirmClose = (props) => {
	const t = useLocalization()
	const { openClose, handleCloseConfirmClose, handleConfirmClose } = props
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
const RenderSaveDialog = (props) => {
	const t = useLocalization()
	const d = useSelector(s => s.dsSystem.cDash)
	const { openSave, handleCloseSave, changeName, changeDescription } = props
	return <Dialog
		open={openSave}
	>
		<DialogContent>
			<TextF
				fullWidth
				id={'dashboardNameSave'}
				label={t('dashboard.fields.name')}
				value={d.name}
				onChange={changeName}
				reversed
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
				value={d.description}
				onChange={changeDescription}
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
const CreateDashboard = (props) => {
	//Const
	const cols = { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 }

	//Props
	const { openAddDash } = props
	const classes = createDashboardStyle()

	//State
	const [openEditGraph, setOpenEditGraph] = useState(false)
	const [openClose, setOpenClose] = useState(false)
	const [openSave, setOpenSave] = useState(false)

	//Redux Selectors
	const d = useSelector(s => s.dsSystem.cDash)
	const gs = useSelector(s => s.dsSystem.cGraphs)
	const eGraph = useSelector(s => s.dsSystem.eGraph)

	//Hooks
	const dispatch = useDispatch()
	const t = useLocalization()

	//ComponentWillUnmount
	useEffect(() => {
		return () => {
			dispatch(resetCreateDash())
		};
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		if (openAddDash)
			dispatch(createDash())
	}, [openAddDash, dispatch])

	const editGraphOpen = l => e => {
		dispatch(setGE(l))
		setOpenEditGraph(true)
	}
	const removeGraph = l => e => {
		dispatch(removeGE(l))
	}

	const typeChildren = (g, i) => {
		switch (g.type) {
			case 1:
				return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={g.grid}>
					<RenderPos l={g.grid} editGraphOpen={editGraphOpen} removeGraph={removeGraph} />
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
					<RenderPos l={g.grid} editGraphOpen={editGraphOpen} removeGraph={removeGraph} />
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
					<RenderPos l={g.grid} editGraphOpen={editGraphOpen} removeGraph={removeGraph} />
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
					<RenderPos l={g.grid} editGraphOpen={editGraphOpen} removeGraph={removeGraph} />
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
					<RenderPos l={g.grid} editGraphOpen={editGraphOpen} removeGraph={removeGraph} />
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
			case 5:
				return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={g.grid}>
					<RenderPos l={g.grid} editGraphOpen={editGraphOpen} removeGraph={removeGraph} />
					<MapCard
						create
						title={g.name}
						gId={g.id}
						dId={d.id}
						color={d.color}
						single={true}
						t={t}
					/>
				</Paper>
			case 6:
				return <Paper style={{ background: 'inherid' }} key={g.id} data-grid={g.grid}>
					<RenderPos l={g.grid} editGraphOpen={editGraphOpen} removeGraph={removeGraph} />
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
				return null;
		}
	}


	const changeColor = (value) => {
		let newD = Object.assign({}, d)
		newD.color = value
		dispatch(editDash(newD))
	}

	const changeName = (e) => {
		let newD = Object.assign({}, d)
		newD.name = e.target.value
		newD.id = generateID(newD.name)
		dispatch(editDash(newD))
	}
	const changeDescription = e => {
		let newD = Object.assign({}, d)
		newD.description = e.target.value
		dispatch(editDash(newD))
	}
	const renderColorPicker = () => {
		return <Dropdown
			icon={<Palette style={{ color: "#FFF" }} />}
			menuItems={weekendColorsDropdown(t)}
			onChange={changeColor}
		/>
	}
	const handleCloseEG = () => {
		dispatch(setGE(null))
		setOpenEditGraph(false)
	}
	const onLayoutChange = (layout) => {
		dispatch(setLayout(layout))
	}

	const handleOpenConfirmClose = () => setOpenClose(true)
	const handleCloseConfirmClose = () => setOpenClose(false)
	const handleConfirmClose = () => {
		props.handleCloseDT()
		handleCloseConfirmClose()
	}


	const handleOpenSave = () => setOpenSave(true)
	const handleCloseSave = () => setOpenSave(false)



	const handleSave = () => {
		dispatch(saveDashboard())
		props.handleCloseDT()
	}

	const appBarClasses = cx({
		[' ' + classes['primary']]: 'primary'
	});

	return (
		!d ? null :
			<Dialog
				fullScreen
				open={openAddDash}
				onClose={handleCloseConfirmClose}
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
								<ItemG container style={{ background: 'teal', borderRadius: 4, padding: 4, margin: "0px 16px" }}>

									<IconButton size={'small'} style={{ color: '#fff', borderRadius: 0 }}>
										<Menu />
									</IconButton>
									<Divider style={{ width: 2, height: '100%' }} />
									<ToolbarItem type={"chart"} name={'Chart'} />
									<ToolbarItem type={"gauge"} name={'Gauge'} />
									<ToolbarItem type={"scorecard"} name={'Scorecard'} />
									<ToolbarItem type={"map"} name={'Map'} />
									<ToolbarItem type={"msChart"} name={'Multi Source Chart'} />

								</ItemG>
							</ItemG>
							<ItemG container xs={6} alignItems={'center'}>

								<TextF
									fullWidth={false}
									id={'dashboardName'}
									InputProps={{
										style: {
											color: '#fff'
										}
									}}
									margin={'none'}
									value={d.name}

									onClick={handleOpenSave}
									readOnly
									reversed
									notched={false}
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
				<RenderConfirmClose
					openClose={openClose}
					handleCloseConfirmClose={handleCloseConfirmClose}
					handleConfirmClose={handleConfirmClose}
				/>
				<RenderSaveDialog
					openSave={openSave}
					handleCloseSave={handleCloseSave}
					changeName={changeName}
					changeDescription={changeDescription}
				/>
				<EditGraph d={d} g={eGraph} handleCloseEG={handleCloseEG} openEditGraph={openEditGraph} />
				<div style={{ width: '100%', height: 'calc(100% - 70px)' }}>
					<DropZone color={d.color} onDrop={item => { dispatch(createGraph(item.type)) }}>
						<ResponsiveReactGridLayout
							{...props}
							cols={cols}
							draggableCancel={".disableDrag"}
							draggableHandle={".dragHandle"}
							className={"layout"}
							rowHeight={25}
							preventCollision={false}
							measureBeforeMount={false}
							onLayoutChange={onLayoutChange}
							useCSSTransforms={true}
						>
							{gs.map((g, i) => typeChildren(g, i))}
						</ResponsiveReactGridLayout>
					</DropZone>
				</div>
			</Dialog>
	);
}




export default CreateDashboard