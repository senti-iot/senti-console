import React from 'react'
import PropTypes from 'prop-types'

export default function withSnackbarHandler() {

	return (WrappedComponent) => {
		const _snackbar = (props, context) => {
			return (<WrappedComponent
				{...props}
				s={context.s}
				sId={context.sId}
				sOpt={context.sOpt}
				sOpen={context.sOpen}
				sClose={context.sClose}
				handleNextS={context.handleNextS}
			/>
			)
		}

		_snackbar.contextTypes = {
			sOpen: PropTypes.bool.isRequired,
			sId: PropTypes.string.isRequired,
			sOpt: PropTypes.object,
			sClose: PropTypes.func.isRequired,
			handleNextS: PropTypes.func.isRequired
		}

		return _snackbar
	}
}


