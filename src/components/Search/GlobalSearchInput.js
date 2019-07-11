import React, { Component } from 'react';
import { Input, InputAdornment, IconButton, ClickAwayListener, /* InputAdornment, IconButton */ } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Search, Clear, /* Clear */ } from 'variables/icons'
import { /* ItemGrid, */ ItemG } from 'components'
import cx from 'classnames'
import globalSearchStyles from 'assets/jss/components/search/globalSearchStyles';


class GlobalSearchInput extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 focused: false
	  }
	}
	onClickAway = () => {
		this.setState({ focused: false })
	}
	onBlurInput = () => {
		// this.setState({ focused: false })
		this.props.inputProps.onBlur()
	}
	onFocusInput = () => {
		this.setState({ focused: true })
		this.props.inputProps.onFocus()
	}
	render() {
		const { noAbsolute, t, ref, handleResetSearch, reference, onFocus, onBlur, ...other } = this.props.inputProps;
		let { classes, refCallback } = this.props
		return (
			<ClickAwayListener onClickAway={this.onClickAway}>

				<ItemG container alignItems={'center'}>
					<div className={cx(classes.container, { [classes.containerActive]: this.state.focused })}>
						<div className={classes.searchIcon}>
							<Search onClick={this.onFocusInput}/>
						</div>
						<Input
							placeholder={t('filters.search')}
							inputRef={ref => {
								reference(ref)
								refCallback(ref)
							}}
							onFocus={this.onFocusInput}
							onBlur={this.onBlurInput}
							disableUnderline
							// autoFocus={false}
							classes={{ input: classes.input, underline: classes.underline, root: classes.inputRoot }}
							// {...other}
							{...other}
							endAdornment={
								this.state.focused ?
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
	}
}
export default withStyles(globalSearchStyles)(GlobalSearchInput)