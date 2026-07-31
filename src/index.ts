import app from "./server.js"
import {env} from "./config/env.js";

const PORT = env.PORT || 5000;

const server = app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`);
})