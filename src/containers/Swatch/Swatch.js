import Component from 'inferno-component'
import styled from 'styled-components'
import { connect } from 'inferno-redux'
import { Transition } from 'react-move'
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from 'react-sortable-hoc'

import { toggleSorting } from './../../store/swatch/actions'

const SwatchContainer = styled.div`
  height: 50px;
  width: 100%;
  margin-top: 20px;
  padding-right: 40px;
  display: flex;
  z-index: 40;
  justify-content: flex-end;
`

const SwatchItem = styled.div`
  height: 25px;
  width: 25px;
  border-radius: 50%;
  margin-left: 10px;
`

const SortableItem = SortableElement(props => <SwatchItem {...props} />)

const SortableList = SortableContainer(
  ({ items, width, height, transitionDuration, sorting }) => {
    return (
      <Transition
        data={items}
        getKey={(item, index) => index}
        update={(item, index) => ({
          color: items[index],
          width
        })}
        enter={(item, index) => ({
          color: items[index - 1],
          width: 0
        })}
        leave={(item, index) => ({
          color: items[index - 1],
          width: 0
        })}
        duration={transitionDuration}
      >
        {data => (
          <SwatchContainer>
            {data.map((item, index) => {
              return (
                <SortableItem
                  key={item.key}
                  sorting={sorting}
                  index={index}
                  style={{
                    // backgroundColor: item.state.color,
                    backgroundColor: sorting ? items[index] : item.state.color,
                    width: item.state.width + 'px'
                  }}
                />
              )
            })}
          </SwatchContainer>
        )}
      </Transition>
    )
  }
)

class Swatch extends Component {
  state = {
    colors: null
  }
  componentDidMount () {
    this.setState({
      colors: this.props.colors
    })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.colors !== nextProps.colors) {
      this.setState({
        colors: nextProps.colors
      })
    }
  }

  _onSortStart = () => {
    this.props.toggleSorting()
  }

  _onSortEnd = ({ oldIndex, newIndex, collection }) => {
    const colors = arrayMove(this.state.colors, oldIndex, newIndex)
    const { updateColorStop, id } = this.props

    this.props.toggleSorting(300)

    this.setState({
      colors
    })

    updateColorStop(id, colors)
  }

  render () {
    const { transitionDuration, sorting } = this.props
    const { colors } = this.state
    return (
      colors &&
      <SortableList
        axis='x'
        lockAxis='x'
        transitionDuration={transitionDuration}
        items={this.state.colors}
        onSortStart={this._onSortStart}
        onSortEnd={this._onSortEnd}
        sorting={sorting}
        width={25}
        lockToContainerEdges
      />
    )
  }
}

export default connect(state => ({ sorting: state.swatch.sorting }), {
  toggleSorting
})(Swatch)
