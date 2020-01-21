import { useRef, useEffect } from 'react';

/**
 * This Custom Hook is made to simulate prevProps / prevState
 * from componentDidMount/componentDidUpdate etc.
 * @param value - Object to store previous and current values
 */
function usePrevious(value) {
	const ref = useRef();

	// Store current value in ref
	useEffect(() => {
		ref.current = value;
	}, [value]); // Only re-run if value changes

	// Return previous value (happens before update in useEffect above)
	return ref.current;
}
export default usePrevious