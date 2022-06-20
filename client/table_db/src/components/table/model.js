import {createEffect, createEvent, createStore, sample} from 'effector'
import {tableItemsAPI} from '../../api/api'

// получение, создание, удаление данных
const getItemsFx = createEffect((page) => tableItemsAPI.getItems(page))
const createItemsFx = createEffect((item) => tableItemsAPI.createItem(item))
const deleteItemsFx = createEffect((id) => tableItemsAPI.deleteItem(id))
// сброс фильтра
const resetFilter = createEvent()

// получение фильтрованных данных
const getFilteredItemFx = createEffect(({dataFilter, page}) => tableItemsAPI.getFilteredItems({dataFilter, page}))

// флаг филтрации
const isFilterOn = createEvent()
const isFilterOff = createEvent()
const $isFilter = createStore(false)
    .on(isFilterOn, () => true)
    .reset(isFilterOff)

// хранилище данных
const $items = createStore([])
const $totalCount = createStore(0)

// определение текущей странницы запроса
const $currentPage = createStore(1)
sample({
    clock: [getItemsFx.done, getFilteredItemFx.done],
    fn: (data) => +data.result.data.currentPage,
    target: $currentPage,
})

// обновление данных после добавления или удаления
sample({
    clock: [createItemsFx.done, deleteItemsFx.done],
    source: $currentPage,
    fn: (currentPage) => currentPage,
    target: [getItemsFx, resetFilter],
})

// получение данных
sample({
    clock: [getItemsFx.done, getFilteredItemFx.done],
    fn: (data) => data.result.data.items,
    target: $items,
})

// получение данных после сброса фильтра
sample({
    clock: isFilterOff,
    target: getItemsFx,
})

// получение общего количества данных - number
sample({
    clock: [getItemsFx.done, getFilteredItemFx.done],
    fn: (data) => data.result.data.totalCount,
    target: $totalCount,
})

export {
    $items,
    $totalCount,
    $currentPage,
    $isFilter,
    getItemsFx,
    isFilterOn,
    isFilterOff,
    getFilteredItemFx,
    createItemsFx,
    deleteItemsFx,
    resetFilter,
}