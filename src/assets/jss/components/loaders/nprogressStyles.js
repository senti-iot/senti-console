// background: #29d;
// position: fixed;
// z - index: 1031;
// top: 0;
// left: 0;
// width: 100 %;
// height: 2px;

import { makeStyles } from '@material-ui/core';


const styles = makeStyles(theme => ({
	bar: {
		background: `${theme.palette.main}`,
		position: 'fixed',
		zIndex: '1031',
		top: '0',
		left: '0',
		width: '100 %',
		height: '2px'
	}
}))

export default styles