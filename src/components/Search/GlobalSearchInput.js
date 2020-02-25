import React, { useState } from 'react';
import { Input, InputAdornment, IconButton, ClickAwayListener, /* InputAdornment, IconButton */ } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Search, Clear, /* Clear */ } from 'variables/icons'
import { /* ItemGrid, */ ItemG } from 'components'
import cx from 'classnames'
import globalSearchStyles from 'assets/jss/components/search/globalSearchStyles';


const GlobalSearchInput = React.memo(props => {
	const [focused, setFocused] = useState(false)
	// constructor(props) {
	//   super(props)

	//   this.state = {
	// 	 focused: false
	//   }
	// }
	const onClickAway = () => {
		setFocused(false)
		// this.setState({ focused: false })
	}
	const onBlurInput = () => {
		// this.setState({ focused: false })
		props.inputProps.onBlur()
	}
	const onFocusInput = () => {
		setFocused(true)
		// this.setState({ focused: true })
		props.inputProps.onFocus()
	}

	const { noAbsolute, t, ref, handleResetSearch, reference, onFocus, onBlur, ...other } = props.inputProps;
	let { classes, refCallback } = props
	return (
		<ClickAwayListener onClickAway={onClickAway}>

			<ItemG container alignItems={'center'}>
				<div className={cx(classes.container, { [classes.containerActive]: focused })}>
					<div className={classes.searchIcon}>
						<Search onClick={onFocusInput} />
					</div>
					<Input
						placeholder={t('filters.search')}
						inputRef={ref => {
							reference(ref)
							refCallback(ref)
						}}
						onFocus={onFocusInput}
						onBlur={onBlurInput}
						disableUnderline
						// autoFocus={false}
						classes={{ input: classes.input, underline: classes.underline, root: classes.inputRoot }}
						// {...other}
						{...other}
						endAdornment={
							focused ?
								<InputAdornment position='end' className={classes.adornment} style={{ opacity: other.value.length > 0 ? 1 : 0 }}>
									<IconButton
										disableTouchRipple
										disableRipple
										classes={{
											root: classes.square
										}}
										onClick={handleResetSearch}
									>
										<Clear />
									</IconButton>
								</InputAdornment> : null

						}
					/>
				</div>
			</ItemG>
		</ClickAwayListener>
	)
})

export default withStyles(globalSearchStyles)(GlobalSearchInput)