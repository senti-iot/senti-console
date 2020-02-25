import React from 'react'
import { IconButton, Tooltip } from '@material-ui/core';
import { useLocalization } from 'hooks';

const ITB = (props) => {
	const t = useLocalization()
	return (
		<Tooltip title={t(props.label)} classes={props.tooltipClasses}>
			<IconButton size={props.size} className={props.buttonClass} onClick={props.onClick} style={props.style}>
				{props.icon}
			</IconButton>
		</Tooltip>
	)
}

export default ITB
