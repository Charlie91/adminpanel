import React, { Component } from 'react';

class SubdField extends Component {
  setSUBD(e){
    this.props.isValid('subdField',e.target.value);
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor="subd">СУБД</label>
        <select id="subd" onChange={this.setSUBD.bind(this)} className="form-control">
          <option> PostgreSQL </option>
          <option> MySQL </option>
          <option> FoxPro </option>
          <option> Oracle Database </option>
          <option> Informix </option>
          <option> Firebird </option>
        </select>
      </div>
    );
  }
}

export default SubdField;
