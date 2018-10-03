import React from 'react'
import PropTypes from 'prop-types'

// Higher order component (HOC) decorator for components that need `t`
export default function withSnackbar() {

	return (WrappedComponent) => {
		const _snackbar = (props, context) => {
			console.log(context)
			return (<WrappedComponent
				{...props}
				s={context.s}
				sId={context.sId}
				sOpt={context.sOpt}
			/>
			)
		}

		_snackbar.contextTypes = {
			s: PropTypes.func.isRequired,
			sId: PropTypes.string.isRequired,
			sOpt: PropTypes.object
		}

		return _snackbar
	}
}

// Inspiration from https://github.com/nayaabkhan/react-polyglot

