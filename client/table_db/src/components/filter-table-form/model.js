import {combine, createEvent, createStore, sample} from 'effector'
import {isFilterOn, resetFilter, getFilteredItemFx, isFilterOff} from '../table/model'
import {checkingForANumber} from '../../utils/validaton-utils'

const selectColumnValue = createEvent()
const selectFilterCondition = createEvent()

const changeInput = createEvent()
const inputReset = createEvent()

// значения данных из формы фильтрации
const $column = createStore('date').on(selectColumnValue, (_, data) => data)
const $filterCondition = createStore('equals').on(selectFilterCondition, (_, data) => data)
const $filterInput = createStore('').on(changeInput, (_, data) => data).reset(inputReset)
const $filterInputNumber = createStore('').on(changeInput, (store, data) => {
    return checkingForANumber(data) ? store : data
}).reset(inputReset)

// тип данных для фильтрации: string | number
const $filteredDataType = createStore('string')

// общее хранилище формы фильтрации
const $filterForm = combine({
    column: $column,
    filterCondition: $filterCondition,
    filterInput: $filterInput,
    filterInputNumber: $filterInputNumber,
    filteredDataType: $filteredDataType,
})

const $filterDataForm = createStore({})

// определение типа данных для фильтрации при выборе колонки
sample({
    clock: selectColumnValue,
    fn: (column) => {
        if (column === 'date' || column === 'name') return 'string'
        else return 'number'
    },
    target: $filteredDataType,
})

// установка дефолтных условий фильтрации для каждого типа
sample({
    clock: $filteredDataType,
    fn: (type) => {
        if (type === 'string') return 'equals'
        if (type === 'number') return 'more'
    },
    target: selectFilterCondition,
})

// контроль сообщения об ошибке
const resetErr = createEvent()
const errToggle = createEvent()

// submit формы
const onSubmitEvent = createEvent()

// информация об ошибке
const $filterFormError = createStore(false).on(errToggle, (_, data) => data).reset(resetErr)

// валидация
sample({
    clock: onSubmitEvent,
    source: [$filterInput, $filterInputNumber],
    filter: (value) => !!value,
    fn: () => true,
    target: errToggle,
})

// упаковка даннных формы для отправки
sample({
    clock: onSubmitEvent,
    source: $filterForm,
    filter: (form) => !!form.filterInput.toString() || !!form.filterInputNumber.toString(),
    fn: (filterData) => {

        const newFilterData = {
            column: filterData.column,
            filterCondition: filterData.filterCondition,
            filteredDataType: filterData.filteredDataType,
        }

        if (filterData.filteredDataType === 'string') newFilterData.filterInput = filterData.filterInput
        else newFilterData.filterInput = filterData.filterInputNumber
        return newFilterData
    },
    target: [$filterDataForm, isFilterOn, resetErr],
})

// отправка данных формы
sample({
    clock: onSubmitEvent,
    source: $filterDataForm,
    filter: (form) => !!form.filterInput.toString() || !!form.filterInputNumber.toString(),
    fn: (form) => ({dataFilter: form, page: 1}),
    target: [getFilteredItemFx, isFilterOn, resetErr],
})

// фильтруемая колонка для стилей
const resetColumnForFilter = createEvent()
const $columnForFilter = createStore('').reset(resetColumnForFilter)

// определение фильтруемой колонки
sample({
    clock: onSubmitEvent,
    source: $filterForm,
    fn: ({column, filterInput, filterInputValue}) => {
        if (filterInput || filterInputValue) return column
    }, target: $columnForFilter,
})

// сброс формы фильтрации
sample({
    clock: resetFilter,
    target: [inputReset, resetColumnForFilter, isFilterOff],
})

export {
    $column,
    $filterInput,
    $filterCondition,
    $filteredDataType,
    $filterInputNumber,
    $columnForFilter,
    $filterFormError,
    $filterDataForm,
    selectColumnValue,
    selectFilterCondition,
    changeInput,
    onSubmitEvent,
    resetFilter,
}