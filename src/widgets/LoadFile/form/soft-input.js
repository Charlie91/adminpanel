import React, { Component } from 'react';

class SoftField extends Component {
  setSoft(e){
    this.props.isValid('softField',e.target.value);
  }


  render() {
    return (
      <div className="form-group">
        <label htmlFor="soft">Софт ритэйл</label>
        <select id="soft" onChange={this.setSoft.bind(this)} className="form-control">
          <option> Retail soft 1 </option>
          <option> Retail soft 2 </option>
          <option> Retail soft 3 </option>
          <option> Retail soft 4 </option>
        </select>
      </div>
    );
  }
}

export default SoftField;
