import React, { Component } from 'react'
// import { Document, Page, Text, View, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { Button } from '@material-ui/core';
import Loadable from 'react-loadable';
import AsyncLoader from 'components/Loader/AsyncLoader';

const Document = Loadable({
	loader: () => import('@react-pdf/renderer'),
	render(loaded, props) { 
		let Component = loaded.Document
		return <Component {...props}/>
	},
	loading: AsyncLoader
})
const Page = Loadable({
	loader: () => import('@react-pdf/renderer'),
	render(loaded, props) {
		let Component = loaded.Page
		return < Component { ...props }/>
	},
	loading: AsyncLoader
})
const Text = Loadable({
	loader: () => import('@react-pdf/renderer'),
	render(loaded, props) { 
		let Component = loaded.Text
		return <Component {...props}/>
	},
	loading: AsyncLoader
})
const View = Loadable({
	loader: () => import('@react-pdf/renderer'),
	render(loaded, props) {
		let Component = loaded.View
		return < Component { ...props }/>
	},
	loading: AsyncLoader
})
const PDFDownloadLink = Loadable({
	loader: () => import('@react-pdf/renderer'),
	render(loaded, props) { 
		let Component = loaded.PDFDownloadLink
		return <Component {...props}/>
	},
	loading: AsyncLoader
})
const Image = Loadable({
	loader: () => import('@react-pdf/renderer'),
	render(loaded, props) {
		let Component = loaded.Image
		return < Component { ...props }/>
	},
	loading: AsyncLoader
})
const Doc = (props) => {
	
	return (<Document>
		<Page wrap>
			<Image style={{ maxHeight: 300 }} src={props.img}></Image>
			<Text render={({ pageNumber, totalPages }) => (
				`${pageNumber} / ${totalPages}`
			)} fixed />

			<View render={({ pageNumber }) => (
				pageNumber % 2 === 0 && (
					<View style={{ background: 'red' }}>
						<Text>I'm only visible in odd pages!</Text>
					</View>
				)
			)} />
		</Page>
	</Document>
	)
}
class DevicePDF extends Component {
	constructor(props) {
		super(props)

		this.state = {
			url: ""
		}
	}
	render() {
		
		return (
			<PDFDownloadLink document={<Doc img={this.props.img}/>} fileName="somename.pdf">
				{({ blob, url, loading, error }) =>
					loading ? null : <Button variant={'contained'} color={"primary"}>PDF</Button>
				}
			</PDFDownloadLink>
		)
	}
}

// ReactPDF.render(Template)

// Create Document Component

// ReactPDF.render(<Template />, `${__dirname}/example.pdf`);
export default DevicePDF