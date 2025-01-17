import mongoose from "mongoose";
const recordSchema = new mongoose.Schema({}, { strict: false });
const Record = mongoose.model('Record', recordSchema);

export default Record