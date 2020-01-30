import React, { useState, Fragment } from 'react'
import { IconButton, Menu, MenuItem, Button, Tooltip } from '@material-ui/core';
import { ItemG } from 'components';
import { MoreVert } from 'variables/icons';
import withLocalization from 'components/Localization/T';
import { useLocalization } from 'hooks';

const Dropdown = props => {
	const t = useLocalization()
	const [actionAnchor, setActionAnchor] = useState(null)
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		actionAnchor: null
	// 	}
	// }

	const handleOpenActionsDetails = event => {
		setActionAnchor(event.currentTarget)
		// this.setState({ actionAnchor: event.currentTarget });
	}

	const handleCloseActionsDetails = () => {
		setActionAnchor(null)
		// this.setState({ actionAnchor: null });
	}
	const handleMenuItemClick = (m) => e => {
		if (m.func) {
			m.func()
		}
		else {
			props.onChange(m.value)
		}
		handleCloseActionsDetails()
	}
	// const { actionAnchor } = this.state
	const { menuItems, icon, button, divider, tooltip, buttonClassName } = props
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
				PaperProps={{ style: { minWidth: 200 } }}>
				{menuItems.map((m, i) => {
					if (m.dontShow)
						return null
					return <MenuItem divider={divider ? i === menuItems.length - 1 ? false : true : false} selected={m.selected} key={i}
						onClick={handleMenuItemClick(m)}>
						<ItemG container justify={'space-between'} alignItems={'center'}>
							{m.icon ? <ItemG style={{ display: 'flex', marginRight: 8 }}>{m.icon}</ItemG> : null}
							<ItemG xs>{m.label}</ItemG>
						</ItemG>
					</MenuItem>
				})}
			</Menu>
		</Fragment>
	)
}

export default withLocalization()(Dropdown)
