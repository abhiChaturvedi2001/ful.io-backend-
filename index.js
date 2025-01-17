import express from "express";
import { connectDb } from "./config/db.js";
import cors from "cors";
import csvParser from 'csv-parser';
import fs from 'fs';
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import Record from "./model/Record.js";
dotenv.config({})

const app = express();
const options = {
    origin: "https://ful-io-frontend.vercel.app",
    credentials: true
}
app.use(express.json());
app.use(cors(options))
app.use("/auth", authRoutes);


app.get('/sync-data', async (req, res) => {
    const csvPath = "./files/file.csv";

    try {
        const bulkData = [];

        // Read and parse the CSV file using fs and csv-parser
        const stream = fs.createReadStream(csvPath).pipe(csvParser());

        stream.on('data', (row) => {
            bulkData.push(row);
        });
        stream.on('end', async () => {
            // Insert data into MongoDB
            await Record.insertMany(bulkData);
            res.status(200).json({ message: 'Data synced successfully' });
        });
        stream.on('error', (err) => {
            res.status(500).json({ message: 'Error syncing data' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error syncing data' });
    }
});


const port = process.env.PORT || 5000;
connectDb()
    .then(() => {
        console.log("Database connected successfully");
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });
