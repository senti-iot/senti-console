import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import searchStyles from 'assets/jss/components/search/searchStyles';
import SearchInput from './SearchInput';
import { ClickAwayListener } from '@material-ui/core';
import withLocalization from 'components/Localization/T';

function renderInput(inputProps) {
	return (
		<SearchInput {...inputProps} />
	);
}


function renderSuggestionsContainer(options) {
	const { containerProps, children } = options;
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
			const keep =
				count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

			if (keep) {
				count += 1;
			}

			return keep;
		});
}

/**
* @augments {Component<{	
	searchValue:string,	
	suggestions:array.isRequired,	
	handleFilterKeyword:Function.isRequired,>}
*/
class IntegrationAutosuggest extends React.PureComponent {
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

	renderSuggestion(suggestion, { query, isHighlighted }) {
		const matches = match(suggestion.label, query);
		const parts = parse(suggestion.label, matches);
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
		this.props.handleFilterKeyword(newValue)
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
			<div className={classes.suggestContainer}>
				<ClickAwayListener onClickAway={this.handleClose}>
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
						suggestions={this.state.suggestions}
						onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
						onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
						onSuggestionSelected={this.focusInput}
						renderSuggestionsContainer={renderSuggestionsContainer}
						getSuggestionValue={getSuggestionValue}
						renderSuggestion={this.renderSuggestion}
						inputProps={{
							noAbsolute: this.props.noAbsolute,
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
				</ClickAwayListener>
			</div>
		);
	}
}

IntegrationAutosuggest.propTypes = {
	classes: PropTypes.object.isRequired,
	searchValue: PropTypes.string,
	t: PropTypes.func.isRequired,
	suggestions: PropTypes.array.isRequired,
	handleFilterKeyword: PropTypes.func.isRequired,
};

export default withLocalization()(withStyles(searchStyles)(IntegrationAutosuggest));