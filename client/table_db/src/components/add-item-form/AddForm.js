import React from 'react'
import {Button} from '../common/button/Button'
import {$form, $err, changeCount, changeDistance, changeName, onSubmitEvent} from './model'
import {useStore} from 'effector-react'
import style from './Form.module.scss'

export const AddForm = React.memo(() => {

    const form = useStore($form)
    const err = useStore($err)

    const onSubmit = (event) => {
        event.preventDefault()
        onSubmitEvent()
    }

    return (
        <form onSubmit={onSubmit} className={style.form}>
            <div>
                <label htmlFor={'name'}>Введите название</label>
                <input id={'name'} type={'text'} value={form.name}
                       onChange={e => changeName(e.currentTarget.value)} autoComplete={'nope'}/>
            </div>
            <div>
                <label htmlFor={'count'}>Введите количество</label>
                <input id={'count'} type={'text'} value={form.count}
                       onChange={e => changeCount(e.currentTarget.value)} autoComplete={'off'}/>
            </div>
            <div>
                <label htmlFor={'distance'}>Введите расстояние</label>
                <input id={'distance'} type={'text'} value={form.distance}
                       onChange={e => changeDistance(e.currentTarget.value)} autoComplete={'off'}/>
            </div>
            <div>
                {err && <p className={style.err}>Введите корректные данные</p>}
            </div>
            <Button>Добавить</Button>
        </form>
    )
})
