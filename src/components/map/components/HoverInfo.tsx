import React from 'react'

interface HoverValue {
  name: string
  value: number
  [key: string]: unknown
}

interface HoverInfoProps {
  position: {
    x: number
    y: number
  }
  active: boolean
  valueTitle?: string
  name: string
  value: number
  hoverComponent?: React.ComponentType<{ value: HoverValue }>
}

class HoverInfo extends React.Component<HoverInfoProps> {
  private refHoverInfo: React.RefObject<HTMLDivElement>

  constructor(props: HoverInfoProps) {
    super(props)
    this.refHoverInfo = React.createRef<HTMLDivElement>()
  }

  render() {
    const hoverInfoStyle = {
      left: this.props.position.x - 50,
      top: this.props.position.y - (this.refHoverInfo.current?.offsetHeight ?? 0) - 20,
      display: this.props.active ? 'block' : 'none',
    }

    const HoverComponent = this.props.hoverComponent
    return (
      <div
        ref={this.refHoverInfo}
        className="HoverInfo"
        style={hoverInfoStyle}
      >
        {HoverComponent ? (
          <HoverComponent
            value={{ name: this.props.name, value: this.props.value }}
          />
        ) : (
          <>
            <p>{this.props.name}</p>
            <p>
              {this.props.valueTitle ? `${this.props.valueTitle}: ` : ''}
              {this.props.value.toLocaleString()}
            </p>
          </>
        )}
        <style>{`
          .HoverInfo {
            position: fixed;
            min-width: 8ch;
            background-color: white;
            box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.3);
            padding: 7px;
            border-radius: 4px;
          }
          .HoverInfo p {
            margin: 0;
            font-size: 0.9em;
          }
        `}</style>
      </div>
    )
  }
}

export default HoverInfo
