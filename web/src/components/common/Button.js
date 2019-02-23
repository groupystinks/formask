import React from 'react';
import '../../style/button.css'

const Button = (props) => {
  const isSubmittingClass = props.disabled ? 'disabled' : ''
  return (
    <button className={`f-button ${isSubmittingClass}`} {...props}>
      { props.children }
    </button>
  )
}

export default Button;
