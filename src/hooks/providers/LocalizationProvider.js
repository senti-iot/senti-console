import React from 'react'
// import { localization, initialLocState } from 'Redux/localization';
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
var has = require('has')


export const TProvider = React.createContext(null)
TProvider.displayName = 'Localization'
const LocalizationProvider = ({ children }) => {
	// const [locState, locDispatch] = useReducer(localization, initialLocState)

	let langStrings = useSelector(state => state.localization.s)

	var replace = String.prototype.replace
	var dollarRegex = /\$/g
	var dollarBillsYall = '$$'
	var defaultTokenRegex = /%\{(.*?)\}/g

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
		if (substitutions.type === 'markdown') {
			console.log("result", result)
			// return null
			return <ReactMarkdown  children={result} />
		}
		else {
			return result
		}
	}

	const t = (key, options) => {
		var phrase, result
		var opts = options == null ? {} : options
		if (typeof langStrings[key] === 'string') {
			phrase = langStrings[key]
		} else if (typeof opts._ === 'string') {
			phrase = opts._
		} /* else if (this.onMissingKey) {
			var onMissingKey = this.onMissingKey
			result = onMissingKey(key, opts, this.tokenRegex)
		} */ else {
			// console.trace()
			if (opts.disableMissing) {

			}
			else {
				console.info('Missing key: "' + key + '"')
			} result = key
		}
		if (typeof phrase === 'string') {
			result = transformPhrase(phrase, opts)
		}
		return result
	}
	return (
		<TProvider.Provider value={t}>
			{children}
		</TProvider.Provider>

	)
}

export default React.memo(LocalizationProvider)
