import React from 'react'
import PropTypes from 'prop-types'

// Higher order component (HOC) decorator for components that need snackbarMessages
export default function withSnackbar() {

	return (WrappedComponent) => {
		const _snackbar = (props, context) => {
			return (<WrappedComponent
				{...props}
				s={context.s}
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


