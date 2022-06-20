import {combine, createEvent, createStore, sample} from 'effector'
import {createItemsFx} from '../table/model'
import {checkingForANumber} from '../../utils/validaton-utils'

// контроль инпутов
const changeName = createEvent()
const changeCount = createEvent()
const changeDistance = createEvent()

// сброс значений до дефолтных при submit
const resetName = createEvent()
const resetCount = createEvent()
const resetDistance = createEvent()

// контроль сообщения об ошибке
const resetErr = createEvent()
const errToggle = createEvent()
// submit формы
const onSubmitEvent = createEvent()

// значения и изменение инпутов
const $name = createStore('').on(changeName, (_, data) => data).reset(resetName)
const $count = createStore('')
    .on(changeCount, (store, data) => {
        return checkingForANumber(data) ? store : data
    })
    .reset(resetCount)
const $distance = createStore('')
    .on(changeDistance, (store, data) => {
        return checkingForANumber(data) ? store : data
    })
    .reset(resetDistance)

// информация об ошибке
const $err = createStore(false).on(errToggle, (_, data) => data).reset(resetErr)

// общее хранилище данных формы
const $form = combine({
    name: $name,
    count: $count,
    distance: $distance,
})

// валидация
sample({
    clock: onSubmitEvent,
    source: $form,
    filter: (form) => form.name === '' || form.count === '' || form.distance === '',
    fn: () => true,
    target: errToggle,
})

// отправка формы
sample({
    clock: onSubmitEvent,
    source: $form,
    filter: (form) => form.name !== '' && form.count !== '' && form.distance !== '',
    fn: (form) => {
        const {name, count, distance} = form
        return {
            name,
            // приведение строк к числу
            count: +count,
            distance: +distance,
        }
    },
    // отправка на сервер, сброс значений инпутов и ошибки до дефолтных
    target: [createItemsFx, resetDistance, resetCount, resetName, resetErr],
})

export {
    changeName,
    changeCount,
    changeDistance,
    $form,
    $err,
    resetName,
    resetCount,
    resetDistance,
    onSubmitEvent,
}

