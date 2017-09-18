import React from 'react';
import './loading.css';
import Image from './Loading-circle.gif';

const Loading = (props) => {
  //if(!props.render)return null;
  return (
    <div className="loading_process">
        <h1 className="load_title">Загрузка</h1>
      <img src={Image} className="load_image"/>
    </div>
  )
}

export default Loading;
