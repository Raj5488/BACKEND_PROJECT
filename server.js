import connectionToDB from "./Config/DBConnection.js";
import app from "./app.js"
const PORT = process.env.PORT || 3000;

app.listen(PORT, async ()=>{
    await connectionToDB();
    console.log(`app is running on http://localhost:${PORT}`);
})

