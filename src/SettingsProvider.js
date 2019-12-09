import React, { useEffect } from 'react'
import { getSettings } from 'redux/settings'
import { getDaysOfInterest } from 'redux/doi'
import { useDispatch, useSelector } from 'hooks'
import FadeOutLoader from 'components/Utils/FadeOutLoader/FadeOutLoader'

export const SettingsProvider = (props) => {
	const dispatch = useDispatch()
	const loading = useSelector(s => s.settings.loading)
	const getS = async () => {
		dispatch(await getSettings()).then(async rs => {
			await dispatch(getDaysOfInterest())
		})
	}
	// useEffect(() => {
	// 	getS()

	// }, [dispatch])
	return <FadeOutLoader on={loading} onChange={getS}>
		{props.children}
	</FadeOutLoader>
}
