import React, {useState} from 'react'
import style from './Table.module.scss'
import {Button} from '../common/button/Button'
import {$currentPage, $isFilter, deleteItemsFx, getItemsFx, getFilteredItemFx} from './model'
import {$columnForFilter, $filterDataForm} from '../filter-table-form/model'
import {useStore} from 'effector-react'
import {Paginator} from '../common/paginator/Paginator'

export const Table = React.memo(({items, totalCount}) => {

    const itemsForRender = items?.map((item, index) => <Cell key={item.id} item={item} index={index}/>)
    const column = useStore($columnForFilter)
    const currentPage = useStore($currentPage)

    const isLoading = useStore(getFilteredItemFx.pending || getItemsFx.pending)

    const filterDataForm = useStore($filterDataForm)
    const isFilter = useStore($isFilter)

    const styleForColumn = {
        backgroundColor: '#ffa700',
        color: '#000',
    }

    const onPageChanged = (page) => {
        if (isFilter) getFilteredItemFx({dataFilter: filterDataForm, page})
        else getItemsFx(page)
    }

    return (
        <div className={style.wrapper}>
            {isLoading && <h3>Загрузка...</h3>}
            <table className={style.table}>
                <tbody>
                <tr>
                    <th>№</th>
                    <th style={column === 'date' ? styleForColumn : {}}>Дата</th>
                    <th style={column === 'name' ? styleForColumn : {}}>Название</th>
                    <th style={column === 'count' ? styleForColumn : {}}>Количество</th>
                    <th style={column === 'distance' ? styleForColumn : {}}>Расстояние</th>
                    <th className={style.hover}></th>
                </tr>
                {itemsForRender}
                </tbody>
            </table>
            {totalCount > 10 &&
                <Paginator totalItemsCount={totalCount} onPageChanged={onPageChanged}
                           currentPage={currentPage}/>}
        </div>
    )
})


const Cell = React.memo(({item, index}) => {

    const [isHovering, setIsHovering] = useState(false)
    const handleMouseOver = () => {
        setIsHovering(true)
    }

    const handleMouseOut = () => {
        setIsHovering(false)
    }

    const removeItem = () => {
        deleteItemsFx(item.id)
    }

    return (
        <tr className={style.row}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <td>{++index}</td>
            <td>{item['date_create']}</td>
            <td>{item.name}</td>
            <td>{item.count}</td>
            <td>{item.distance} км</td>
            <td className={style.hover}>
                {isHovering &&
                    <div className={style.btnGroup}>
                        <Button onClick={removeItem}>x</Button>
                        <Button>☰</Button>
                    </div>}
            </td>
        </tr>
    )
})