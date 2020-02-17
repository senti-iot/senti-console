import React, { Suspense } from 'react'

const AsyncRoute = ({ loader, loading }) => {
	const Component = React.lazy(() => import('' + loader))
	console.log(Component)
	return (
		<Suspense fallback={loading}>
			<Component />
		</Suspense>
	)
}

export default AsyncRoute