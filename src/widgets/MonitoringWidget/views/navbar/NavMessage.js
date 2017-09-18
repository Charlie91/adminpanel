import React from 'react';


const NavMessage = (props) => {
  return (
    <div className="update-nag col-md-offset-1 col-md-5 col-sm-offset-2 col-sm-8 col-xs-offset-1 col-xs-10">
        {props.children}
    </div>
  )
}

export default NavMessage;
