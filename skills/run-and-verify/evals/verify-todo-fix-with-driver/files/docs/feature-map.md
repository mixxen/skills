# Feature map

## Todo list (aliases: list, my todos)
Where: Main screen
What the user can do: see all todos with their done state
Reach it with the driver: `node scripts/drive.mjs list`
Code: server.mjs (GET /todos)
Shares state with: Complete a todo, Clear completed

## Remaining count (aliases: items left, counter)
Where: Main screen > footer, "3 items left"
Reach it with the driver: `node scripts/drive.mjs stats`
Code: server.mjs (GET /todos/stats)
Shares state with: Complete a todo, Clear completed

## Add a todo (aliases: new todo)
Where: Main screen > input at the top
Reach it with the driver: `node scripts/drive.mjs add <title>`
Code: server.mjs (POST /todos)

## Complete a todo (aliases: tick, check off)
Where: Main screen > checkbox next to a todo
What the user can do: tick a todo to mark it done
Reach it with the driver: `node scripts/drive.mjs complete <id>`
Code: server.mjs (POST /todos/:id/complete)
Shares state with: Remaining count, Clear completed, Todo list

## Clear completed (aliases: clean up)
Where: Main screen > footer button
Reach it with the driver: `node scripts/drive.mjs clear-completed`
Code: server.mjs (POST /todos/clear-completed)
Shares state with: Complete a todo, Remaining count, Todo list
