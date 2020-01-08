import React, { Fragment, useState, useEffect } from 'react'
import { Fade } from '@material-ui/core';
import { CircularLoader } from 'components';
import PropTypes from 'prop-types'


function FadeOutLoader(props) {
	const [loading, setLoading] = useState(false)
	const [showLoader, setShowLoader] = useState(props.on ? true : false)
	const on = props.on
	useEffect(() => {
		const execute = async (on) => {
			if (on) {
				setTimeout(async () => {
					setShowLoader(on)
					setLoading(on)
					await props.onChange()
					// nprogress.done(true)

				}, 1000);
			}
			else {
				setLoading(false)
				setShowLoader(false)
			}
		}

		if (on) {
			execute(true)
		}
		if (!on) {
			execute(false)
		}

	}, [on, props])

	const { children, notCentered, CustomLoader, fill, fillView } = props
	return (
		<Fragment>
			<Fade in={!loading} unmountOnExit mountOnEnter>
				{!showLoader ?
					!loading ? children : <div></div>
					: CustomLoader ? <CustomLoader notCentered={notCentered} /> : <CircularLoader fillView={fillView} fill={fill} notCentered={notCentered} />}
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
