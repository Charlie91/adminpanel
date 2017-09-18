import React, { Component } from 'react';

class IdField extends Component {
  setID(e){
    this.props.isValid('idField',e.target.value);
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor="ID_field">ID продукта</label>
        <input id="ID_field" onChange={this.setID.bind(this)} className="form-control" placeholder="Введите ID" type="text"/>
      </div>
    );
  }
}

export default IdField;
