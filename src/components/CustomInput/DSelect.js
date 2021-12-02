import React, { useRef, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { FormControl, Select, MenuItem, InputLabel, OutlinedInput, FormHelperText } from '@material-ui/core';
import { ItemG } from 'components';
import { useTheme } from '@material-ui/styles';


const DSelect = props => {
	//Hooks
	const theme = useTheme()

	//Redux

	//State
	let inputRef = useRef(null)
	const [labelWidth, setLabelWidth] = useState(0)

	//Const
	const { error, helperText, value, onKeyPress, margin, onChange, simple, menuItems, label, fullWidth, leftIcon, readOnly } = props
	let mobile = window.innerWidth < theme.breakpoints.values.md ? true : false

	//useCallbacks

	//useEffects
	useEffect(() => {
		setLabelWidth(ReactDOM.findDOMNode(inputRef.current).offsetWidth)

	}, [])
	//Handlers

	const getLabelWidth = () => {
		if (inputRef.current) {
			return labelWidth
		}
		else {
			return 0
		}
	}

	return (
		<FormControl variant="outlined" margin={margin} fullWidth={mobile || fullWidth} style={props.style}>
			<InputLabel ref={inputRef}
				color={'primary'} htmlFor='select-multiple-chip'>
				{label}
			</InputLabel>
			<Select
				readOnly={readOnly}
				variant={'outlined'}
				fullWidth={mobile || fullWidth}
				value={value}
				error={error}
				onChange={onChange}
				input={<OutlinedInput labelWidth={getLabelWidth()} variant={'outlined'} />}
				style={{ width: fullWidth ? null : 230 }}
				onKeyPress={onKeyPress}
			>
				{!simple && menuItems.map((m, i) => {
					if (m.dontShow)
						return null
					return <MenuItem key={i} value={m.value} >
						<ItemG container justify={'space-between'} alignItems={'center'}>
							{leftIcon ? <ItemG style={{ display: 'flex', marginRight: 8 }}>{m.icon ? m.icon : null}</ItemG> : null}
							<ItemG xs style={{ overflow: 'hidden', textOverflow: fullWidth ? null : 'ellipsis' }}>{m.label}</ItemG>
							{!leftIcon ? <ItemG>{m.icon ? m.icon : null}</ItemG> : null}
						</ItemG>
					</MenuItem>
				})}
				{simple && menuItems.map((m, i) => {
					if (m.dontShow)
						return null
					return <MenuItem key={i} value={m}>
						<ItemG container justify={'space-between'} alignItems={'center'}>
							<ItemG xs>{m}</ItemG>
						</ItemG>
					</MenuItem>
				})}
			</Select>
			{helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
		</FormControl>
	)

}

export default DSelect