/* eslint-disable indent */
import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import GlobalSearchInput from './GlobalSearchInput';
// import { ClickAwayListener } from '@material-ui/core';
// import withLocalization from 'components/Localization/T';
import { useDispatch, useSelector } from 'react-redux'
import { changeEH } from 'redux/appState';
import globalSearchStyles from 'assets/jss/components/search/globalSearchStyles';
import { setSearchValue } from 'redux/globalSearch';
import { hist } from 'Providers';
import { T, ItemG } from 'components';
import { Grow, Hidden } from '@material-ui/core';
import { teal } from '@material-ui/core/colors';
import { useLocalization } from 'hooks'
// import { Typography } from '@material-ui/core';

function renderInput(inputProps) {
	return (
		<GlobalSearchInput inputProps={inputProps} refCallback={inputProps.ref} ref={null} />
	);
}


function renderSuggestionsContainer(options) {
	const { containerProps, children } = options;
	return (
		<Paper {...containerProps}>
			{children ? children.map((c, i) => {
				return <Grow key={i} in={true} timeout={i * 400}>
					{c}
				</Grow>
			}) : null}
		</Paper>
	);
}

function getSuggestionValue(suggestion) {
	return suggestion.label;
}

// const mapStateToProps = (state) => ({
// 	searchValue: state.globalSearch.searchVal,
// 	suggestions: state.globalSearch.suggestions
// })

// const mapDispatchToProps = dispatch => ({
// 	disableEH: () => dispatch(changeEH(false)),
// 	enableEH: () => dispatch(changeEH(true)),
// 	setSearchVal: val => dispatch(setSearchValue(val))
// })

