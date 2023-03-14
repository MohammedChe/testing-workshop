const mongoose = require('mongoose');
let db;

const connect = async () => {
    db = null;

    try {
        // mongoose.set('strictQuery', false);

        await mongoose.connect(process.env.DB_ATLAS_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Connected successfully to db");
        db = mongoose.connection;
    }
    catch(error) {
        console.log(error);
    }
    finally {
        if(db !== null && db.readyState === 1) {
            // await db.close();
            // console.log("Disconnected successfully from db");
        }
    }
};

const disconnect = async () => {
  await db.close();
}

module.exports = { connect,  disconnect};