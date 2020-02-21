import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Switch, Route, Redirect, useHistory } from 'react-router-dom'
import { Header, /* Sidebar,  */CircularLoader } from 'components'
import cx from 'classnames'
import dashboardRoutes from 'routes/dashboard.js'
import appStyle from 'assets/jss/material-dashboard-react/appStyle.js'
import { makeStyles } from '@material-ui/core/styles'
import cookie from 'react-cookies'
import { getSettings } from 'redux/settings'
import { getDaysOfInterest } from 'redux/doi'
import Cookies from 'components/Cookies/Cookies'
import Sidebar from 'components/Sidebar/Sidebar'
import BC from 'components/Breadcrumbs/BC'
import { changeTabs } from 'redux/appState'
import Toolbar from 'components/Toolbar/Toolbar'
import { useRef, useDispatch, useSelector, useLocalization } from 'hooks'
import NewContent from 'layouts/404/NewContent'



function App(props) {
	//#region State

	const [mobileOpen, setMobileOpen] = useState(false)
	const [headerTitle, setHeaderTitle] = useState('')
	const [headerOptions, setHeaderOptions] = useState(null)
	const [goBackButton, setGoBackButton] = useState(false)
	const [url, setUrl] = useState('')
	const [menuRoute, setMenuRoute] = useState('')
	const [bc, setBc] = useState({ name: '', id: '' })

	//#endregion
	//#region Refs
	const mainPanel = useRef(null)

	//#endregion
	//#region Hooks
	const classes = makeStyles(appStyle)()
	const history = useHistory()
	const dispatch = useDispatch()
	const t = useLocalization()
	//#endregion


	//#region Redux

	const loading = useSelector(s => s.settings.loading)
	const defaultRoute = useSelector(s => s.settings.defaultRoute)
	const defaultView = useSelector(s => s.settings.defaultView)
	const smallMenu = useSelector(s => s.appState.smallMenu)
	const drawer = useSelector(s => s.settings.drawer)
	const tabs = useSelector(s => s.appState.tabs)

	//#endregion

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}
	const handleSetBreadCrumb = (id, name, extra, dontShow) => {

		if (bc.id !== id || bc.name !== name) {
			setBc({
				id: id,
				name: name,
				extra: extra,
				dontShow: dontShow
			})
		}
	}
	const handleSetHeaderTitle = useCallback(
		(hTitle, gBB, URL, mR) => {
			if (typeof hTitle === 'string') {
				if ((headerTitle !== hTitle) || (URL !== url)) {
					setHeaderTitle(hTitle)
					setGoBackButton(gBB)
					setUrl(URL)
					setMenuRoute(mR)
					if (mainPanel.current)
						mainPanel.current.scrollTop = 0
				}
			}
			else {
				if ((hTitle.id !== headerTitle) || (URL !== url)) {
					setHeaderTitle(hTitle.id)
					setHeaderOptions(hTitle.options)
					setGoBackButton(gBB)
					setUrl(URL)
					setMenuRoute(mR)
					if (mainPanel.current)
						mainPanel.current.scrollTop = 0
				}
			}

		},
		[headerTitle, url],
	)

	const handleGoBackButton = () => {
		history.push(url)
		setUrl('')
	}
	const handleSetTabs = (tbs) => {
		console.log(tbs)
		if (tbs.id !== tabs.id) {
			dispatch(changeTabs(tbs))
		}
		if (tbs.id === tabs.id && tbs.route !== tabs.route) {
			dispatch(changeTabs(tbs))
		}
	}
	useEffect(() => {
		if (!cookie.load('SESSION')) {
			history.push('/login')
		}
		// eslint-disable-next-line
	}, [])
	useEffect(() => {
		if (defaultRoute === '/')
			handleSetHeaderTitle('', false, '', 'dashboard')

		const getS = async () => {
			dispatch(await getSettings()).then(async rs => {
				await dispatch(getDaysOfInterest())
			})
		}
		getS()
	}, [dispatch, handleSetHeaderTitle, defaultRoute])

	return (

		<div className={classes.wrapper}>
			<NewContent />
			<Header
				defaultRoute={defaultRoute}
				routes={dashboardRoutes}
				handleDrawerToggle={handleDrawerToggle}
				goBackButton={goBackButton}
				gbbFunc={handleGoBackButton}
				headerTitle={headerTitle}
				headerOptions={headerOptions}
				t={t}
			/>
			<div className={cx({
				[classes.mainPanelDrawerPersClosed]: !smallMenu && drawer === 'persistent',
				[classes.mainPanelDrawerPermClosed]: !smallMenu && drawer === 'permanent',
				[classes.mainPanelDrawerOpen]: smallMenu,
				[classes.mainPanel]: true
			})} ref={mainPanel}>
				<Fragment>
					<Sidebar
						defaultView={defaultView}
						defaultRoute={defaultRoute}
						routes={dashboardRoutes}
						handleDrawerToggle={handleDrawerToggle}
						open={mobileOpen}
						color='senti'
						t={t}
						menuRoute={menuRoute}
					/>
					{!loading ?
						<Fragment>
							<div className={classes.container} id={'container'}>
								<Toolbar />
								<BC
									defaultRoute={defaultRoute}
									bc={bc}
									t={t}
								/>
								<Switch>
									{cookie.load('SESSION') ?
										dashboardRoutes.map((prop, key) => {
											if (prop.divider) {
												return null
											}
											if (prop.dropdown) {
												return prop.items.map((r, key) => {
													return <Route path={r.path} key={r.menuRoute + key}>

														<r.component
															path={r.path}
															setBC={handleSetBreadCrumb}
															setHeader={handleSetHeaderTitle}
															setTabs={handleSetTabs} />
													</Route>
												})
											}
											if (prop.redirect) {
												return <Redirect from={prop.path} to={prop.to} key={key} />
											}
											return <Route path={prop.path} key={key}>
												<prop.component
													path={prop.path}
													setBC={handleSetBreadCrumb}
													setHeader={handleSetHeaderTitle}
													setTabs={handleSetTabs}
												/>
											</Route>
										})
										: <Redirect from={window.location.pathname} to={{
											pathname: '/login', state: {
												prevURL: window.location.pathname
											}
										}} />}
								</Switch>
							</div>
							<Cookies />
						</Fragment>
						: <CircularLoader />}
				</Fragment>
			</div>

		</div >

	)

}

App.whyDidYouRender = true

export default App
