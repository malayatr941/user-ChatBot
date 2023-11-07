const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: 'chatApp',
    brokers : [`${process.env.KAFKA_IP}:${process.env.KAFKA_PORT}`]
})

const consumer = kafka.consumer({groupId:'kafka'})

export const Crun = async () => {
    await consumer.connect()
    await consumer.subscribe({topic: 'hello-123', fromBeginning:true})

    await consumer.run({
        eachMessage: async ({partition,message}:any) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString()
            });
        }
    })
}