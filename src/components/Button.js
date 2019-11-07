// BUTTON COMPONENT FILE
import React from "react";

import "components/Button.scss";
import classNames from 'classnames';

export default function Button(props) {

   // CLASS NAME DEPENDENT ON PROPS
   let buttonClass = classNames({
      'button': true,
      'button--confirm': props.confirm,
      'button--danger': props.danger
   });

   return <button 
            className={buttonClass}
            onClick={props.onClick}
            disabled={props.disabled}
         >
            {props.children}
         </button>;
}
