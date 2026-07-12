import express from "express";
import {env} from "./config/env.js";

const app = express();
app.use(express.json());

app.get('/', (req, res)=>{
    res.send("Payflow API is running");
});

app.listen(env.PORT, ()=>{
    console.log(`Server running on port ${env.PORT}`);
});