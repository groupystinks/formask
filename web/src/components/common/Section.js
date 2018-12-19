import React from 'react';
import '../../style/section.css';

const Section = (props) => {
  return (
    <div className="section" id={props.title}>
      <div className="section-header">
        <h2>
          <span className="hashtag">#</span>
          <a href={`#${props.title}`}>{props.title}</a>
        </h2>
      </div>
      <div>
        {props.children}
      </div>
    </div>
  );
}

export default Section;
