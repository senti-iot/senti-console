import React, { Fragment, useState } from 'react'
import DashboardCard from 'components/Cards/DashboardCard';
import imgs from 'assets/img/Squared';
import { Dialog, AppBar, Toolbar, Hidden, IconButton, ButtonBase, Paper, DialogContent, DialogActions, DialogTitle, Button } from '@material-ui/core';
import { ItemG, T, CircularLoader, SlideT } from 'components';
import { Close, Edit, ContentCopy } from 'variables/icons';
import cx from 'classnames'
import dashboardStyle from 'assets/jss/components/dashboards/dashboardStyles';
import GaugeSData from 'views/Charts/GaugeSData';
import DoubleChart from 'views/Charts/DoubleChart';
import logo from '../../logo.svg'
import ScorecardAB from 'views/Charts/ScorecardAB';
import Scorecard from 'views/Charts/Scorecard';
import WindCard from 'views/Charts/WindCard';
import { Responsive, WidthProvider } from "react-grid-layout";
import { ThemeProvider, useTheme } from '@material-ui/styles';
import { graphType } from 'variables/dsSystem/graphTypes';
import { removeDashboard } from 'redux/dsSystem';
import { copyToClipboard, selectAll } from 'variables/functions';
import SB from 'components/Scrollbar/SB';
import MapData from 'views/Charts/MapData';
import MultiSourceChart from 'views/Charts/MultiSourceChart';
import { useSnackbar, useLocalization, useSelector, useDispatch } from 'hooks';
import { nLightTheme, nDarkTheme } from 'variables/themes'
import { getWL } from 'variables/storage'

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const DashboardPanel = (props) => {

	//Hooks
	const s = useSnackbar().s
	const t = useLocalization()
	const dispatch = useDispatch()
	const theme = useTheme()
	const classes = dashboardStyle()
	//Redux
	const autoDashboard = useSelector(s => s.settings.autoDashboard)
	const dsTheme = useSelector(s => s.settings.dsTheme)

	//Props
	const { d, data, loading, handleOpenEDT } = props

	//State
	const [openDashboard, setOpenDashboard] = useState(autoDashboard ? autoDashboard === d.id ? true : false : false)
	const [openShare, setOpenShare] = useState(false)

	//Const
	let wl = getWL()

	const lightTheme = nLightTheme(wl ? wl : undefined)
	const darkTheme = nDarkTheme(wl ? wl : undefined)

	//useCallbacks

	//useEffects

	//Handlers

	const handleOpenDashboard = () => setOpenDashboard(true)

	const handleCloseDashboard = () => setOpenDashboard(false)


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
			case 5:
				return 'map'
			default:
				break;
		}
	}

	const handleOpenShare = () => setOpenShare(true)

	const handleCloseShare = () => setOpenShare(false)

	const handleCopyToClipboard = () => {
		let str = JSON.stringify(d, null, 4)
		copyToClipboard(str)
		s('snackbars.copied')
	}

	const handleDeleteDashboard = () => {
		dispatch(removeDashboard(d.id))
	}

	const handleEditDashboard = () => {
		handleOpenEDT(d)
	}

	const renderShareDashboard = () => {
		if (d) {
			const encrypted = JSON.stringify(d, null, 4)
			return <Dialog
				open={openShare}
				onClose={handleCloseShare}
				PaperProps={{
					style: {
						width: '100%'

					}
				}}
			>
				<DialogTitle>{t('dialogs.dashboards.share.title')}</DialogTitle>
				<DialogContent>
					<ItemG container justify='center'>
						<ItemG xs={12}>
							<div className={classes.exportTArea}>
								<SB>
									<pre id={'pre' + d.id} onClick={() => selectAll('pre' + d.id)}>
										{encrypted}
									</pre>
								</SB>
							</div>
						</ItemG>
						<ItemG xs={12}>

							<Button onClick={handleCopyToClipboard}>
								<ContentCopy style={{ marginRight: 8 }} />
								{t('actions.copyToClipboard')}
							</Button>
						</ItemG>
					</ItemG>
				</DialogContent>
				<DialogActions></DialogActions>
			</Dialog>
		}
	}
	const renderDashboard = () => {
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={openDashboard}
			onClose={handleCloseDashboard}
			TransitionComponent={SlideT}>
			<AppBar className={classes.cAppBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={1}>
								<div className={classes.logo}>
									<ButtonBase
										focusRipple
										className={classes.image}
										focusVisibleClassName={classes.focusVisible}
										style={{
											width: '120px'
										}}
									>
										<span
											className={classes.imageSrc}
											style={{
												backgroundImage: `url(${theme.logo ? theme.logo : logo})`
											}}
										/>
									</ButtonBase>
								</div>
							</ItemG>
							<ItemG xs={10} container alignItems={'center'} justify={'center'}>
								<T variant='h6' color='inherit' className={classes.flex}>
									{d.name}
								</T>
							</ItemG>
							<ItemG xs={1} container justify={'flex-end'}>
								<IconButton color='inherit' onClick={() => { handleOpenEDT(d); handleCloseDashboard(); }} aria-label='Close'>
									<Edit />
								</IconButton>
								<IconButton color='inherit' onClick={handleCloseDashboard} aria-label='Close'>
									<Close />
								</IconButton>
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={11} container alignItems={'center'}>
								<T variant='h6' color='inherit' className={classes.flex}>
									{d.name}
								</T>
							</ItemG>
							<ItemG xs={1} container justify={'flex-end'}>
								<IconButton color={'inherit'} onClick={handleCloseDashboard} aria-label='Close'>
									<Close />
								</IconButton>

							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			{
				loading ? <CircularLoader /> : <div className={classes[d.color]} style={{ height: 'calc(100%)', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
					<ResponsiveReactGridLayout
						{...props}

						useCSSTransforms={false}
						isResizable={false}
						isDraggable={false}
					>
						{d.graphs.map((g, i) => {
							let grid = g.grid ? g.grid : graphType(gridCoords(g.type)).grid
							switch (g.type) {
								case 1:
									return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
										<GaugeSData
											title={g.name}
											period={{ ...g.period, menuId: g.periodType }}
											t={t}
											color={d.color}
											gId={g.id}
											dId={d.id}
											single
										/>
									</Paper>
								case 0:
									return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
										<DoubleChart
											title={g.name}
											g={g}
											period={{ ...g.period }}
											gId={g.id}
											dId={d.id}
											color={d.color}
											single={true}
											t={t}
										/>
									</Paper>
								case 2:
									return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
										<ScorecardAB
											color={d.color}
											title={g.name}
											gId={g.id}
											dId={d.id}
											single={true}
											t={t}
										/>
									</Paper>
								case 3:
									return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
										<Scorecard
											color={d.color}
											title={g.name}
											gId={g.id}
											dId={d.id}
											single={true}
											t={t}
										/>
									</Paper>
								case 4:
									return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
										<WindCard
											color={d.color}
											title={g.name}
											gId={g.id}
											dId={d.id}
											single={true}
											t={t}
										/>
									</Paper>
								case 5:
									return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
										<MapData
											color={d.color}
											title={g.name}
											gId={g.id}
											dId={d.id}
											t={t}
										/>
									</Paper>
								case 6:
									return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
										<MultiSourceChart
											single={true}
											color={d.color}
											title={g.name}
											gId={g.id}
											dId={d.id}
										/>
									</Paper>
								default:
									return null;
							}

						})}
					</ResponsiveReactGridLayout>
				</div>
			}
		</Dialog >
	}


	return (
		<Fragment>
			<ThemeProvider theme={dsTheme === 0 ? lightTheme : darkTheme}>
				{renderDashboard()}
			</ThemeProvider>
			{renderShareDashboard()}
			<ItemG xs={12} md={4} lg={3} xl={2}>
				<DashboardCard
					deleteDashboard={handleDeleteDashboard}
					handleOpenDashboard={handleOpenDashboard}
					handleEditDashboard={handleEditDashboard}
					handleOpenShare={handleOpenShare}
					data={data}
					header={d.name}
					img={imgs.data}
					content={d.description}
					c={d.color}
					t={t}
				/>
			</ItemG>
		</Fragment>
	)
}

DashboardPanel.defaultProps = {
	className: "layout",
	rowHeight: 25,
	preventCollision: false,
	onLayoutChange: () => { },
	cols: { lg: 12, md: 6, sm: 4, xs: 3, xxs: 3 },
};


export default DashboardPanel
