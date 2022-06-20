import './App.css'
import {Table} from './components/table/Table'
import {useEffect} from 'react'
import {$items, $totalCount, getItemsFx} from './components/table/model'
import {useStore} from 'effector-react'
import {AddForm} from './components/add-item-form/AddForm'
import {FilterForm} from './components/filter-table-form/FilterForm'

export const App = () => {

    const items = useStore($items)
    const totalCount = useStore($totalCount)


    useEffect(() => {
        getItemsFx()
    }, [])

    return (
        <div className={'container'}>
            <div className={'table'}>
                <FilterForm/>
                <Table items={items} totalCount={totalCount}/>
            </div>
            <AddForm/>
        </div>
    )
}
