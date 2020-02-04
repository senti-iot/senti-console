import React, { useState, useEffect } from 'react'
import { AppBar, Tabs, Tab, withStyles, Toolbar as ToolBar, withWidth, Tooltip, /*  Grow */ } from '@material-ui/core';
// import Search from 'components/Search/Search';
// import { suggestionGen } from 'variables/functions'
import { NavHashLink } from 'react-router-hash-link';
import { useSelector } from 'react-redux'
import { transition } from 'assets/jss/material-dashboard-react';
import cx from 'classnames'
// import inView from 'in-view'

const Link = React.forwardRef((props, ref) => <NavHashLink {...props} innerRef={ref} />)

const styles = theme => ({
	appBarDrawerOpen: {
		[theme.breakpoints.up('lg')]: {
			left: 260,
			width: "calc(100vw - 260px)",
		}
	},
	appBarDrawerPermClosed: {
		[theme.breakpoints.up('lg')]: {

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
})

// const mapStateToProps = (state) => ({
// 	smallMenu: state.appState.smallMenu,
// 	drawer: state.settings.drawer
// })

// @Andrei
// please check if my useEffect deps are correct
const Toolbar = React.memo(props => {
	const smallMenu = useSelector(state => state.appState.smallMenu)
	const drawer = useSelector(state => state.settings.drawer)

	const [route, setRoute] = useState(props.route ? props.route : 0)
	const [tooltip, setTooltip] = useState(-1)
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		route: props.route ? props.route : 0,
	// 		tooltip: -1
	// 	}
	// }
	// componentWillUnmount = () => {
	// 	this._isMounted = 0
	// }

	// componentDidMount = () => {

	// 	this._isMounted = 1
	// }
	useEffect(() => {
		setRoute(props.route)
		setTooltip(-1)
	}, [props.route])
	// componentDidUpdate = (prevProps) => {
	// 	if (this.props.route !== prevProps.route && this.props.route !== undefined) {
	// 		this.setState({ route: this.props.route, tooltip: -1 })
	// 	}
	// }
	const handleTabsChange = (e, value) => {
		setRoute(value)
		// this.setState({ route: value })
	}

	const handleScroll = el => {
		let topOfElement = el.offsetTop - 130
		window.scroll({ top: topOfElement, behavior: 'smooth' })
	}
	const handleTooltipClose = () => {
		setTooltip(false)
		// this.setState({ tooltip: false });
	};

	// eslint-disable-next-line no-unused-vars
	const handleTooltipOpen = (id) => {
		setTooltip(id)
		// this.setState({ tooltip: id });
	};


	const { classes, tabs, dontShow, /* data, noSearch, filters, handleFilterKeyword, */ content, width, /*  hashLinks, */ } = props
	return (
		dontShow ? null :
			<div style={{ height: 48 }}>
				<AppBar classes={{
					root: cx({
						[classes.appBar]: true,
						[classes.appBarDrawerPermClosed]: !smallMenu && drawer === 'permanent',
						[classes.appBarDrawerPersClosed]: !smallMenu && drawer === 'persistent',
						[classes.appBarDrawerOpen]: smallMenu,
					})
				}}>
					{tabs ? <Tabs
						id={'tabs'} value={route} variant={width === 'xs' ? 'scrollable' : undefined} onChange={handleTabsChange} classes={{ fixed: classes.noOverflow, root: classes.noOverflow, indicator: classes.indicator }}>
						{tabs ? tabs.map((t, i) => {
							return <Tab
								key={i}
								onMouseEnter={e => setTooltip(t.id)}
								onMouseLeave={() => setTooltip(-1)}
								component={React.forwardRef((props, ref) => <Link {...props} ref={ref} scroll={handleScroll} /* style={{ color: '#fff' }} */ />)}
								value={t.id}
								smooth
								onClick={handleTooltipClose}
								classes={{ root: classes.tab }}
								label={<Tooltip open={tooltip === t.id ? true : false}
									disableFocusListener
									title={t.title}
									interactive
									enterDelay={500}
									leaveDelay={0}
								><div>{t.label}</div></Tooltip>}
								to={`${t.url}`} />


						}) : null}
					</Tabs> : null}
					{content ? <ToolBar classes={{ root: classes.contentToolbar }}>
						{content}
					</ToolBar> : null}
				</AppBar>
			</div>
	)
})

export default withWidth()(withStyles(styles)(Toolbar))
