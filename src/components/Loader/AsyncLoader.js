import React from 'react'
import { CircularLoader } from 'components';

const AsyncLoader = ({ isLoading, error }) => {
	// Handle the loading state
	if (isLoading) {
		return <CircularLoader />;
	}
	// Handle the error state
	else if (error) {
		return <div>Sorry, there was a problem loading the page.</div>;
	}
	else {
		return null;
	}
};

export default AsyncLoader