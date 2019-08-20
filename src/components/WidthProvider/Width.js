import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export function useWidth() {
	const theme = useTheme();
	const keys = [...theme.breakpoints.keys].reverse();
	return (
	  keys.reduce((output, key) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
			const matches = useMediaQuery(theme.breakpoints.only(key));
			return !output && matches ? key : output;
	  }, null) || 'xs'
	);
}