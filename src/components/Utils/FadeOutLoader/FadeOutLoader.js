import React, { Fragment, useState, useEffect } from 'react'
import { Fade } from '@material-ui/core';
import { CircularLoader } from 'components';
import PropTypes from 'prop-types'


function FadeOutLoader(props) {
	const [loading, setLoading] = useState(false)
	// const [showLoader, setShowLoader] = useState(props.on ? true : false)
	const on = props.on
	useEffect(() => {
		const execute = async () => {
			if (on && !loading) {
				setLoading(true)
				await props.onChange()
			}
			else {
				if (!on)
					setLoading(false)
			}
		}
		execute()

	}, [loading, on, props])

	const { children, notCentered, CustomLoader, fill, fillView } = props
	return (
		<Fragment>
			<Fade in={!loading}>
				{/* {!showLoader ? */}
				{!loading ? children : CustomLoader ? <CustomLoader notCentered={notCentered} /> : <CircularLoader fillView={fillView} fill={fill} notCentered={notCentered} />}

			</Fade>
		</Fragment>
	)
}

FadeOutLoader.propTypes = {
	on: PropTypes.bool.isRequired,
	notCentered: PropTypes.bool,
	circularClasses: PropTypes.object,
	onChange: PropTypes.func.isRequired,
}
export default FadeOutLoader
