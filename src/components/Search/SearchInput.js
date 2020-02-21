import React from 'react';
import { Input, InputAdornment, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import searchStyles from 'assets/jss/components/search/searchStyles';
import { Search, Clear } from 'variables/icons'
import { ItemGrid } from 'components'
import className from 'classnames'
import { useLocalization } from 'hooks'

// @Andrei
// inputFocused is not defined
const SearchInput = props => {
	const t = useLocalization()
	const { noAbsolute, classes, /* ref, */ open, handleClose, handleOpen, handleResetSearch, fullWidth, ...other } = props;
	return (
		<ItemGrid container noPadding alignItems={'center'} style={{ width: fullWidth ? '100%' : 'auto', margin: 0 }}>
			<div className={className({ [classes.inputContainer]: !noAbsolute }, { [classes.inputContainerNoAbsolute]: noAbsolute }, { [fullWidth ? classes.inputContainerFullWidth : classes.inputContainerFocused]: props.open }, { [classes.inputContainerUnfocused]: !props.open })}>
				<Search className={className(classes.icon, { [classes.iconActive]: props.value !== '' ? true : false })} onClick={handleOpen} />
				<Input
					placeholder={t('filters.search')}
					inputRef={props.reference}
					// onFocus={inputFocused}
					disableUnderline
					classes={{ input: classes.input, underline: classes.underline, root: classes.inputRoot }}
					{...other}
					endAdornment={
						<InputAdornment position='end'>
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
export default withStyles(searchStyles)(SearchInput)