import { useRef, useEffect } from 'react';

/**
 * This Custom Hook is made to simulate prevProps / prevState
 * from componentDidMount/componentDidUpdate etc.
 * @param value - Object to store previous and current values
 */
function usePrevious(value) {
	const ref = useRef(value);
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}

export default usePrevious