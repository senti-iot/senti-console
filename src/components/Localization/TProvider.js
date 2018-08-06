import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { changeLanguage } from 'redux/localization';

var replace = String.prototype.replace
var dollarRegex = /\$/g
var dollarBillsYall = '$$'
var defaultTokenRegex = /%\{(.*?)\}/g
var has = require('has')

class TProvider extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 
	  }
	}

	transformPhrase = (phrase, substitutions, tokenRegex) => {
		if (typeof phrase !== 'string') {
			throw new TypeError('TProvider.transformPhrase expects argument #1 to be string')
		}

		if (substitutions == null) {
			return phrase
		}

		var result = phrase
		var interpolationRegex = tokenRegex || defaultTokenRegex

		// allow number as a pluralization shortcut
		var options = typeof substitutions === 'number' ? { smart_count: substitutions } : substitutions

		// Interpolate: Creates a `RegExp` object for each interpolation placeholder.
		result = replace.call(result, interpolationRegex, function (expression, argument) {
			if (!has(options, argument) || options[argument] == null) { return expression }
			// Ensure replacement value is escaped to prevent special $-prefixed regex replace tokens.
			return replace.call(options[argument], dollarRegex, dollarBillsYall)
		})

		return result
	}
	t = (key, options) => {
		// console.log(this)
		// console.log(this.props.langStrings[key], key, this.props.langStrings)
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
			console.log('Missing translation for key: "' + key + '"')
			result = key
		}
		if (typeof phrase === 'string') {
			result = this.transformPhrase(phrase, opts, this.tokenRegex)
		}
		return result
	}


	getChildContext() {
		console.log("Child Context might get it wrong here")
		return { t: this.t.bind(this) }
	}
	componentDidUpdate = (oldProps) => {
		if (oldProps.language !== this.props.language) { 
			console.log("Do I need to do something???")
			// this.props.changeLanguage(this.props.language)
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
}
export default connect(mapStateToProps, mapDispatchToProps)(TProvider)
