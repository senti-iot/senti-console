

import React, { PureComponent } from 'react'
import { AppBar, withStyles, Toolbar as ToolBar, withWidth, IconButton, Divider, } from '@material-ui/core';
// import Search from 'components/Search/Search';
// import { suggestionGen } from 'variables/functions'
import { connect } from 'react-redux'
import { transition } from 'assets/jss/material-dashboard-react';
import cx from 'classnames'
import { Menu } from 'variables/icons';
import ItemG from 'components/Grid/ItemG';
// import inView from 'in-view'

const styles = theme => ({
	appBarDrawerOpen: {
		height: '200px !important',
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
		position: "sticky",
		top: 70,
		[theme.breakpoints.down('xs')]: {
			top: 48
		},
		// [theme.breakpoints.up('lg')]: {

		// },
		display: 'flex',
		flexFlow: 'row',
		maxWidth: '100%',
		overflow: 'visible',
		minHeight: 48,
		height: 48,
		zIndex: 900,
		boxShadow: 'none',
		...transition
	},
	contentToolbar: {
		padding: 4,
		height: 41,
		minHeight: 41,
		maxHeight: 41,
		// paddingLeft: 0,
	},
	noOverflow: {
		overflow: 'hidden'
	},
})

class CDToolbar extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			route: props.route ? props.route : 0,
			tooltip: -1
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}

	componentDidMount = () => {

		this._isMounted = 1
	}
	componentDidUpdate = (prevProps) => {
		if (this.props.route !== prevProps.route && this.props.route !== undefined) {
			this.setState({ route: this.props.route, tooltip: -1 })
		}
	}
	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}

	handleScroll = el => {
		let topOfElement = el.offsetTop - 130
		window.scroll({ top: topOfElement, behavior: 'smooth' })
	}
	handleTooltipClose = () => {
		this.setState({ tooltip: false });
	};

	handleTooltipOpen = (id) => {
		this.setState({ tooltip: id });
	};
	expandToolbar = () => {
		this.setState({ expand: !this.state.expand })
	}
	render() {
		const { classes, children, dontShow } = this.props
		const { expand } = this.state
		return (
			dontShow ? null :
				<AppBar classes={{
					root: cx({
						[classes.appBarDrawerOpen]: expand,
						[classes.appBar]: true,
					})
				}}>
					<ItemG xs={1} container alignItems="center" justify={'center'}>
						<IconButton onClick={this.expandToolbar} style={{ color: '#fff' }}>
							<Menu />
						</IconButton>
					</ItemG>
					<Divider style={{ width: 2, height: '100%' }} />
					<ItemG xs>
						{children ? <ToolBar classes={{
							root:
								cx({
									[classes.appBarDrawerOpen]: expand,
									[classes.contentToolbar]: true,
								})
						}}>
							{children}
						</ToolBar> : null}
					</ItemG>
				</AppBar>

		)
	}
}
const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(withStyles(styles)(CDToolbar)))
