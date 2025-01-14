'use client';

import React from 'react'
import { CSSProperties } from 'react'

interface DatamapStateProps {
  path(): string
  mouseEnterOnState(name: string, value: number, index: number): void
  name: string
  value: number
  fillColor: string
  hoverColor?: string
  borderColor: string
  hoverBorderColor?: string
  index: number
}

interface DatamapStateState {
  isActive: boolean
}

class DatamapState extends React.Component<DatamapStateProps, DatamapStateState> {
  state = {
    isActive: false,
  }

  constructor(props: DatamapStateProps) {
    super(props)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleMouseLeave)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleMouseLeave)
  }

  handleMouseEnter = () => {
    const { name, value, index } = this.props

    this.setState({
      isActive: true,
    })
    this.props.mouseEnterOnState(name, value, index)
  }

  handleMouseLeave = () => {
    this.setState({
      isActive: false,
    })
  }

  render() {
    const stateStyle: CSSProperties = {
      fill: this.state.isActive
        ? this.props.hoverColor || '#FFCCBC'
        : this.props.fillColor,
      stroke: this.state.isActive
        ? this.props.hoverBorderColor || '#FF5722'
        : this.props.borderColor,
      strokeWidth: 0.5,
    }
    return (
      <path
        className="datamap-state"
        style={stateStyle}
        d={this.props.path()}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      />
    )
  }
}

export default DatamapState
