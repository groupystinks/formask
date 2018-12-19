import React from 'react';
import '../../style/button.css'

const Button = (props) => {
  return (
    <button className='f-button' {...props}>
      { props.children }
    </button>
  )
}

export default Button;
