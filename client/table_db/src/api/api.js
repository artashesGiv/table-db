import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:5000/api/',
})

export const tableItemsAPI = {
    getItems(page = 1) {
        return instance.get(`item/${page}`)
    },

    createItem(item) {
        return instance.post('item', {...item})
    },

    deleteItem(id) {
        return instance.delete(`item/${id}`)
    },

    getFilteredItems({dataFilter, page = 1}) {
        return instance.put(`filter/${page}`, dataFilter)
    },
}