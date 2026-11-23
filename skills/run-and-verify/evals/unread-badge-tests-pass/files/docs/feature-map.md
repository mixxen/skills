# Feature map

## Inbox (aliases: mail, message list)
Where: Main screen
What the user can do: open the inbox to read messages; opening it marks everything read
Reach it with the driver: `node scripts/drive.mjs open-inbox`
Code: server.mjs (GET /inbox), src/inbox.mjs (markAllRead)
Shares state with: Unread badge, Archive

## Unread badge (aliases: badge, unread count, bell)
Where: Top bar, red number on the bell icon
What the user can do: see how many unread messages are waiting in the inbox (archived messages don't count)
Reach it with the driver: `node scripts/drive.mjs badge`
Code: server.mjs (GET /badge), src/inbox.mjs (unreadCount)
Shares state with: Inbox, Archive

## Archive (aliases: archive a message)
Where: Inbox > archive icon on a message
What the user can do: move a message out of the inbox
Reach it with the driver: `node scripts/drive.mjs archive <id>`
Code: server.mjs (POST /messages/:id/archive)
Shares state with: Inbox, Unread badge

## Reset demo data
Reach it with the driver: `node scripts/drive.mjs reset`
Code: server.mjs (POST /reset)
