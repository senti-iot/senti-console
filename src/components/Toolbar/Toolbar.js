

import React, { PureComponent } from 'react'
import { AppBar, Tabs, Tab, withStyles, Toolbar as ToolBar, withWidth, Grow } from '@material-ui/core';
// import Search from 'components/Search/Search';
// import { suggestionGen } from 'variables/functions'
import { NavHashLink as Link } from 'react-router-hash-link';
import { connect } from 'react-redux'
import { transition } from 'assets/jss/material-dashboard-react';
import cx from 'classnames'
// import inView from 'in-view'

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
		zIndex: 1300,
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
})

class Toolbar extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			route: props.route ? props.route : 0
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}

	componentDidMount = () => {

		this._isMounted = 1
	}
	componentDidUpdate = (prevProps) => {
		if (this.props.route !== prevProps.route) {
			this.setState({ route: this.props.route })
		}
	}
	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}

	handleScroll = el => {
		let topOfElement = el.offsetTop - 130
		window.scroll({ top: topOfElement, behavior: 'smooth' })
	}

	render() {
		const { classes, tabs, dontShow, /* data, noSearch, filters, handleFilterKeyword, */ content, width, hashLinks, smallMenu, drawer  } = this.props
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
						{tabs ? <Tabs TabIndicatorProps={{ style: { opacity: hashLinks ? 0 : 1 } }} id={'tabs'} value={this.state.route} variant={width === 'xs' ? 'scrollable' : undefined} onChange={this.handleTabsChange} classes={{ fixed: classes.noOverflow, root: classes.noOverflow }}>
							{tabs ? tabs.map((t, i) => {
								return <Tab title={t.title}
									component={(props) => <Grow in={true} timeout={i * 500}><Link {...props} scroll={this.handleScroll} style={{ color: '#fff' }} /></Grow>}
									value={t.id}
									key={i}
									smooth
									classes={{ root: classes.tab }}
									label={t.label}
									to={`${t.url}`} />	
							}) : null}
						</Tabs> : null}
						{/* {noSearch ? null : <Search
						right
						suggestions={data ? suggestionGen(data) : []}
						handleFilterKeyword={handleFilterKeyword}
						searchValue={filters.keyword} />} */}
						{content ? <ToolBar classes={{ root: classes.contentToolbar }}>
							{content}
						</ToolBar> : null}
					</AppBar>
				</div>

		)
	}
}
const mapStateToProps = (state) => ({
	smallMenu: state.appState.smallMenu,
	drawer: state.settings.drawer
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(withStyles(styles)(Toolbar)))
