import app from "./app";
// const PORT = 9090;
const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
  console.log(`Listening... make requests on localhost:${PORT}`);
});
