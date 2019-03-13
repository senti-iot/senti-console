import React from 'react';
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
		padding: theme.spacing.unit, 
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
		zIndex: 1050,
		marginTop: theme.spacing.unit,
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
		height: theme.spacing.unit * 2,
	},
});

class AddressInput extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			suggestions: [], 
		}
	}
	getSuggestionValue = s => s.value
	handleGetAdresses = async (query) => {
		if (query.length < 100)
			getAdresses(query).then(rs => {
				return rs ? this.setState({ suggestions: rs.map(a => ({ label: a.tekst, value: a.tekst, id: a.data.id })) }) : null
			})
	}
	getSuggestions = (string) => {
		const inputValue = deburr(string.trim()).toLowerCase();
		const inputLength = inputValue.length;
		let count = 0;
		return inputLength === 0
			? []
			: this.state.suggestions.filter(suggestion => {
				const keep =
					count < 5 && suggestion.value.slice(0, inputLength).toLowerCase() === inputValue;
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
	handleChange = (event, { newValue, method }) => {	
		this.setState({
			query: typeof newValue !== 'undefined' ? newValue : '',
		}, async () => {
			if (method !== 'down' && method !== 'up' && method !== null && method !== undefined)
				this.handleGetAdresses(newValue)
		});
		if (this.props.handleChange)
			this.props.handleChange(newValue) 
	};
	handleSuggestionSelected = (e, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
		return this.props.handleSuggestionSelected ? this.props.handleSuggestionSelected(suggestion) : null
	}
	renderInputComponent = (inputProps) => {
		const { classes, inputRef = () => { }, ref, ...other } = inputProps;
		return (
			<TextField
				variant={'outlined'}
				fullWidth={this.props.fullWidth}
				multiline
				margin='normal'
				InputProps={{
					inputRef: node => {
						ref(node);
						inputRef(node);
						this.input = node
					}
				}}
				{...other}
			/>
		);
	}

	renderSuggestion = (suggestion, { query, isHighlighted }) => {
		const matches = match(suggestion.label, query);
		const parts = parse(suggestion.label, matches);
		return (
			<Paper square classes={{ root: this.props.classes.listItem }} /* role={'option'} selected={isHighlighted} */>
				{parts.map((part, index) => {
					return part.highlight ? (
						<span key={String(index)} style={{ fontWeight: 500, color: this.props.theme.palette.type === 'dark' ? '#fff' : 'inherit' }}>
							{part.text}
						</span>
					) : (
						<strong key={String(index)} style={{ fontWeight: 300, color: this.props.theme.palette.type === 'dark' ? '#fff' : 'inherit' }}>
							{part.text}
						</strong>
					);
				})}
			</Paper>
		);
	}
	render() {
		const { classes } = this.props;
		const autosuggestProps = {
			renderInputComponent: this.renderInputComponent,
			suggestions: this.state.suggestions,
			onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
			onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
			onSuggestionSelected: this.handleSuggestionSelected,
			getSuggestionValue: this.getSuggestionValue,
			renderSuggestion: this.renderSuggestion,
		};
		return (
			<div className={classes.root}>
				<Autosuggest
					{...autosuggestProps}
					inputProps={{
						classes,
						label: this.props.t('orgs.fields.address'),
						value: this.props.value !== null ? this.props.value : '',
						onChange: this.handleChange,
						onClick: this.clearInput,
						onBlur: this.props.onBlur
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
}

AddressInput.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withLocalization()(withStyles(styles, { withTheme: true })(AddressInput));