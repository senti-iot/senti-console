import React, { useState } from 'react'
import { ItemG } from 'components'
import { IconButton, Divider, makeStyles } from '@material-ui/core'
import ToolbarItem from './ToolbarItem'
import { Menu, InsertChart, MultiLineChart, Looks, TableChart } from 'variables/icons';
import cx from 'classnames'
const styles = makeStyles(theme => ({
	container: {
		background: 'teal',
		borderRadius: 4,
		padding: 4,
		margin: "0px 16px",
		maxHeight: 48,
		transition: 'all 300ms ease',
		height: 48,
		position: 'absolute',
		top: 8,
		width: 360
	},
	containerOpen: {
		maxHeight: 140,
		height: 140,
		transition: 'all 300ms ease'
	},
	toolbarItems: {
		width: 'auto',
		padding: '4px'
	},
	menuButton: {
		color: '#fff',
		borderRadius: 0
	}
}))

const ToolbarContainer = () => {

	//Hooks
	const classes = styles()

	//Redux

	//State
	const [toolbar, setToolbar] = useState(false)

	//Const
	const containerClasses = cx({
		[classes.container]: true,
		[classes.containerOpen]: toolbar,
	})
	//useCallbacks

	//useEffects

	//Handlers
	const handleChangeToolbar = () => {
		setToolbar(!toolbar)
	}
	return (
		<ItemG container className={containerClasses}>
			<IconButton size={'small'} className={classes.menuButton} onClick={handleChangeToolbar}>
				<Menu />
			</IconButton>
			<Divider style={{ width: 2, height: '100%' }} />
			<ItemG container spacing={1} justify={'center'} className={classes.toolbarItems}>

				<ToolbarItem type={"chart"} name={'Chart'} icon={InsertChart} />
				<ToolbarItem type={"msChart"} name={'Multi Source Chart'} icon={MultiLineChart} />
				<ToolbarItem type={"gauge"} name={'Gauge'} icon={Looks} />
				<ToolbarItem type={"scorecard"} name={'Scorecard'} icon={TableChart} />
			</ItemG>
			{/* <ToolbarItem type={"map"} name={'Map'} /> */}

		</ItemG>
	)
}

export default ToolbarContainer
