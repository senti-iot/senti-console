import React from 'react'
import { Slide } from '@material-ui/core';


export default React.forwardRef((props, ref) => (
	<Slide direction='up' {...props} ref={ref} />));
