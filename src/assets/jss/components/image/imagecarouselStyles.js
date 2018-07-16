
const imagecarouselStyles = theme => ({
	root: {
		flexGrow: 1,
		[theme.breakpoints.up('md')]: {
			maxWidth: 800,
		},
		[theme.breakpoints.down("lg")]: {
			maxWidth: 400
		}
	},
	header: {
		display: 'flex',
		alignItems: 'center',
		height: 50,
		paddingLeft: theme.spacing.unit * 4,
		marginTop: 20,
		backgroundColor: theme.palette.background.default,
	},
	img: {
		[theme.breakpoints.up('md')]: {
			maxWidth: 800,
			height: 255 * 2
		},
		[theme.breakpoints.down("lg")]: {
			height: 255,
			maxWidth: 400
		},
		overflow: 'hidden',
		width: '100%',
	},
	deviceImg: {
		maxWidth: '100%',
		[theme.breakpoints.down('sm')]: {
			maxHeight: '200px'
		}

	},
});

export default imagecarouselStyles