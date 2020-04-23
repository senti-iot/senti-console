import React, { useState, Fragment } from 'react'
import { IconButton, Menu, MenuItem, Button, Tooltip } from '@material-ui/core'
import { ItemG } from 'components'
import { MoreVert } from 'variables/icons'
import { useLocalization } from 'hooks'
import { makeStyles } from '@material-ui/styles'

const styles = makeStyles(theme => ({
	leftIcon: {
		marginRight: 8
	}
}))

const Dropdown = props => {
	//Hooks
	const t = useLocalization()
	const classes = styles()

	//Redux

	//State
	const [actionAnchor, setActionAnchor] = useState(null)

	//Const
	const { menuItems, icon, button, divider, tooltip, buttonClassName, cIcon } = props

	//useCallbacks

	//useEffects

	//Handlers

	const handleOpenActionsDetails = event => {
		setActionAnchor(event.currentTarget)
	}

	const handleCloseActionsDetails = () => {
		setActionAnchor(null)
	}
	const handleMenuItemClick = (m) => e => {
		console.log(m)
		if (m.func) {
			m.func()
		}
		else {
			props.onChange(m.value)
		}
		handleCloseActionsDetails()
	}

	return (
		<Fragment>
			{button && <Button
				aria-label='More'
				aria-owns={actionAnchor ? 'long-menu' : null}
				aria-haspopup='true'
				style={{ color: 'rgba(0, 0, 0, 0.54)' }}
				onClick={handleOpenActionsDetails}>
				{icon ? icon : <MoreVert />}
			</Button>}
			{!button && <Tooltip title={tooltip ? tooltip : t('menus.menu')}>
				<IconButton
					aria-label='More'
					aria-owns={actionAnchor ? 'long-menu' : null}
					aria-haspopup='true'
					classes={{
						root: buttonClassName
					}}
					onClick={handleOpenActionsDetails}>
					{icon ? icon : <MoreVert />}
				</IconButton>
			</Tooltip>}
			<Menu
				id='long-menu'
				anchorEl={actionAnchor}
				open={Boolean(actionAnchor)}
				onClose={handleCloseActionsDetails}
				disablePortal
				disableScrollLock
				PaperProps={{ style: { minWidth: 200 } }}>
				{menuItems.map((m, i) => {
					if (m.dontShow)
						return null
					return <MenuItem divider={divider ? i === menuItems.length - 1 ? false : true : false} selected={m.selected} key={i}
						onClick={handleMenuItemClick(m)}>
						<ItemG container justify={'space-between'} alignItems={'center'}>
							{m.icon ? <ItemG style={{ display: 'flex', marginRight: 8 }}>{cIcon ? m.icon : <m.icon className={classes.leftIcon} />}</ItemG> : null}
							<ItemG xs>{m.label}</ItemG>
						</ItemG>
					</MenuItem>
				})}
			</Menu>
		</Fragment>
	)
}

export default Dropdown
