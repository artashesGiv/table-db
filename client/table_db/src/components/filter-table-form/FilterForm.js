import React from 'react'
import style from './Form.module.scss'
import {Button} from '../common/button/Button'
import {useStore} from 'effector-react'
import {
    $column,
    $filterInput,
    $filterCondition,
    $filteredDataType,
    $filterFormError,
    changeInput,
    onSubmitEvent,
    selectColumnValue,
    selectFilterCondition,
    resetFilter, $filterInputNumber,
} from './model'

export const FilterForm = React.memo(() => {

    const column = useStore($column)
    const filterType = useStore($filterCondition)
    const filterInput = useStore($filterInput)
    const filterInputNumber = useStore($filterInputNumber)
    const err = useStore($filterFormError)

    const filteredDataType = useStore($filteredDataType)

    const onsubmit = (event) => {
        event.preventDefault()
        onSubmitEvent()
    }

    const resetForm = (event) => {
        event.preventDefault()
        resetFilter()
    }

    return (
        <form onSubmit={onsubmit} className={style.form}>
            <select className={style.select} value={column} onChange={e => selectColumnValue(e.currentTarget.value)}>
                <option value={'date'}>Дата</option>
                <option value={'name'}>Название</option>
                <option value={'count'}>Количество</option>
                <option value={'distance'}>Расстояние</option>
            </select>
            <select className={style.select} value={filterType}
                    onChange={e => selectFilterCondition(e.currentTarget.value)}>
                {filteredDataType === 'string' &&
                    <>
                        <option value={'equals'}>Равно</option>
                        <option value={'contains'}>Содержит</option>
                    </>
                }
                {filteredDataType === 'number' &&
                    <>
                        <option value={'more'}>Больше</option>
                        <option value={'less'}>Меньше</option>
                    </>
                }
            </select>
            {filteredDataType === 'string'
                ? <input type="text" value={filterInput} onChange={e => changeInput(e.currentTarget.value)}/>
                : <input type="text" value={filterInputNumber} onChange={e => changeInput(e.currentTarget.value)}/>
            }
            {err && <p className={style.err}>Введите значение</p>}
            <Button>Фильтр</Button>
            <Button onClick={resetForm}>Сброс</Button>
        </form>
    )
})
