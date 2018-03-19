import logo from './senti-logo.svg'

const theme = {
	app: {
		gridArea: '"header header""menupanel workspace""footer footer"',
		gridTemplateRows: 'auto 1fr auto',
		gridTemplateColumns: 'auto 1fr',
		width: '100vw',
		height: '100vh',
	},
	header: {
		height: '80px',
		background: '#1a1b32',
		color: '#ffffff',
	},
	menu: {
		background: '#767684',
		color: '#FFF',
		selected: '#3f3f53',
		hover: '#8b8b9b',
		border: '1px solid #FFFFFF',
		textHover: '#ffffff',
		fontSize: 'inherit',
	},
	footer: {
		background: '#F7F7F7',
		color: '#5E5E5E',
	},
	workspace: {
		background: '#ECF0F1',
		color: '#000',
	},
	tab: {
		activeColor: '#ffffff',
		color: '#ffffff',
		selected: '#37a891',
		hover: '#37e1bf',
		unselected: '#E3E5E5',
	},
	icon: {
		default: '#34495D',
		selected: '#FFF',
	},
	quicknav: {
		button: {
			background: '#216795',
			unselected: '#E3E5E5',
			color: '#FFF',
		},
		tab: {
			selected: '#3B97D3',
			unselected: '#000',
		},
	},
	logo: {
		margin: '0px 10px',
		height: '100%',
	 	default: logo
	},
	input: {
		color: '#2C3E50',
		background: '#ECF0F1',
		focusColor: '#13A085',
		borderRadius: '4px'
	},
	button: {
		background: '#3B97D3',
		selected: '#216795',
		color: '#FFFFFF',
		height: '30px',
		hover: '#81C1EA'
	}
}

export default theme