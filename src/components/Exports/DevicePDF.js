import React, { Component } from 'react'
import { Document, Page, Text, View, BlobProvider, PDFDownloadLink, PDFViewer, Image } from '@react-pdf/renderer';
// import { Button } from '@material-ui/core';


const Doc = (props) => {
	// console.log(props.img)
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
		// console.log(Template)
		return (
			<div>
				{this.props.img ? <PDFViewer>
					<Doc img={this.props.img} />
				</PDFViewer> : null}
				<PDFDownloadLink document={<Doc img={this.props.img}/>} fileName="somename.pdf">
					{({ blob, url, loading, error }) =>
						loading ? 'Loading document...' : 'Download now!'
					}
				</PDFDownloadLink>
				<BlobProvider document={<Doc img={this.props.image}/>}>
					{({ blob, url, loading, error }) => {
						console.log(blob)
						// let urlBlob = URL.createObjectURL(blob);
						return !loading ? <iframe title={"pdf"} src={blob}/> : null
					}}
				</BlobProvider>
			</div>
		)
	}
}

// ReactPDF.render(Template)

// Create Document Component

// ReactPDF.render(<Template />, `${__dirname}/example.pdf`);
export default DevicePDF