import React, { Component } from 'react';
import { Input, /* InputAdornment, IconButton */ } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Search, /* Clear */ } from 'variables/icons'
import { /* ItemGrid, */ ItemG } from 'components'
// import className from 'classnames'
import globalSearchStyles from 'assets/jss/components/search/globalSearchStyles';


class GlobalSearchInput extends Component {
	render() {
		const { noAbsolute, t, classes, ref, open, handleClose, handleOpen, handleResetSearch, fullWidth,  ...other } = this.props;
		return (
			<ItemG container alignItems={'center'}>
				<div className={classes.container}>
					<div className={classes.searchIcon}>
						<Search />
					</div>
					<Input
						placeholder={t('filters.search')}
						inputRef={this.props.reference}
						onFocus={this.inputFocused}
						disableUnderline
						autoFocus={false}
						classes={{ input: classes.input, underline: classes.underline, root: classes.inputRoot }}
						{...other}
					/>
				</div>
			</ItemG>
		)
	}
}
export default withStyles(globalSearchStyles)(GlobalSearchInput)