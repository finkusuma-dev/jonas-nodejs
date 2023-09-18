import app from "./app";

console.log('NODE_ENV:',process.env.NODE_ENV);

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
  console.log(`server listening: http://127.0.0.1:${PORT}`);
})