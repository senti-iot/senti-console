import React from 'react';
import PropTypes from 'prop-types';
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

function renderInput(inputProps) {
	return (
		<GlobalSearchInput {...inputProps} />
	);
}


function renderSuggestionsContainer(options) {
	const { containerProps, children } = options;
	console.log(children)
	return (
		<Paper {...containerProps} square>
			{children}
		</Paper>
	);
}

function getSuggestionValue(suggestion) {
	return suggestion.label;
}

function getSuggestions(value, suggestions) {
	const inputValue = value.trim().toLowerCase();
	const inputLength = inputValue.length;
	let count = 0;

	return inputLength === 0
		? []
		: suggestions.filter(suggestion => {
			let keep2 = false 
			suggestion.values.forEach(k => {
				
				if (k.toLowerCase().slice(0, inputLength) === inputValue) {
					keep2 = true
				}
			});
			const keep = count < 5 && keep2
			if (keep) {
				count += 1;
			}

			return keep;
		});
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
		if (this.props.focusOnMount && this.inputRef.current)
			this.focusInput()
	}

	handleResetSearch = () => {
		this.handleChange(null, { newValue: '' })
	}

	renderSuggestion = (suggestion, { query, isHighlighted }) => {
		const matches = match(suggestion.label, query);
		const parts = parse(suggestion.label, matches);
		return (
			<MenuItem selected={isHighlighted} component='div' onClick={() => hist.push(suggestion.path)}>
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
						);
					})}
				</div>
			</MenuItem>
		);
	}

	handleSuggestionsFetchRequested = ({ value, reason }) => {
		const { open } = this.state
		const { searchValue } = this.props
		if (open && searchValue === '' && reason === 'escape-pressed') {
			this.handleClose()
		}
		this.setState({
			suggestions: getSuggestions(value, this.props.suggestions),
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
		if (this.state.open || this.props.open)
			this.inputRef.current.focus()
	}

	handleOpen = () => {
		if (this.props.open === undefined)
			this.setState({ open: !this.state.open }, this.focusInput)
	}

	handleClose = () => {
		if (this.props.open === undefined)
			this.setState({ open: false })
	}

	render() {
		const { classes, right } = this.props;
		return (
			<Autosuggest
				theme={{
					container: classes.autosuggestContainer + ' ' + (right ? classes.right : ''),
					suggestionsContainerOpen: classes.suggestionsContainerOpen,
					suggestionsList: classes.suggestionsList,
					suggestion: classes.suggestion,
				}}
				alwaysRenderSuggestions={true}
				focusInputOnSuggestionClick={false}
				renderInputComponent={renderInput}
				suggestions={this.state.suggestions}
				onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
				onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
				// onSuggestionSelected={this.focusInput}
				renderSuggestionsContainer={renderSuggestionsContainer}
				getSuggestionValue={getSuggestionValue}
				renderSuggestion={this.renderSuggestion}
				onFocus={this.props.disableEH}
				onBlur={this.props.enableEH}
				inputProps={{
					onFocus: this.props.disableEH,
					onBlur: this.props.enableEH,
					noAbsolute: this.props.noAbsolute,
					placeholder: this.props.t('actions.src'),
					classes,
					fullWidth: this.props.fullWidth,
					value: this.props.searchValue,
					onChange: this.handleChange,
					reference: this.inputRef,
					open: this.state.open || this.props.open,
					handleOpen: this.handleOpen,
					handleClose: this.handleClose,
					handleResetSearch: this.handleResetSearch,
					t: this.props.t
				}}
			/>
			// </ClickAwayListener>
			// </div>
		);
	}
}

GlobalSearch.propTypes = {
	classes: PropTypes.object.isRequired,
	searchValue: PropTypes.string,
	t: PropTypes.func.isRequired,
	suggestions: PropTypes.array.isRequired,
	handleFilterKeyword: PropTypes.func.isRequired,
};
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