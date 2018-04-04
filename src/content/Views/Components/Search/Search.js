import React from 'react'
import { Icon } from 'odeum-ui'
import { SearchContainer, Input } from './SearchStyles'


export const renderSearchOption = (searchString, handleFocusInput, inputFocus, createInputRef, handleSearch) => {
	return <SearchContainer onClick={handleFocusInput(true)} active={inputFocus}>
		<Icon icon={'search'} iconSize={20} style={{ margin: 3, paddingRight: 3, borderRight: '1px solid #cecece' }} />
		<Input innerRef={createInputRef} onChange={handleSearch} value={searchString} onBlur={() => inputFocus ? handleFocusInput(false) : null} />
	</SearchContainer>
}