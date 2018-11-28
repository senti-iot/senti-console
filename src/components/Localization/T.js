import React from 'react'
import PropTypes from 'prop-types'

export default function withLocalization() {

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


