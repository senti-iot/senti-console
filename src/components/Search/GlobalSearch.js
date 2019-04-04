import React from 'react';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import GlobalSearchInput from './GlobalSearchInput';
// import { ClickAwayListener } from '@material-ui/core';
import withLocalization from 'components/Localization/T';
import { connect } from 'react-redux'
import { changeEH } from 'redux/appState';
import globalSearchStyles from 'assets/jss/components/search/globalSearchStyles';
import { setSearchValue } from 'redux/globalSearch';
import { hist } from 'App';
import { T, ItemG } from 'components';
import { Grow, Hidden } from '@material-ui/core';
import { teal } from '@material-ui/core/colors';
// import { Typography } from '@material-ui/core';

function renderInput(inputProps) {
	return (
		<GlobalSearchInput {...inputProps} />
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

class GlobalSearch extends React.PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			value: '',
			suggestions: [],
			open: false
		}
		this.inputRef = React.createRef()

	}
	componentDidMount() {
		// if (this.props.focusOnMount && this.inputRef.current)
		// this.focusInput()
	}
	getSuggestions = (value, suggestions) => {
		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;
		const { t } = this.props
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
	handleResetSearch = () => {
		this.handleChange(null, { newValue: '' })
		this.handleSuggestionsClearRequested()
	}
	renderSectionTitle = (section) => {
		const { t } = this.props
		return (
			<MenuItem divider>
		  		<T style={{ margin: 8 }}>{t(`${section.title}`)}</T>
			</MenuItem>
		);
	}

	highlightWords = (value, query) => {
		const matches = match(value, query);
		const parts = parse(value, matches);
		return (
			parts.map((part, index) => {
				return part.highlight ? (
					<span key={String(index)} style={{ textDecoration: 'underline', color: teal[500] }}>
						{part.text}
					</span>
				) : (
					<span key={String(index)} style={{  }}>
						{part.text}
					</span>
				);
			})

		);
	}
	highlightParts = (values, query) => {
		let matches = []
		values.forEach(v => {
			if (v.value.includes(query)) {
				matches.push(v)
			}
		})
		return matches
	}
	handleOnSuggestionClicked = (path) => {
		hist.push(path)
	}
	renderSuggestion = (suggestion, { query, isHighlighted }) => {
		const { t, classes } = this.props
		let matches = this.highlightParts(suggestion.values, query)
		return (
			<MenuItem selected={isHighlighted} component='div' style={{ height: 'auto' }}>
				<ItemG container>
					<Hidden mdDown>
						<div style={{ padding: '8px 0px 16px 16px', display: 'flex', justifyContent: 'flex-end', alignItems: 'top', width: 100, maxWidth: 100 }}>
							<T>
								{this.highlightWords(t(`sidebar.${suggestion.type}`), query)}
							</T>
						</div>
						{/* <ItemG> */}
						<div style={{ margin: 8, width: 1, height: '90%', /* background: '#c5c5c5' */ }}/>
						{/* </ItemG> */}
					</Hidden>
					<div className={classes.suggestionTextContainer}>
						<Hidden smUp>
							<div className={classes.suggestionText}>
								<T>
									{this.highlightWords(t(`sidebar.${suggestion.type}`), query)}
								</T>
							</div>
						</Hidden>
						<div className={classes.suggestionText}>
							<T style={{ fontWeight: 500, fontSize: 15 }} noWrap>{this.highlightWords(suggestion.label, query)}</T>
						</div>
						<div className={classes.suggestionText}>
							{matches.map((m, i) => {
							// if (m.field === 'description')
							// console.log(m)
								return <T noWrap key={i}>
									{`${t(`${suggestion.type}s.fields.${m.field}`)}: `}{this.highlightWords(m.value, query)}{matches.length > 0 && i !== matches.length - 1 ? ', ' : ''}
								</T>
							})}
						</div>
					</div>
				</ItemG>
			</MenuItem>
		);
	}

	handleSuggestionsFetchRequested = ({ value, reason }) => {
		this.setState({
			suggestions: this.getSuggestions(value, this.props.suggestions),
		})
	}

	handleSuggestionsClearRequested = () => {
		this.setState({
			suggestions: [],
		})
	}

	handleChange = (event, { newValue }) => {
		this.props.setSearchVal(newValue)

	}

	focusInput = () => {
		this.props.disableEH()
		this.inputRef.current.focus()
	}

	getSectionSuggestions = (section) => {
		return section.suggestions;
	  }
	  
	render() {
		const { classes, right } = this.props;
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
				inputRef={this.inputRef}
				alwaysRenderSuggestions={false}
				focusInputOnSuggestionClick={false}
				renderInputComponent={renderInput}
				suggestions={this.state.suggestions}
				shouldRenderSuggestions={value => value.length > 2}
				onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
				onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
				onSuggestionSelected={(event, { suggestion }) => this.handleOnSuggestionClicked(suggestion.path)}
				renderSuggestionsContainer={renderSuggestionsContainer}
				getSuggestionValue={getSuggestionValue}
				renderSuggestion={this.renderSuggestion}
				renderSectionTitle={this.renderSectionTitle}
				getSectionSuggestions={this.getSectionSuggestions}
				onFocus={this.props.disableEH}
				onBlur={this.props.enableEH}
				inputProps={{
					onFocus: this.props.disableEH,
					onBlur: this.props.enableEH,
					noAbsolute: this.props.noAbsolute,
					placeholder: this.props.t('actions.src'),
					classes,
					// fullWidth: this.props.fullWidth,
					value: this.props.searchValue,
					onChange: this.handleChange,
					reference: this.inputRef.current,
					// open: this.state.open || this.props.open,
					// handleOpen: this.handleOpen,
					// handleClose: this.handleClose,
					handleResetSearch: this.handleResetSearch,
					t: this.props.t
				}}
			/>
		);
	}
}

const mapStateToProps = (state) => ({
	searchValue: state.globalSearch.searchVal,
	suggestions: state.globalSearch.suggestions
})

const mapDispatchToProps = dispatch => ({
	disableEH: () => dispatch(changeEH(false)),
	enableEH: () => dispatch(changeEH(true)),
	setSearchVal: val => dispatch(setSearchValue(val))
})

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(globalSearchStyles)(GlobalSearch)));