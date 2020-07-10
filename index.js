const server = require("./server.js");


const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
    console.log(`\n* Server Running on http://localhost:${PORT} *\n`);
});
