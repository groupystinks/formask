import * as React from 'react';
import '../../style/submit-message.css';

const SubmitMessage = (props) => {
  const { type, message } = props;
  return (
    <div className='submit-message'>
      <span className={type}>{message}</span>
    </div>
  )
}

export default SubmitMessage;
