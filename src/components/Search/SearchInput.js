import React, { Component } from 'react';
import { Input, InputAdornment, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import searchStyles from 'assets/jss/components/search/searchStyles';
import { Search, Clear } from 'variables/icons'
import { ItemGrid } from 'components'
import className from 'classnames'


class SearchInput extends Component {
	render() {
		const { t, classes, ref, open, handleClose, handleOpen, handleResetSearch, ...other } = this.props;
		// console.log(ref, this.props.reference)
		return (
			<ItemGrid container noPadding alignItems={'center'} style={{ width: "auto", margin: 0 }}>

				<div className={className(classes.inputContainer, { [classes.inputContainerFocused]: this.props.open }, { [classes.inputContainerUnfocused]: !this.props.open })}>
					<Search className={className(classes.icon, { [classes.iconActive]: this.props.value !== '' ? true : false })} onClick={handleOpen}/>
					<Input
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
			</ItemGrid>
		)
	}
}
export default withStyles(searchStyles)(SearchInput)