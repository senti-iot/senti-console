import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
// import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core'

function renderInputComponent(inputProps) {
	const { classes, inputRef = () => { }, ref, ...other } = inputProps;

	return (
		<TextField
			// 
			margin='normal'
			// className={classes.textField}
			InputProps={{
				inputRef: node => {
					ref(node);
					inputRef(node);
				}
			}}
			{...other}
		/>
	);
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
	const matches = match(suggestion.label, query);
	const parts = parse(suggestion.label, matches);

	return (
		<MenuItem selected={isHighlighted} component='div'>
			<div>
				{parts.map((part, index) => {
					return part.highlight ? (
						<span key={String(index)} style={{ fontWeight: 500 }}>
							{part.text}
						</span>
					) : (
						<strong key={String(index)} style={{ fontWeight: 300 }}>
							{part.text}
						</strong>
					);
				})}
			</div>
		</MenuItem>
	);
}


function getSuggestionValue(suggestion) {
	return suggestion.value;
}

const styles = theme => ({
	textField: {
		margin: theme.spacing.unit * 2
	},
	root: {
		flexGrow: 1,
	},
	container: {
		position: 'relative',
	},
	suggestionsContainerOpen: {
		position: 'absolute',
		zIndex: 1,
		marginTop: theme.spacing.unit,
		left: 0,
		right: 0,
	},
	suggestion: {
		display: 'block',
	},
	suggestionsList: {
		margin: 0,
		padding: 0,
		listStyleType: 'none',
	},
	divider: {
		height: theme.spacing.unit * 2,
	},
});

class EditOrgAutoSuggest extends React.Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 suggestions: []
	  }
	}
	
	getSuggestions = (value) => {
		const inputValue = deburr(value.trim()).toLowerCase();
		const inputLength = inputValue.length;
		let count = 0;
		return inputLength === 0
			? []
			: this.props.suggestions.filter(suggestion => {
				const keep =
					count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

				if (keep) {
					count += 1;
				}

				return keep;
			});
	}
	handleSuggestionsFetchRequested = ({ value }) => {
		this.setState({
			suggestions: this.getSuggestions(value),
		});
	};

	handleSuggestionsClearRequested = () => {
		this.setState({
			suggestions: [],
		});
	};
	clearInput = () => {
		this.setState({
			suggestions: [],
		});
	}
	handleChange = name => (event, { newValue }) => {
		// this.setState({
		// 	[name]: newValue,
		// });
		this.props.handleChange(newValue)
	};

	render() {
		const { classes } = this.props;

		const autosuggestProps = {
			renderInputComponent,
			suggestions: this.state.suggestions,
			onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
			onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
			getSuggestionValue,
			renderSuggestion,

		};
		return (
			<div className={classes.root}>
				<Autosuggest
					{...autosuggestProps}
					inputProps={{
						classes,
						error: this.props.error,
						label: this.props.t('orgs.fields.country'),
						value: this.props.country,
						onChange: this.handleChange(),
						onClick: this.clearInput
					}}
					theme={{
						container: classes.container,
						suggestionsContainerOpen: classes.suggestionsContainerOpen,
						suggestionsList: classes.suggestionsList,
						suggestion: classes.suggestion,
					}}
					renderSuggestionsContainer={options => (
						<Paper {...options.containerProps} square>
							{options.children}
						</Paper>
					)}
				/>
			</div>
		);
	}
}

EditOrgAutoSuggest.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditOrgAutoSuggest);