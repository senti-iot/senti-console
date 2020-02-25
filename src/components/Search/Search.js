/* eslint-disable indent */
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import searchStyles from 'assets/jss/components/search/searchStyles'
import SearchInput from './SearchInput'
import { ClickAwayListener } from '@material-ui/core'
// import withLocalization from 'components/Localization/T';
import { useDispatch } from 'react-redux'
import { changeEH } from 'redux/appState'

function renderInput(inputProps) {
	return <SearchInput {...inputProps} />
}


function renderSuggestionsContainer(options) {
	const { containerProps, children } = options
	return (
		<Paper {...containerProps} square>
			{children}
		</Paper>
	)
}

function getSuggestionValue(suggestion) {
	return suggestion.label
}

function getSuggestions(value, suggestions) {
	const inputValue = value.trim().toLowerCase()
	const inputLength = inputValue.length
	let count = 0

	return inputLength === 0
		? []
		: suggestions.filter(suggestion => {
			const keep =
				count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue

			if (keep) {
				count += 1
			}

			return keep
		})
}

// @Andrei
const IntegrationAutosuggest = React.memo(props => {
	//Hooks
	const dispatch = useDispatch()

	//Redux

	//State
	const [suggestions, setSuggestions] = useState([])
	const [open, setOpen] = useState(false)
	//Refs
	const inputRef = useRef(React.createRef())

	//Const

	//useCallbacks

	//useEffects

	//Handlers


	// const [value, setValue] = useState('')


	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		value: '',
	// 		suggestions: [],
	// 		open: false
	// 	}
	// 	this.inputRef = React.createRef()

	// }

	useEffect(() => {
		if (props.focusOnMount && inputRef.current) {
			focusInput()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount() {
	// 	if (this.props.focusOnMount && this.inputRef.current)
	// 		this.focusInput()
	// }

	const handleResetSearch = () => {
		handleChange(null, { newValue: '' })
	}

	const renderSuggestion = (suggestion, { query, isHighlighted }) => {
		const matches = match(suggestion.label, query)
		const parts = parse(suggestion.label, matches)
		return (
			<MenuItem selected={isHighlighted} component='div'>
				<div>
					{parts.map((part, index) => {
						return part.highlight ? (
							<span key={String(index)} style={{ fontWeight: 300, maxWidth: 'calc(100vw-100px)', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
								{part.text}
							</span>
						) : (
								<strong key={String(index)} style={{ fontWeight: 500 }}>
									{part.text}
								</strong>
							)
					})}
				</div>
			</MenuItem>
		)
	}

	const handleSuggestionsFetchRequested = ({ value, reason }) => {
		// const { open } = this.state
		const { searchValue } = props
		if (open && searchValue === '' && reason === 'escape-pressed') {
			handleClose()
		}
		setSuggestions(getSuggestions(value, props.suggestions))
		// this.setState({
		// 	suggestions: getSuggestions(value, this.props.suggestions),
		// })
	}

	const handleSuggestionsClearRequested = () => {
		setSuggestions([])
		// this.setState({
		// 	suggestions: [],
		// })
	}

	const handleChange = (event, { newValue }) => {
		props.handleFilterKeyword(newValue)
	}

	const focusInput = () => {
		if (open || props.open)
			inputRef.current.focus()
	}

	const handleOpen = () => {
		if (props.open === undefined)
			// TODO - not sure here
			setOpen(!open)
		focusInput()
		// this.setState({ open: !this.state.open }, this.focusInput)
	}

	const handleClose = () => {
		if (props.open === undefined)
			setOpen(false)
		// this.setState({ open: false })
	}


	const { classes, right } = props
	return (
		<div className={classes.suggestContainer}>
			<ClickAwayListener onClickAway={handleClose}>
				<Autosuggest
					theme={{
						container: classes.container + ' ' + (right ? classes.right : ''),
						suggestionsContainerOpen: classes.suggestionsContainerOpen,
						suggestionsList: classes.suggestionsList,
						suggestion: classes.suggestion,
					}}
					alwaysRenderSuggestions={true}
					focusInputOnSuggestionClick={false}
					renderInputComponent={renderInput}
					suggestions={suggestions}
					onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
					onSuggestionsClearRequested={handleSuggestionsClearRequested}
					onSuggestionSelected={focusInput}
					renderSuggestionsContainer={renderSuggestionsContainer}
					getSuggestionValue={getSuggestionValue}
					renderSuggestion={renderSuggestion}
					onFocus={() => dispatch(changeEH(false))}
					onBlur={() => dispatch(changeEH(true))}
					inputProps={{
						onFocus: () => dispatch(changeEH(false)),
						onBlur: () => dispatch(changeEH(true)),
						noAbsolute: props.noAbsolute,
						placeholder: props.placeholder,
						classes,
						fullWidth: props.fullWidth,
						value: props.searchValue,
						onChange: handleChange,
						reference: inputRef,
						open: open || props.open,
						handleOpen: handleOpen,
						handleClose: handleClose,
						handleResetSearch: handleResetSearch,
						// t: this.props.t
					}}
				/>
			</ClickAwayListener>
		</div>
	)
})

IntegrationAutosuggest.propTypes = {
	classes: PropTypes.object.isRequired,
	searchValue: PropTypes.string,
	// t: PropTypes.func.isRequired,
	suggestions: PropTypes.array.isRequired,
	handleFilterKeyword: PropTypes.func.isRequired,
}

export default withStyles(searchStyles)(IntegrationAutosuggest)