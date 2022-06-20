import React from 'react'
import style from './Button.module.scss'

export const Button = ({children, ...props}) => {
    return (
        <button {...props} className={`${props.className} ${style.button}`}>{children}</button>
    )
}
