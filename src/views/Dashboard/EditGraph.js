import React from "react";
// import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Paper, Dialog, AppBar, IconButton, Hidden, Toolbar, Drawer, Slide } from '@material-ui/core';
import { T, ItemG } from 'components';
import cx from 'classnames'
import { Close } from 'variables/icons';
import createDashboardStyles from 'assets/jss/components/dashboards/createDashboardStyles';

import GaugeSData from 'views/Charts/GaugeSData';
import DoubleChart from 'views/Charts/DoubleChart';
import ScorecardAB from 'views/Charts/ScorecardAB';
import WindCard from 'views/Charts/WindCard';
import Scorecard from 'views/Charts/Scorecard';
import { getSensorLS } from 'redux/data';
import EditDataSource from './EditDataSource';
import MapData from 'views/Charts/MapData';
import MultiSourceChart from 'views/Charts/MultiSourceChart';
import { useLocalization, useDispatch } from 'hooks';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const EditGraph = props => {
	//Hooks
	const t = useLocalization()
	const dispatch = useDispatch()
	const classes = createDashboardStyles()
	//Redux

	//State

	//Const
	const cols = { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 }
	const { openEditGraph, handleCloseEG, g, d } = props

	const appBarClasses = cx({
		[' ' + classes['primary']]: 'primary'
	});
	//useCallbacks

	//useEffects

	//Handlers
	const getCoords = (c) => {
		let coords = { ...c }
		// coords.x = 0
		// coords.y = 0
		return coords
	}
	const getSensor = async (id) => await dispatch(await getSensorLS(id))

	const typeChildren = (g) => {
		if (g)
			switch (g.type) {
				case 1:
					return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={getCoords(g.grid)}>
						<GaugeSData
							create
							chartId={'editor' + g.id}
							color={d.color}
							title={g.name}
							period={{ ...g.period, menuId: g.periodType }}
							t={t}
							gId={g.id}
							dId={d.id}
							single
						/>
					</Paper>
				case 0:
					return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={getCoords(g.grid)}>
						<DoubleChart
							create
							color={d.color}
							title={g.name}
							gId={g.id}
							dId={d.id}
							single={true}
						/>
					</Paper>
				case 2:
					return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={getCoords(g.grid)}>

						<ScorecardAB
							create
							color={d.color}
							title={g.name}
							gId={g.id}
							dId={d.id}
							single={true}
							t={t}
						/>
					</Paper>
				case 3:
					return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={getCoords(g.grid)}>

						<Scorecard
							create
							color={d.color}
							title={g.name}
							gId={g.id}
							dId={d.id}
							single={true}
							t={t}
						/>
					</Paper>
				case 4:
					return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={getCoords(g.grid)}>
						<WindCard
							create
							color={d.color}
							title={g.name}
							gId={g.id}
							dId={d.id}
							single={true}
							t={t}
						/>
					</Paper>
				case 5:
					return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={getCoords(g.grid)}>
						<MapData
							create
							color={d.color}
							title={g.name}
							gId={g.id}
							dId={d.id}
							single={true}
							t={t}
						/>
					</Paper>
				case 6:
					return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={getCoords(g.grid)}>
						<MultiSourceChart
							create
							color={d.color}
							title={g.name}
							gId={g.id}
							dId={d.id}
							single={true}
						/>
					</Paper>
				default:
					return null;

			}
		else {
			return null
		}
	}


	return (
		<Dialog
			fullScreen
			open={openEditGraph}
			onClose={handleCloseEG}
			keepMounted
			TransitionComponent={Transition}
		>	<AppBar className={classes.cAppBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={1} container alignItems={'center'}>
								<IconButton color='inherit' onClick={handleCloseEG} aria-label='Close'>
									<Close />
								</IconButton>
							</ItemG>
							<ItemG xs={10} container justify={'center'}>
								<T variant='h6' color='inherit' className={classes.flex}>
									{t('dashboard.editGraph')}
								</T>
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={4} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={handleCloseEG} aria-label='Close'>
									<Close />
								</IconButton>
								<T variant='h6' color='inherit' className={classes.flex}>
									{t('dashboard.editGraph')}
								</T>
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<div className={classes[d.color]} style={{ width: '100%', height: 'calc(100% - 70px)' }}>
				<ResponsiveReactGridLayout
					compactType={null}
					cols={cols}
					className={"layout"}
					rowHeight={25}
					isDraggable={false}
					isResizable={false}
				>
					{typeChildren()}
				</ResponsiveReactGridLayout>
			</div>
			<Drawer
				variant={'permanent'}
				anchor={'right'}
				PaperProps={{
					classes: { root: classes.editSourceDrawer }
				}}
			>
				<ItemG container justify={'center'}>
					{g ? <EditDataSource
						getSensor={getSensor}
					/> : null}
				</ItemG>
			</Drawer>
		</Dialog>
	)
}


export default EditGraph