// @Andrei
const GlobalSearch = React.memo(props => {
	const t = useLocalization()
	const dispatch = useDispatch()
	const searchValue = useSelector(state => state.globalSearch.searchVal)
	const suggestions = useSelector(state => state.globalSearch.suggestions)

	// const [value, setValue] = useState('')
	const [stateSuggestions, setStateSuggestions] = useState([])
	// const [open, setOpen] = useState(false)

	let inputRef = null

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		value: '',
	// 		suggestions: [],
	// 		open: false
	// 	}
	// 	this.inputRef = null

	// }
	// shouldComponentUpdate(nextProps, nextState) {
	// 	if (nextProps.suggestions !== this.props.suggestions) {
	// 		return true
	// 	}
	// 	return false
	// }

	// componentDidMount() {
	// 	// if (this.props.focusOnMount && this.inputRef.current)
	// 	// this.focusInput()
	// }
	const getSuggestions = (value, suggestions) => {
		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;
		// const { t } = this.props
		// let count = 0;
		return inputLength < 3 ? []
			: suggestions.map(section => {
				return {
					title: section.title,
					suggestions: section.suggestions.filter(l => {
						let keep2 = false
						l.values.forEach(v => {
							if (v.value.toLowerCase().includes(inputValue.toLowerCase())) {
								keep2 = true
							}
							if (t(`sidebar.${l.type}`).toLowerCase().includes(inputValue.toLowerCase())) {
								keep2 = true
							}
						})
						if (keep2 === true) {
							keep2 = false
							return true
						}
						else {
							return false
						}
					})
				};
			}).filter(section => section.suggestions.length > 0);
	}
	const handleResetSearch = () => {
		handleChange(null, { newValue: '' })
		handleSuggestionsClearRequested()
	}
	const renderSectionTitle = (section) => {
		// const { t } = this.props
		return (
			<MenuItem divider>
				<T style={{ margin: 8 }}>{t(`${section.title}`)}</T>
			</MenuItem>
		);
	}

	const highlightWords = (value, query) => {
		const matches = match(value, query);
		const parts = parse(value, matches);
		return (
			parts.map((part, index) => {
				return part.highlight ? (
					<span key={String(index)} style={{ textDecoration: 'underline', color: teal[500] }}>
						{part.text}
					</span>
				) : (
						<span key={String(index)} style={{}}>
							{part.text}
						</span>
					);
			})

		);
	}
	const highlightParts = (values, query) => {
		let matches = []
		values.forEach(v => {
			if (v.value.includes(query)) {
				matches.push(v)
			}
		})
		return matches
	}
	const handleOnSuggestionClicked = (path) => {
		handleResetSearch()
		hist.push(path)
	}
	const renderSuggestion = (suggestion, { query, isHighlighted }) => {
		const { classes } = props
		let matches = highlightParts(suggestion.values, query)
		return (
			<MenuItem selected={isHighlighted} component='div' style={{ height: 'auto' }}>
				<ItemG container>
					<Hidden mdDown>
						<div style={{ padding: '8px 0px 16px 16px', display: 'flex', justifyContent: 'flex-end', alignItems: 'top', width: 100, maxWidth: 100 }}>
							<T>
								{highlightWords(t(`sidebar.${suggestion.type}`), query)}
							</T>
						</div>
						{/* <ItemG> */}
						<div style={{ margin: 8, width: 1, height: '90%', /* background: '#c5c5c5' */ }} />
						{/* </ItemG> */}
					</Hidden>
					<div className={classes.suggestionTextContainer}>
						<Hidden smUp>
							<div className={classes.suggestionText}>
								<T>
									{highlightWords(t(`sidebar.${suggestion.type}`), query)}
								</T>
							</div>
						</Hidden>
						<div className={classes.suggestionText}>
							<T style={{ fontWeight: 500, fontSize: 15 }} noWrap>{highlightWords(suggestion.label, query)}</T>
						</div>
						<div className={classes.suggestionText}>
							{matches.map((m, i) => {
								return <T noWrap key={i}>
									{`${t(`${suggestion.type}s.fields.${m.field}`)}: `}{highlightWords(m.value, query)}{matches.length > 0 && i !== matches.length - 1 ? ', ' : ''}
								</T>
							})}
						</div>
					</div>
				</ItemG>
			</MenuItem>
		);
	}

	const handleSuggestionsFetchRequested = ({ value, reason }) => {
		setStateSuggestions(getSuggestions(value, suggestions))
		// this.setState({
		// 	suggestions: this.getSuggestions(value, this.props.suggestions),
		// })
	}

	const handleSuggestionsClearRequested = () => {
		setStateSuggestions([])
		// this.setState({
		// 	suggestions: [],
		// })
	}

	const handleChange = (event, { newValue }) => {
		dispatch(setSearchValue(newValue))
		// this.props.setSearchVal(newValue)

	}

	// const focusInput = () => {
	// 	dispatch(changeEH(false))
	// 	// this.props.disableEH()
	// 	// this.inputRef.focus()
	// }

	const getSectionSuggestions = (section) => {
		return section.suggestions;
	}

	const onFocusInput = () => {
		dispatch(changeEH(false))
		// this.props.disableEH()
	}

	const { classes, right } = props;
	return (
		<Autosuggest
			id={'global-search'}
			theme={{
				container: classes.autosuggestContainer + ' ' + (right ? classes.right : ''),
				suggestionsContainer: classes.suggestionsContainer,
				suggestionsContainerOpen: classes.suggestionsContainerOpen,
				suggestionsList: classes.suggestionsList,
				suggestion: classes.suggestion,
			}}
			multiSection={true}
			inputRef={inputRef}
			alwaysRenderSuggestions={false}
			focusInputOnSuggestionClick={false}
			renderInputComponent={renderInput}
			suggestions={stateSuggestions}
			shouldRenderSuggestions={value => value.length > 2}
			onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
			onSuggestionsClearRequested={handleSuggestionsClearRequested}
			onSuggestionSelected={(event, { suggestion }) => handleOnSuggestionClicked(suggestion.path)}
			renderSuggestionsContainer={renderSuggestionsContainer}
			getSuggestionValue={getSuggestionValue}
			renderSuggestion={renderSuggestion}
			renderSectionTitle={renderSectionTitle}
			getSectionSuggestions={getSectionSuggestions}
			onFocus={() => dispatch(changeEH(false))}
			onBlur={() => dispatch(changeEH(true))}
			inputProps={{
				onFocus: onFocusInput,
				onBlur: () => dispatch(changeEH(true)),
				noAbsolute: props.noAbsolute,
				placeholder: t('actions.src'),
				// classes,
				// fullWidth: this.props.fullWidth,
				value: searchValue,
				onChange: handleChange,
				reference: ref => inputRef = ref,
				// open: this.state.open || this.props.open,
				// handleOpen: this.handleOpen,
				// handleClose: this.handleClose,
				handleResetSearch: handleResetSearch,
				t: t
			}}
		/>
	);
})

export default withStyles(globalSearchStyles)(GlobalSearch)