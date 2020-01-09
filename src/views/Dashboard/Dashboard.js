import { Button, Fade, Hidden, DialogContent, DialogActions, DialogTitle, Dialog } from '@material-ui/core';
import dashboardStyle from 'assets/jss/components/dashboards/dashboardStyles';
import GridContainer from 'components/Grid/GridContainer';
import React, { Fragment, useState, useEffect } from 'react';
import DashboardPanel from './DashboardPanel.js';
import CreateDashboard from './CreateDashboard.js';
import { Add, ImportExport } from 'variables/icons.js';
import { ThemeProvider } from '@material-ui/styles';
import EditDashboard from './EditDashboard.js';
import { reset, importDashboard } from 'redux/dsSystem.js';
import { finishedSaving } from 'redux/dsSystem';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@material-ui/lab';
import { TextF } from 'components/index.js';
import { nLightTheme, nDarkTheme } from 'variables/themes'
import { getWL } from 'variables/storage'
import { useLocalization, useSnackbar, useDispatch, useSelector } from 'hooks/index.js';


const Dashboard = (props) => {
	//Hooks
	const t = useLocalization()
	const s = useSnackbar()
	const dispatch = useDispatch()
	const classes = dashboardStyle()
	//Redux
	const saved = useSelector(s => s.dsSystem.saved)
	const dsTheme = useSelector(s => s.settings.dsTheme)
	const dashboards = useSelector(s => s.dsSystem.dashboards)

	//State
	const [openAddDash, setOpenAddDash] = useState(false)
	const [openEditDash, setOpenEditDash] = useState(false)
	const [eDash, setEDash] = useState(null)
	const [openSpeed, setOpenSpeed] = useState(false)
	const [openImport, setOpenImport] = useState(false)
	const [importValue, setImportValue] = useState('')
	const [error, setError] = useState(false)
	const [newD, setNewD] = useState(null)
	//Const

	//Effects

	useEffect(() => {
		props.setHeader('Dashboard', false, '', 'dashboard')
		props.setBC('dashboard', '', '', true)
		props.setTabs({
			id: 'dashboard',
			dontShow: true,
			tabs: []
		})
		return () => {

		};
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		if (saved) {
			s.s(saved)
			dispatch(finishedSaving())
		}
	}, [dispatch, s, saved])


	//Handlers

	const handleOpenSpeed = () => setOpenSpeed(true)
	const handleCloseSpeed = () => setOpenSpeed(false)


	const handleOpenDT = e => {
		e.stopPropagation()
		e.preventDefault()
		setOpenAddDash(true)

	}
	const handleCloseDT = () => {
		dispatch(reset())
		setOpenAddDash(false)
	}
	const handleOpenEDT = (eDash) => {
		setOpenEditDash(true)
		setEDash(eDash)
	}
	const handleCloseEDT = () => {
		dispatch(reset())
		setOpenEditDash(false)
		setEDash(null)
	}
	const handleOpenImport = e => {
		e.preventDefault()
		e.stopPropagation()
		setOpenImport(true)
	}
	const handleCloseImport = () => {
		setOpenImport(false)
		setError(false)
		setImportValue('')
	}
	const handleSetImportValue = e => {
		setImportValue(e.target.value)
		if (error)
			setError(false)
	}
	const handleCheckJSON = e => {
		try {
			let newD = JSON.parse(importValue)
			setNewD(newD)
		} catch (error) {
			setError(true)
		}
	}
	const handleImport = () => {
		if (newD) {
			dispatch(importDashboard(newD))
			setNewD(null)
			openImport(false)
		}
	}

	//Renders
	const renderImportDashboard = () => {
		return <Dialog
			open={openImport}
			onClose={handleCloseImport}
			PaperProps={{
				style: {
					width: '100%'
				}
			}}
		>
			<DialogTitle>{`${t('actions.import')} ${t('sidebar.dashboard')}`}</DialogTitle>
			<DialogContent>
				<TextF
					value={importValue}
					id={'importDashboard'}
					fullWidth
					multiline
					rows={10}
					onChange={handleSetImportValue}
					onBlur={handleCheckJSON}
					error={error}
				/>
			</DialogContent>
			<DialogActions>
				<Button variant={'outlined'} color={'primary'} onClick={handleImport} disabled={error}>{t('actions.import')}</Button>
			</DialogActions>

		</Dialog>
	}
	const renderEditDashboard = () => {

		return <EditDashboard
			eDash={eDash}
			open={openEditDash}
			handleClose={handleCloseEDT}
			t={t}
		/>
	}
	const renderAddDashboard = () => {

		return <CreateDashboard
			openAddDash={openAddDash}
			handleCloseDT={handleCloseDT}
			t={t}
		/>

	}
	const renderTheme = t => {
		let wl = getWL()
		const lightTheme = nLightTheme(wl ? wl : undefined)
		const darkTheme = nDarkTheme(wl ? wl : undefined)
		return t === 1 ? darkTheme : lightTheme
	}
	return (
		<Fragment>
			<Fade in={true} style={{
				transitionDelay: 200,
			}}>
				<div style={{ position: 'relative' }}>
					{renderImportDashboard()}
					<ThemeProvider theme={renderTheme(dsTheme)}>
						{renderAddDashboard()}
						{renderEditDashboard()}
					</ThemeProvider>
					<GridContainer spacing={2}>
						{dashboards.map((d, i) => {
							return <DashboardPanel
								handleOpenEDT={handleOpenEDT}
								key={i}
								d={d}
								t={t}
							/>
						})}
					</GridContainer>
					<div style={{ height: 80 }} />

					<Hidden xsDown>

						<SpeedDial
							ariaLabel="Create Dashboard"
							className={classes.speedDial}
							icon={<SpeedDialIcon />}
							onBlur={handleCloseSpeed}
							onClick={handleOpenSpeed}
							onClose={handleCloseSpeed}
							onMouseEnter={handleOpenSpeed}
							onMouseLeave={handleCloseSpeed}
							open={openSpeed}
							direction={'up'}
						>
							<SpeedDialAction
								icon={<ImportExport />}
								tooltipTitle={`${t('actions.import')} ${t('sidebar.dashboard')}`}
								tooltipOpen
								onClick={handleOpenImport}
								style={{ whiteSpace: 'nowrap' }}

							/>
							<SpeedDialAction
								icon={<Add />}
								tooltipTitle={`${t('actions.create')} ${t('sidebar.dashboard')}`}
								tooltipOpen
								onClick={handleOpenDT}
								style={{ whiteSpace: 'nowrap' }}
							/>

						</SpeedDial>
					</Hidden>
				</div>
			</Fade>
		</Fragment>
	)
}


export default Dashboard
