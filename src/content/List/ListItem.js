import React, { PureComponent } from 'react'
import { Label, /* Responsible, */ ListItemContainer, ExpandButtonContainer, /* Cell, */ Text, ListCardItem, Button, ButtonContainer, ControlsContainer } from './ListStyles'
import Icon from 'odeum-ui/lib/components/Icon/Icon'
import Checkbox from '../Views/Components/CheckBox'
// import FormCard from '../Card/FormCard'
export default class ListCard extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			expand: false,
			checked: false,
			cardExpand: false
		}
	}
	setExpandedCardRef = (node) => {
		this.node = node
	}

	handleExpand = (e) => {
		if (this.state.cardExpand) {
			this.setState({ cardExpand: false })
			// document.removeEventListener('click', this.onClickOutside, false)
		}
		else {
			this.setState({ cardExpand: true })
			// document.addEventListener('click', this.onClickOutside, false)

		}
	}

	onExpand = () => {
		this.setState({ expand: !this.state.expand })
	}
	onChecked = (isChecked) => {
		this.props.onChecked(this.props.id, isChecked)
		this.setState({ checked: !this.state.checked })
	}
	render() {
		// const { cardExpand } = this.state
		return (
			<React.Fragment>
				{/* {cardExpand ? <FormCard handleCardExpand={this.handleExpand} cardExpand={cardExpand} item={this.props.item} column={this.props.column}/> : null} */}
				<ListCardItem>
					<Checkbox size={'medium'} onChange={this.onChecked} />
					<ListItemContainer selected={this.state.checked} columnCount={this.props.columnCount}>
						{Object.keys(this.props.item).map((i, index) =>
							this.props.column[index].visible ? <Label key={index}>
								<Text title={this.props.item[i].toString()}>
									{this.props.item[i] instanceof Date ? this.props.item[i].toLocaleDateString() : this.props.item[i].toString()}
								</Text>
							</Label> : null
						)}
					</ListItemContainer>
					<ControlsContainer>
						<ButtonContainer horizOpen={this.state.expand} style={{ flexFlow: 'row nowrap', borderRadius: 0, height: 'inherit' }}>
							<Button horizOpen={this.state.expand} onClick={this.handleExpand}>
								<Icon color={'#5E5E5E'} icon={'mode_edit'} iconSize={23} />
							</Button>
							<Button horizOpen={this.state.expand}>
								<Icon color={'#5E5E5E'} icon={'share'} iconSize={23} />
							</Button>
							<Button horizOpen={this.state.expand}>
								<Icon color={'#5E5E5E'} icon={'library_add'} iconSize={23} />
							</Button>
						</ButtonContainer>
						<ExpandButtonContainer selected={this.state.checked} onClick={this.onExpand}>
							<Icon icon={'more_vert'} color={'#FFF'} active={this.state.checked} iconSize={23} />
						</ExpandButtonContainer>
					</ControlsContainer>
				</ListCardItem>
			</React.Fragment>
		)
	}
}
