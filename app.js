const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "todoApplication.db");

const app = express();
app.use(express.json());

let db = null;

const initializationDBServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running");
    });
  } catch (error) {
    console.log(`error in db ${error.message}`);
    process.exit(1);
  }
};
initializationDBServer();

app.get("/todos/", async (request, response) => {
  const {
    id,
    todo,
    category,
    search_q = "",
    priority,
    status,
    due_date,
  } = request.query;
  console.log(search_q);
  if (status !== "") {
    const requestQuery = `SELECT * FROM todo WHERE status = '${status}';`;
    const dbSet = await db.all(requestQuery);
    response.send(dbSet);
  } else if (priority !== "") {
    const requestQuery = `
    SELECT 
      * 
    FROM 
      todo 
    WHERE 
      priority='${priority}';`;
    const dbSet = await db.all(requestQuery);
    response.send(dbSet);
  } else if (priority !== "" && status !== "") {
    const requestQuery = `SELECT * FROM todo WHERE priority='${priority}' AND status='${status}';`;
    const dbSet = await db.all(requestQuery);
    response.send(dbSet);
  } else if (category !== "") {
    const requestQuery = `SELECT * FROM todo WHERE category='${category}';`;
    const dbSet = await db.all(requestQuery);
    response.send(dbSet);
  } else if (category !== "" && status !== DONE) {
    const requestQuery = `SELECT * FROM todo WHERE category='${category}' AND status = '${status}';`;
    const dbSet = await db.all(requestQuery);
    response.send(dbSet);
  } else if (search_q !== "") {
    const requestQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%';`;
    const dbSet = await db.all(requestQuery);
    response.send(dbSet);
  } else if (category !== "" && priority !== "") {
    const requestQuery = `SELECT * FROM todo WHERE category='${category}' AND priority='${priority}';`;
    const dbSet = await db.all(requestQuery);

    response.send(dbSet);
  } else {
    response.status(400);
  }
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getBookQuery = `
    SELECT
      *
    FROM
      todo
    WHERE
      id = ${todoId};`;
  const report = await db.get(getBookQuery);
  response.send(report);
});

app.get("/agenda/", async (request, response) => {
  const {
    id,
    todo,
    category,
    search_q = "",
    priority,
    status,
    due_date,
  } = request.query;
  const agendaQuery = `SELECT * FROM todo WHERE due_date = '${due_date}' ;`;
  const data = await db.all(agendaQuery);
  console.log(data);
  response.send(data);
});

module.exports = app;
