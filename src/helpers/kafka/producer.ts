const { Kafka} =  require("kafkajs");

const kafka = new Kafka({
    clientId: 'chatApp',
    brokers : [`${process.env.KAFKA_IP}:${process.env.KAFKA_PORT}`]
})

const producer = kafka.producer()

export const run = async ()=> {
    await producer.connect()

    await producer.send({
        topic: 'hello-123',
        messages: [
            { value: 'Hello there how are you!' },
        ],
    })
    console.log('Message sent successfully')
}