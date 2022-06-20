const db = require('../db')

class TableController {
    async createItem(req, res) {
        const {name, count, distance} = req.body
        const date = new Date()
        const dateCreate = date.toLocaleDateString()
        const newItem = await db.query('INSERT INTO table_item (name, date_create, count, distance) values ($1, $2, $3, $4) RETURNING *', [name, dateCreate, count, distance])
        return res.json(newItem.rows[0])
    }

    async getItems(req, res) {
        const page = req.params.page
        const limit = 10
        const offset = page === 1 ? 0 : (page * limit) - limit
        const items = await db.query('SELECT * FROM table_item ORDER BY id LIMIT $1 OFFSET $2', [limit, offset])
        const totalCount = await db.query('SELECT count(*) FROM table_item')
        const obj = {
            items: items.rows,
            currentPage: page,
            totalCount: totalCount.rows[0].count,
        }
        res.json(obj)
    }

    async getFilteredItems(req, res) {
        const page = req.params.page
        const {column, filterCondition, filteredDataType, filterInput} = req.body
        const limit = 10
        const offset = page === 1 ? 0 : (page * limit) - limit
        let items
        let totalCount

        if (!filterInput) items = await db.query('SELECT * FROM table_item ORDER BY id LIMIT $1 OFFSET $2', [limit, offset])
        if (filteredDataType === 'string') {
            if (column === 'date') {
                if (filterCondition === 'equals') {
                    items = await db.query('SELECT * FROM table_item  WHERE date_create = $1 ORDER BY id LIMIT $2 OFFSET $3', [filterInput, limit, offset])
                    totalCount = await db.query('SELECT count(*) FROM table_item  WHERE date_create = $1', [filterInput])
                }
                if (filterCondition === 'contains') {
                    items = await db.query('SELECT * FROM table_item  WHERE POSITION($1 in date_create) > 0 ORDER BY id LIMIT $2 OFFSET $3', [filterInput, limit, offset])
                    totalCount = await db.query('SELECT count(*) FROM table_item  WHERE POSITION($1 in date_create) > 0', [filterInput])
                }
            }
            if (column === 'name') {
                if (filterCondition === 'equals') {
                    items = await db.query('SELECT * FROM table_item  WHERE LOWER(name) = $1 ORDER BY id LIMIT $2 OFFSET $3', [filterInput.toLowerCase(), limit, offset])
                    totalCount = await db.query('SELECT count(*) FROM table_item  WHERE LOWER(name) = $1', [filterInput.toLowerCase()])
                }
                if (filterCondition === 'contains') {
                    items = await db.query('SELECT * FROM table_item  WHERE POSITION($1 in LOWER(name)) > 0 ORDER BY id LIMIT $2 OFFSET $3', [filterInput.toLowerCase(), limit, offset])
                    totalCount = await db.query('SELECT count(*) FROM table_item  WHERE POSITION($1 in LOWER(name)) > 0', [filterInput.toLowerCase()])
                }
            }
        }

        if (filteredDataType === 'number') {
            if (column === 'count') {
                if (filterCondition === 'more') {
                    items = await db.query('SELECT * FROM table_item WHERE count >= $1 ORDER BY id LIMIT $2 OFFSET $3', [filterInput, limit, offset])
                    totalCount = await db.query('SELECT count(*) FROM table_item WHERE count >= $1', [filterInput])
                }
                if (filterCondition === 'less') {
                    items = await db.query('SELECT * FROM table_item WHERE count <= $1 ORDER BY id LIMIT $2 OFFSET $3', [filterInput, limit, offset])
                    totalCount = await db.query('SELECT count(*) FROM table_item WHERE count < $1', [filterInput])
                }
            }
            if (column === 'distance') {
                if (filterCondition === 'more') {
                    items = await db.query('SELECT * FROM table_item WHERE distance >= $1 ORDER BY id LIMIT $2 OFFSET $3 ', [filterInput, limit, offset])
                    totalCount = await db.query('SELECT count(*) FROM table_item WHERE count >= $1', [filterInput])
                }
                if (filterCondition === 'less') {
                    items = await db.query('SELECT * FROM table_item WHERE distance <= $1 ORDER BY id LIMIT $2 OFFSET $3 ', [filterInput, limit, offset])
                    totalCount = await db.query('SELECT count(*) FROM table_item WHERE count < $1', [filterInput])
                }
            }
        }

        const obj = {
            items: items.rows,
            currentPage: page,
            totalCount: totalCount.rows[0].count,
        }
        res.json(obj)
    }

    async getOneItem(req, res) {
        const id = req.params.id
        const item = await db.query('SELECT * FROM table_item where id = $1', [id])
        res.json(item.rows[0])
    }

    async updateItem(req, res) {
        const {id, name, count, distance} = req.body
        const item = await db.query('UPDATE table_item set name = $1, count = $2, distance = $3 where id = $4 RETURNING *', [name, count, distance, id])
        res.json(item.rows[0])
    }

    async deleteItem(req, res) {
        const id = req.params.id
        const item = await db.query('DELETE FROM table_item where id = $1', [id])
        res.json(item.rows[0])
    }
}

module.exports = new TableController()