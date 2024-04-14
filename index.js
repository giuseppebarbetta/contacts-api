const express = require('express')
const uuid = require('uuid')
const cors = require('cors')

const app = express()
const port = 3001

app.use(express.json())
app.use(cors())

const orders = []

const checkIdUser = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex( order => order.id === id)

    if(index <0) {
        return response.status(404).json({error: "Order not found"})
    }

    request.orderId = id
    request.orderIndex = index

    next()
}

const showMethods = (request, response, next) => {
    console.log(request.url)
    console.log(request.method)

    next()
}

app.post('/orders', showMethods, (request, response) => {
    const {clientName, order, price} = request.body
    const newOrder = {id:uuid.v4(), order, clientName, price, status: "Em preparação"}

    orders.push(newOrder)
    return response.status(201).json(newOrder)
})

app.get('/orders', showMethods,(request, response) => {
    return response.json(orders)
})

app.patch('/orders/:id', showMethods, checkIdUser, (request, response) => {
    const index = request.orderIndex
    const {status} = request.body

    const updateOrder = orders[index]

    updateOrder.status = status

    return response.json(updateOrder)
})

app.put('/orders/:id', showMethods, checkIdUser, (request, response) => {
    const id = request.orderId
    const index = request.orderIndex
    const { order, clientName, price, status} = request.body

    const updatedOrder = {id, order, clientName, price, status}

    orders[index] = updatedOrder

    return response.json(updatedOrder)
})

app.delete('/orders/:id', showMethods, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get('/orders/:id', showMethods, checkIdUser, (request, response) => {
    const index = request.orderIndex
    return response.json(orders[index])
})

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})