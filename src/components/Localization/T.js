import React from 'react'
import PropTypes from 'prop-types'

// Higher order component (HOC) decorator for components that need `t`
export default function translate() {
	return (WrappedComponent) => {
		const _translate = (props, context) => {
			return (<WrappedComponent
				{...props}
				t={context.t} />
			)
		}

		_translate.contextTypes = {
			t: PropTypes.func.isRequired,
		}

		return _translate
	}
}

// Inspiration from https://github.com/nayaabkhan/react-polyglot

