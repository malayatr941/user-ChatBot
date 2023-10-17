import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: 'chatApp',
    brokers : ['localhost:9092']
})

const producer = kafka.producer()

export const run = async ()=> {
    await producer.connect()

    await producer.send({
        topic: 'hello 123',
        messages: [
            { value: 'Hello there how are you!' },
        ],
    })
    console.log('Message sent successfully')
}