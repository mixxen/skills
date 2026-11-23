# Agent instructions

## Setup
- Run `make dev` to start the app.
- Use npm for installing packages.

## Code style
- NEVER use async/await in tests. (Added after the flaky upload test in March.)
- Do not import anything from src/electron-main inside src/electron-renderer.
- Always use the logger from src/lib/log instead of console.log.
- It's fine to use setTimeout in ChatList because the message store updates late; a 50ms delay fixes the scroll jump.
- We skip type checking in src/legacy because the types there are too hard to fix.

## Product
- Ask the product owner before changing any pricing or billing copy.
- Keep error messages user-friendly; never show stack traces to users.

## Testing
- Write tests for new features.
- NEVER use async/await in tests.
