import React, { useState, useEffect } from 'react'
import { AppBar, Tabs, Tab, makeStyles, Toolbar as ToolBar, Tooltip, /*  Grow */ } from '@material-ui/core'
// import Search from 'components/Search/Search';
// import { suggestionGen } from 'variables/functions'
import { NavHashLink } from 'react-router-hash-link'
import { useSelector } from 'react-redux'
import { transition } from 'assets/jss/material-dashboard-react'
import cx from 'classnames'
import { useWidth } from 'hooks'
// import inView from 'in-view'

const Link = React.forwardRef((props, ref) => <NavHashLink {...props} innerRef={ref} />)

const styles = makeStyles(theme => ({
	appBarDrawerOpen: {
		[theme.breakpoints.up('xl')]: {
			left: 260,
			width: "calc(100vw - 260px)",
		}
	},
	appBarDrawerPermClosed: {
		[theme.breakpoints.up('xl')]: {

			width: 'calc(100vw - 60px)',
			left: 60
		}
	},
	appBarDrawerPersClosed: {

		[theme.breakpoints.up('lg')]: {
			width: 'calc(100vw)',
			left: 0
		}
	},
	appBar: {
		padding: "0 !important",
		position: "fixed",
		top: 70,
		background: theme.toolbarBackground ? theme.toolbarBackground : undefined,
		[theme.breakpoints.down('xs')]: {
			top: 48
		},
		// [theme.breakpoints.up('lg')]: {

		// },
		display: 'flex',
		flexFlow: 'row',
		justifyContent: 'space-between',
		maxWidth: '100%',
		overflow: 'visible',
		minHeight: 48,
		height: 48,
		zIndex: 900,
		boxShadow: 'none',
		...transition
	},
	contentToolbar: {
		height: 41,
		minHeight: 41,
		maxHeight: 41,
		paddingLeft: 0,
		marginLeft: 'auto',
	},
	dividerContainer: {
		marginLeft: 'auto',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 48,
	},
	divider: {
		width: 2,
		height: 32,
		background: 'rgb(255, 255, 255, 0.5)',
	},
	noOverflow: {
		overflow: 'hidden'
	},
	indicator: {
		background: theme.toolbarIndicator ? theme.toolbarIndicator : undefined
	}
}))


const Toolbar = React.memo(props => {

	//Hooks
	const classes = styles()
	const width = useWidth()
	//Redux
	const smallMenu = useSelector(state => state.appState.smallMenu)
	const drawer = useSelector(state => state.settings.drawer)
	const tabs = useSelector(s => s.appState.tabs)

	//State
	const [route, setRoute] = useState(0)

	//Const

	//useCallbacks

	//useEffects
	useEffect(() => {
		if ((route !== tabs.route) && tabs.tabs.length > 0)
			setRoute(tabs.route)
	}, [route, tabs.route, tabs.tabs])

	//Handlers

	const handleTabsChange = (e, value) => {
		setRoute(value)
	}

	return (
		tabs.dontShow ? null :
			<div style={{ height: 48 }}>
				<AppBar classes={{
					root: cx({
						[classes.appBar]: true,
						[classes.appBarDrawerPermClosed]: !smallMenu && drawer === 'permanent',
						[classes.appBarDrawerPersClosed]: !smallMenu && drawer === 'persistent',
						[classes.appBarDrawerOpen]: smallMenu,
					})
				}}>
					{tabs.tabs ? <Tabs
						id={'tabs'} value={route} variant={width === 'xs' ? 'scrollable' : undefined} onChange={handleTabsChange} classes={{ fixed: classes.noOverflow, root: classes.noOverflow, indicator: classes.indicator }}>
						{tabs.tabs ? tabs.tabs.map((t, i) => {
							return <Tooltip key={i} title={t.title}>
								<Tab
									component={Link}
									value={t.id}
									smooth
									classes={{ root: classes.tab }}
									icon={t.label}
									to={`${t.url}`} />
							</Tooltip>
						}) : null}
					</Tabs> : null}
					{tabs.content ? <ToolBar classes={{ root: classes.contentToolbar }}>
						{tabs.content}
					</ToolBar> : null}
				</AppBar>
			</div>
	)
})

Toolbar.whyDidYouRender = true
export default Toolbar
