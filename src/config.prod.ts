export let config = {
    db: {
        uri: 'mongodb://mongo:27017/featuretoggle',
    },
    emailOptions: {
        address: "5 BOLINGBROOK, SIR GEORGE GREY STREET, ORANJEZICHT, 8001",
        applicationName: "World of Rations",
        baseUri: "https://worldofrations.com",
        verificationUrl: "https://user-service.worldofrations.com/api/users/verify",
    },
    logging: {
        path: '/logs/',
    },
    secret: 'hello world',
    sendGrid: {
        apiKey: '0a139705ddafc9ffc2a1f415d176175e68ab70f1acced808f405969f69781a4629b48d8abd690b8d077f175b5928b9c7f1acfca6f21af5eac117b4ead727dc54181f9dcca2',
    },
};
