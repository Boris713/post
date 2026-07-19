# Items API (Postgres)

This is my Week 6 REST API, but now it saves data to a real Postgres database instead of just keeping it in an array. So the data actually sticks around after the server restarts.

## Run it

You need Node and a Postgres database. Can be local, or a free cloud one like Neon or Supabase.

```bash
npm install
psql "YOUR_DATABASE_URL" -f schema.sql   # makes the table, only run once
cp .env.example .env                      # then put your connection string in .env
npm start
```

Runs on http://localhost:3000

## The table

```sql
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'todo'
);
```

## Endpoints

| Method | Route          | What it does                                   |
| ------ | -------------- | ---------------------------------------------- |
| GET    | /api/items     | List all rows                                  |
| GET    | /api/items/:id | Get one row, 404 if it's not there             |
| POST   | /api/items     | Add a row, 400 if name is missing, returns 201 |
| PUT    | /api/items/:id | Update a row, 404 if it's not there            |
| DELETE | /api/items/:id | Delete a row, 404 if it's not there            |

## Test Evidence (curl)

Status code is in brackets at the end of each line.

```
$ curl http://localhost:3000/api/items
[] [200]

$ curl -X POST http://localhost:3000/api/items -H "Content-Type: application/json" -d '{"name":"Buy milk","status":"todo"}'
{"id":1,"name":"Buy milk","status":"todo"} [201]

$ curl -X POST http://localhost:3000/api/items -H "Content-Type: application/json" -d '{"name":"Walk dog"}'
{"id":2,"name":"Walk dog","status":"todo"} [201]

$ curl -X POST http://localhost:3000/api/items -H "Content-Type: application/json" -d '{"status":"todo"}'
{"error":"name is required"} [400]

$ curl http://localhost:3000/api/items
[{"id":1,"name":"Buy milk","status":"todo"},{"id":2,"name":"Walk dog","status":"todo"}] [200]

$ curl http://localhost:3000/api/items/1
{"id":1,"name":"Buy milk","status":"todo"} [200]

$ curl http://localhost:3000/api/items/999
{"error":"Not found"} [404]

$ curl -X PUT http://localhost:3000/api/items/1 -H "Content-Type: application/json" -d '{"status":"done"}'
{"id":1,"name":"Buy milk","status":"done"} [200]

$ curl -X PUT http://localhost:3000/api/items/999 -H "Content-Type: application/json" -d '{"status":"done"}'
{"error":"Not found"} [404]

$ curl -X DELETE http://localhost:3000/api/items/2
{"deleted":true} [200]

$ curl -X DELETE http://localhost:3000/api/items/2
{"error":"Not found"} [404]

$ curl http://localhost:3000/api/items
[{"id":1,"name":"Buy milk","status":"done"}] [200]
```

## Persistence check

I stopped the server, started it again, and the data was still there. That's the whole point of adding a database. It lives in Postgres now, not in memory:

```
$ curl http://localhost:3000/api/items
[{"id":1,"name":"Buy milk","status":"done"}] [200]
```

## Testing in VS Code

There's a requests.http file in here. If you have the REST Client extension, open it and hit "Send Request" over any block. Or just use Thunder Client or Postman on the same URLs.
