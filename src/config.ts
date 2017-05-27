export let config = {
    secret: 'hello world',
    logging: {
        path: './',
    },
    db: {
        uri: 'mongodb://localhost:27017/featuretoggledb'
    },
    sendGrid: {
        apiKey: '0a139705ddafc9ffc2a1f415d176175e68ab70f1acced808f405969f69781a4629b48d8abd690b8d077f175b5928b9c7f1acfca6f21af5eac117b4ead727dc54181f9dcca2'
    }
};
