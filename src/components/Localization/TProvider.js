import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { changeLanguage } from 'redux/localization';
import ReactMarkdown from 'react-markdown'
var replace = String.prototype.replace
var dollarRegex = /\$/g
var dollarBillsYall = '$$'
var defaultTokenRegex = /%\{(.*?)\}/g
// var defaultUpperCaseRegex = /\^(.*?)\^/g
var has = require('has')

class TProvider extends Component {
	constructor(props) {
		super(props)

		this.state = {
			sMessage: {
				sId: '',
				sOpt: {}
			},
			sOpen: false
		}
	}
	//#region Polyglot Code modified to be tied to Redux - http://airbnb.io/polyglot.js/
	transformPhrase = (phrase, substitutions, tokenRegex) => {
		if (typeof phrase !== 'string') {
			throw new TypeError('TProvider.transformPhrase expects argument #1 to be string')
		}

		if (substitutions == null) {
			return phrase
		}
		var result = phrase
		var interpolationRegex = tokenRegex || defaultTokenRegex
		var options = typeof substitutions === 'number' ? { smart_count: substitutions } : substitutions		
		result = replace.call(result, interpolationRegex,
			function (expression, argument) {
				if (!has(options, argument) || options[argument] == null) {
					return expression
				}
				return replace.call(options[argument], dollarRegex, dollarBillsYall)
			})
		if (substitutions.type === 'markdown')
			return <ReactMarkdown source={result} />
		else {
			return result
		}
	}
	t = (key, options) => {
		var phrase, result
		var opts = options == null ? {} : options
		if (typeof this.props.langStrings[key] === 'string') {
			phrase = this.props.langStrings[key]
		} else if (typeof opts._ === 'string') {
			phrase = opts._
		} else if (this.onMissingKey) {
			var onMissingKey = this.onMissingKey
			result = onMissingKey(key, opts, this.tokenRegex)
		} else {
			// console.log('Missing translation for key: "' + key + '"')
			result = key
		}
		if (typeof phrase === 'string') {
			result = this.transformPhrase(phrase, opts, this.tokenRegex)
		}
		return result
	}
	//#endregion polyglot code

	//#region Snackbar
	queue = []
	s = (sId, sOpt) => {
		this.queue.push({ sId, sOpt })
		if (this.state.sOpen) {
			this.setState({ sOpen: false });
		} else {
			this.processQueue();
		}
	}
	processQueue = () => {
		if (this.queue.length > 0) {
			this.setState({
				sMessage: this.queue.shift(),
				sOpen: true
			});
		}
	};
	sClose = () => {
		this.setState({
			sOpen: false
		})
	}
	handleNextS = () => {
		this.processQueue()
	}
	//#endregion
	getChildContext() {
		return {
			sClose: this.sClose.bind(this),
			sOpen: this.state.sOpen,
			sOpt: this.state.sMessage.sOpt,
			t: this.t.bind(this),
			s: this.s.bind(this),
			sId: this.state.sMessage.sId,
			handleNextS: this.handleNextS.bind(this)
		}
	}
	render() {
		const children = this.props.children
		return React.Children.only(children)
	}
}

const mapStateToProps = (state) => ({
	language: state.localization.language,
	langStrings: state.localization.s
})

const mapDispatchToProps = (dispatch) => {
	return {
		changeLanguage: code => dispatch(changeLanguage(code))
	}
}
TProvider.propTypes = {
	children: PropTypes.element.isRequired,
}

TProvider.childContextTypes = {
	t: PropTypes.func.isRequired,
	s: PropTypes.func.isRequired,
	sId: PropTypes.string.isRequired,
	sOpt: PropTypes.object,
	sOpen: PropTypes.bool.isRequired,
	sClose: PropTypes.func.isRequired,
	handleNextS: PropTypes.func.isRequired
}
export default connect(mapStateToProps, mapDispatchToProps)(TProvider)
