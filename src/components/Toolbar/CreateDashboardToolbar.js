import React, { useState } from 'react'
import { AppBar, makeStyles, Toolbar as ToolBar, withWidth, IconButton, Divider, } from '@material-ui/core';
// import Search from 'components/Search/Search';
// import { suggestionGen } from 'variables/functions'
// import { connect } from 'react-redux'
import { transition } from 'assets/jss/material-dashboard-react';
import cx from 'classnames'
import { Menu } from 'variables/icons';
import ItemG from 'components/Grid/ItemG';
// import inView from 'in-view'

// UNUSED

const styles = makeStyles(theme => ({
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
}))

// @Andrei
const CDToolbar = React.memo(props => {
	const classes = styles()
	const [expand, setExpand] = useState(false) // added

	const expandToolbar = () => {
		setExpand(!expand)
		// this.setState({ expand: !this.state.expand })
	}

	const { children, dontShow } = props
	return (
		dontShow ? null :
			<AppBar classes={{
				root: cx({
					[classes.appBarDrawerOpen]: expand,
					[classes.appBar]: true,
				})
			}}>
				<ItemG xs={1} container alignItems="center" justify={'center'}>
					<IconButton onClick={expandToolbar} style={{ color: '#fff' }}>
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
})

export default withWidth()(CDToolbar)
