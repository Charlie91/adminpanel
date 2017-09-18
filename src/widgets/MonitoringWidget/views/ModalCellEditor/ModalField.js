import React from 'react';

export default class ModalField extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    if(this.textInput)this.textInput.focus()
  }

  render(){
      return (
        <label>
          {this.props.title}
          <input
            className={ ( this.props.editorClass || '') + ' form-control editor edit-text' }
            ref = { (this.props.focus) ? (input) => { this.textInput = input; } : '' }
            style={ { display: 'block', width: '60%' } }
            type='text'
            value={ this.props.value }
            onChange={ e => {this.props.changeState(this.props.name, e.currentTarget.value) } }
          />
        </label>
      )
  }
}
