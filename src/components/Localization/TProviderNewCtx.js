import React, { useState } from 'react'
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

function TProvider(props) {
	const [sMessage, setsMessage] = useState({ sId: '', sOpt: '' })
	const [sOpen, setsOpen] = useState(false)
	const transformPhrase = (phrase, substitutions, tokenRegex) => {
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
	const t = (key, options) => {
		var phrase, result
		var opts = options == null ? {} : options
		if (typeof props.langStrings[key] === 'string') {
			phrase = props.langStrings[key]
		} else if (typeof opts._ === 'string') {
			phrase = opts._
		}
		/* else if (this.onMissingKey) {
			var onMissingKey = this.onMissingKey
			result = onMissingKey(key, opts, this.tokenRegex)
		 */
		else {
			console.info('Missing key: "' + key + '"')
			result = key
		}
		if (typeof phrase === 'string') {
			result = transformPhrase(phrase, opts, undefined)
		}
		return result
	}
	//#endregion polyglot code

	//#region Snackbar
	let queue = []
	const s = (sId, sOpt) => {
		queue.push({ sId, sOpt })
		if (sOpen) {
			setsOpen(false);
		} else {
			processQueue();
		}
	}
	const processQueue = () => {
		if (this.queue.length > 0) {
			setsMessage(queue.shift())
			setsOpen(true)
		}
	};
	const sClose = () => {
		setsOpen(false)
		// this.setState({
		// 	sOpen: false
		// })
	}
	const handleNextS = () => {
		processQueue()
	}

	return {
		t: t,
		s: s
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
