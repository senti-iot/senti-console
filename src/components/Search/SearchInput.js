import React, { Component } from 'react';
import { /* TextField, */ Input, /* ClickAwayListener */ 
	InputAdornment,
	IconButton } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import searchStyles from 'assets/jss/components/search/searchStyles';
import { Search, Clear } from 'variables/icons'
import { ItemGrid } from '..';
import className from 'classnames'
// import withLocalization from '../Localization/T';
class SearchInput extends Component {
	// constructor(props) {
	//   super(props)
	
	//   this.state = {
	// 	 open: false
	//   }
	// }
	// focusInput = () => {
	// 	if (this.state.open)
	// 		this.props.reference.current.focus()
	// }
	// handleOpen = () => {

	// 	this.setState({ open: !this.state.open }, this.focusInput)

	// }	
	// handleClose = () => {
	// 	this.setState({ open: false })
	// }
	render() {
		const { t, classes, ref, open, handleClose, handleOpen, handleResetSearch, ...other } = this.props;
		return (
			<ItemGrid container noPadding alignItems={'center'} style={{ width: "auto", margin: 0 }}>
				{/* 	<ClickAwayListener onClickAway={this.handleClose}> */}

				<div className={className(classes.inputContainer, { [classes.inputContainerFocused]: this.props.open }, { [classes.inputContainerUnfocused]: !this.props.open })}>
					<Search className={className(classes.icon, { [classes.iconActive]: this.props.value !== '' ? true : false })} onClick={handleOpen}/>
					<Input
						// inputRef={this.inputRef}
						placeholder={t("filters.search")}
						inputRef={this.props.reference}
						onFocus={this.inputFocused}
						disableUnderline
						classes={{ input: classes.input, underline: classes.underline, root: classes.inputRoot }}
						{...other}
						endAdornment={
							 <InputAdornment position="end">
								<IconButton
									disableRipple
									classes={{
										root: classes.square
									}}
									onClick={handleResetSearch}
								>
									<Clear />
								</IconButton>
							</InputAdornment>
						}
					/>
				</div>
				{/*</ClickAwayListener>*/}
			</ItemGrid>
		)
	}
}
export default withStyles(searchStyles)(SearchInput)