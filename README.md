# Resource API

Simple in-memory REST API with Node.js and Express. No db, data is stored
in an array and resets when the server restarts.

## Run

```bash
npm install
npm start
```

Server runs on http://localhost:3000

## Endpoints

| Method | Route              | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | /api/resources     | List all                 |
| GET    | /api/resources/:id | Get one (404 if missing) |
| POST   | /api/resources     | Create (201)             |
| PUT    | /api/resources/:id | Update (404 if missing)  |
| DELETE | /api/resources/:id | Delete (404 if missing)  |

## Test Evidence (curl)

Status code shown in brackets at the end of each line.

```
$ curl http://localhost:3000/api/resources
[] [200]

$ curl -X POST http://localhost:3000/api/resources -H "Content-Type: application/json" -d '{"name":"Buy milk"}'
{"id":1,"name":"Buy milk"} [201]

$ curl http://localhost:3000/api/resources/1
{"id":1,"name":"Buy milk"} [200]

$ curl http://localhost:3000/api/resources/99
{"error":"Not found"} [404]

$ curl -X PUT http://localhost:3000/api/resources/1 -H "Content-Type: application/json" -d '{"name":"Buy oat milk"}'
{"id":1,"name":"Buy oat milk"} [200]

$ curl -X DELETE http://localhost:3000/api/resources/1
{"deleted":true} [200]

$ curl http://localhost:3000/api/resources
[] [200]
```

Server console (the logging middleware):

```
2026-07-13T03:24:57.106Z GET /api/resources
2026-07-13T03:24:57.127Z POST /api/resources
2026-07-13T03:24:57.137Z GET /api/resources/1
2026-07-13T03:24:57.146Z GET /api/resources/99
2026-07-13T03:24:57.155Z PUT /api/resources/1
2026-07-13T03:24:57.163Z DELETE /api/resources/1
2026-07-13T03:24:57.171Z GET /api/resources
```
