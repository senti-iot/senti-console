import React, { Fragment, useState, useEffect } from 'react'
import { Fade } from '@material-ui/core';
import { CircularLoader } from 'components';
import { usePrevious } from 'hooks';
import PropTypes from 'prop-types'

function FadeOutLoader(props) {
	const [loading, setLoading] = useState(false)
	const [showLoader, setShowLoader] = useState(false)

	const on = props.on
	const prevOn = usePrevious(on)
	useEffect(() => {
		async function loadLoader() {
			const execute = async (on) => {
				if (on) {
					setLoading(true)
					setTimeout(async () => {
						setShowLoader(on)
						setLoading(false)
						await props.onChange()
					}, 1000);
				}
				else {
					setLoading(false)
					setShowLoader(false)
				}
			}
			if ((prevOn !== on) && on) {
				await execute(true)
			}
			if ((prevOn !== on) && !on) {
				await execute(false)
			}
		}
		loadLoader();
		return () => {

		}
	}, [on, prevOn, props])

	const { children, notCentered, CustomLoader } = props

	return (
		<Fragment>
			<Fade in={!loading}>
				{!showLoader ?
					children
					: CustomLoader ? <CustomLoader notCentered={notCentered} /> : <CircularLoader notCentered={notCentered} />}
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
