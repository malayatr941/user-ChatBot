import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: 'chatApp',
    brokers: ['localhost:9092']
})

const consumer = kafka.consumer({groupId:'kafka'})

export const run = async () => {
    await consumer.connect()
    await consumer.subscribe({topic: 'hello 123', fromBeginning:true})

    await consumer.run({
        eachMessage: async ({partition,message}) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString()
            });
        }
    })
}