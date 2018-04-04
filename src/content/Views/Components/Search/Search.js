import React, { Component } from 'react'
import { Icon } from 'odeum-ui'
import { SearchContainer, Input } from './SearchStyles'


export const renderSearchOption = (searchString, handleFocusInput, inputFocus, createInputRef, handleSearch) => {
	return <SearchContainer onClick={handleFocusInput(true)} active={inputFocus}>
		<Icon icon={'search'} iconSize={20} style={{ margin: 3, paddingRight: 3, borderRight: '1px solid #cecece' }} />
		<Input innerRef={createInputRef} onChange={handleSearch} value={searchString} style={{ color: 'black' }} onBlur={() => inputFocus ? handleFocusInput(false) : null} />
	</SearchContainer>
}


export default class SearchComponent extends Component {
	constructor(props) {
		super(props)

		this.state = {
			inputFocus: false,
			searchString: ''
		}
	}

	handleSearch = () => {
		this.props.handleSearch(this.state.searchString)
	}

	handleInputChange = e => {
		this.setState({ searchString: e.target.value })
		if (e.target.value === '')
			this.props.handleSearch('')
	}
	handleKeyPress = e => {
		console.log(e.key)
		switch (e.key) {
			case 'Enter':
				this.props.handleSearch(this.state.searchString)
				break
			case 'Escape':
				this.setState({ searchString: '' })
				this.props.handleSearch('')
				break
			default:
				break
		}

	}
	createInputRef = (node) => {
		this.node = node
	}
	handleFocusInput = (focus) => e => {
		e.preventDefault()
		this.node.focus()
		this.setState({ inputFocus: focus })
	}
	render() {
		const { inputFocus, searchString } = this.state
		const { handleFocusInput, createInputRef } = this
		return (
			<SearchContainer onClick={handleFocusInput(true)} active={inputFocus}>
				<Icon icon={'search'} iconSize={20} style={{ margin: 3, paddingRight: 3, borderRight: '1px solid #cecece' }} />
				<Input innerRef={createInputRef}
					style={{ color: 'black' }}
					value={searchString}
					onChange={this.handleInputChange}
					onBlur={() => inputFocus ? handleFocusInput(false) : null}
					onKeyDown={this.handleKeyPress} />
			</SearchContainer>
		)
	}
}
