import 'react-hot-loader'
import React from 'react';
import ReactDOM from 'react-dom';
import Providers from './Providers'
import * as serviceWorker from './serviceWorker';
import Base from './Base'
import store from 'redux/store';
import { updateServiceworker } from 'redux/serviceWorkerRedux';

// import whyDidYouRender from "@welldone-software/why-did-you-render";

if (process.env.NODE_ENV !== 'production') {
	// whyDidYouRender(React, {
	// 	onlyLogs: true,
	// 	titleColor: "green",
	// 	diffNameColor: "darkturquoise"
	// });

}

const onUpdate = () => {
	store.dispatch(updateServiceworker())
}
serviceWorker.register({ onUpdate: onUpdate });

var rootEl = document.getElementById('root')

const render = (Component) => {
	return ReactDOM.render(<Providers><Component /></Providers>, rootEl)
}
render(Base)


if (module.hot) {
	module.hot.accept('./Base', function () {
		var NextApp = require('./Base').default
		render(NextApp)
	})
}