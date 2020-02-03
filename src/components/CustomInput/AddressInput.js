import React, { useState } from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core'
import { getAdresses } from 'variables/dataDevices';
import withLocalization from 'components/Localization/T';
import teal from '@material-ui/core/colors/teal'

const styles = theme => ({
	listItem: {
		padding: theme.spacing(1),
		cursor: 'pointer',
		'&:hover': {
			background: theme.palette.type === 'dark' ? "#333" : teal[500],
			color: '#fff'
		},
		boxShadow: 'none'
	},
	paperMenu: {
		zIndex: 1040,
		maxWidth: 300,
		maxHeight: 200,
		overflow: 'auto'
	},
	textField: {
		margin: theme.spacing(2)
	},
	root: {
		flexGrow: 1,
	},
	container: {
		position: 'relative',
	},
	suggestionsContainerOpen: {
		position: 'absolute',
		zIndex: 1050,
		marginTop: theme.spacing(1),
		left: 0,
		right: 0,
	},
	suggestion: {
	},
	suggestionsList: {
		maxHeight: 200,
		margin: 0,
		padding: 0,
		listStyleType: 'none',
	},
	divider: {
		height: theme.spacing(2),
	},
});

const AddressInput = props => {
	const [suggestions, setSuggestions] = useState([])
	const [query, setQuery] = useState(null) // added

	const getSuggestionValue = s => s.value
	const handleGetAdresses = async (query) => {
		if (query.length < 100)
			getAdresses(query).then(rs => {
				return rs ? setSuggestions(rs.map(a => ({ label: a.tekst, value: a.tekst, id: a.data.id }))) : null
			})
	}
	const getSuggestions = (string) => {
		const inputValue = deburr(string.trim()).toLowerCase();
		const inputLength = inputValue.length;
		let count = 0;
		return inputLength === 0
			? []
			: suggestions.filter(suggestion => {
				const keep =
					count < 5 && suggestion.value.slice(0, inputLength).toLowerCase() === inputValue;
				if (keep) {
					count += 1;
				}
				return keep;
			});
	}
	const handleSuggestionsFetchRequested = ({ value }) => {
		setSuggestions(getSuggestions(value))
		// this.setState({
		// 	suggestions: this.getSuggestions(value),
		// });
	};

	const handleSuggestionsClearRequested = () => {
		setSuggestions([])
		// this.setState({
		// 	suggestions: [],
		// });
	};
	const clearInput = () => {
		setSuggestions([])
		// this.setState({
		// 	suggestions: [],
		// });
	}
	const handleChange = (event, { newValue, method }) => {
		// TODO
		setQuery(typeof newValue !== undefined ? newValue : '', async () => {
			if (method !== 'down' && method !== 'up' && method !== null && method !== undefined)
				handleGetAdresses(newValue)
		})
		// TODO
		// this.setState({
		// 	query: typeof newValue !== 'undefined' ? newValue : '',
		// }, async () => {
		// 	if (method !== 'down' && method !== 'up' && method !== null && method !== undefined)
		// 		handleGetAdresses(newValue)
		// });
		if (props.handleChange)
			props.handleChange(newValue)
	};
	const handleSuggestionSelected = (e, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
		return props.handleSuggestionSelected ? props.handleSuggestionSelected(suggestion) : null
	}
	const renderInputComponent = (inputProps) => {
		const { classes, inputRef = () => { }, ref, ...other } = inputProps;
		return (
			<TextField
				variant={'outlined'}
				fullWidth={props.fullWidth}
				multiline
				margin='normal'
				InputProps={{
					inputRef: node => {
						ref(node);
						inputRef(node);
						// TODO
						// input = node
					}
				}}
				{...other}
			/>
		);
	}

	const renderSuggestion = (suggestion, { query, isHighlighted }) => {
		const matches = match(suggestion.label, query);
		const parts = parse(suggestion.label, matches);
		return (
			<Paper square classes={{ root: props.classes.listItem }} /* role={'option'} selected={isHighlighted} */>
				{parts.map((part, index) => {
					return part.highlight ? (
						<span key={String(index)} style={{ fontWeight: 500, color: props.theme.palette.type === 'dark' ? '#fff' : 'inherit' }}>
							{part.text}
						</span>
					) :
						(<strong key={String(index)} style={{ fontWeight: 300, color: props.theme.palette.type === 'dark' ? '#fff' : 'inherit' }}>
							{part.text}
						</strong>
						);
				})}
			</Paper>
		);
	}
	const { classes } = props;
	const autosuggestProps = {
		renderInputComponent,
		suggestions,
		onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
		onSuggestionsClearRequested: handleSuggestionsClearRequested,
		onSuggestionSelected: handleSuggestionSelected,
		getSuggestionValue,
		renderSuggestion,
	};
	return (
		<div className={classes.root}>
			<Autosuggest
				{...autosuggestProps}
				inputProps={{
					classes,
					label: props.t('orgs.fields.address'),
					value: props.value !== null ? props.value : '',
					onChange: handleChange,
					onClick: clearInput,
					onBlur: props.onBlur
				}}
				theme={{
					container: classes.container,
					suggestionsContainerOpen: classes.suggestionsContainerOpen,
					suggestionsList: classes.suggestionsList,
					suggestion: classes.suggestion,
				}}
				renderSuggestionsContainer={options => (
					<Paper {...options.containerProps} classes={{ root: classes.paperMenu }}>
						{options.children}
					</Paper>
				)}
			/>
		</div>
	);
}

AddressInput.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withLocalization()(withStyles(styles, { withTheme: true })(AddressInput));