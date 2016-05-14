import React, {Component} from 'react'
import {Card} from './components'

export default class StatefulCard extends Component {
  constructor(props) {
    super(props)
    this.state = {model: props.init, history: [], future: []}
    this.control = {
      get: this.getModel.bind(this),
      update: this.update.bind(this)
    }
  }
  getModel() {
    return this.state.model
  }
  update(f) {
    const next = f(this.getModel())
    this.setState({
      model: next,
      history: [...this.state.history, this.state.model],
      future: []
    })
  }
  componentWillReceiveProps(nextProps) {
    this.update(() => nextProps.init)
  }
  undo() {
    if (this.state.history.length < 1) return
    const last = this.state.history[this.state.history.length-1]
    this.setState({
      model: last,
      history: this.state.history.slice(0, -1),
      future: [...this.state.future, this.state.model]
    })
  }
  redo() {
    if (this.state.future.length < 1) return
    const last = this.state.future[this.state.future.length-1]
    this.setState({
      model: last,
      future: this.state.future.slice(0, -1),
      history: [...this.state.history, this.state.model]
    })
  }
  render() {
    const {title, doc} = this.props
    return (
      <Card {...{title, doc}}>
      {this.props.history ? this.renderHistoryControl() : null}
      {this.props.children(this.control)}
      {this.props.inspect ? this.renderInspect() : null}
      </Card>
    )
  }
  renderHistoryControl() {
    return (
      <div style={{marginBottom:'1em'}}>
        <button onClick={this.undo.bind(this)}
          disabled={this.state.history.length < 1}>Undo</button>
        <button onClick={this.redo.bind(this)}
          disabled={this.state.future.length < 1}>Redo</button>
      </div>
    )
  }
  renderInspect() {
    const jsonStyle = {
      fontFamily:'monospace',
      backgroundColor:'#efefef',
      padding:'.5em',
    }
    const boxStyle = {
      marginTop:'1em',
      borderTop:'1px solid #efefef'
    }
    return (
      <div style={boxStyle}>
      <p style={{fontSize:'.7em',color:'#777'}}>model:</p>
      <span style={jsonStyle}>{JSON.stringify(this.getModel(), null, '  ')}</span>
      </div>
    )
  }
}