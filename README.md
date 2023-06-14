# Prerequisites
- I used Node 18 for this project, it may or may not run on other versions
- MongoDB should be in ReplicaSet mode, required for change streams and transactions

# How to run
1. Clone the repo
2. Run `npm install`
3. Run `npm run build`
4. Run `npm run start:app` to start the app.ts
5. Run `npm run start:sync` to start the sync.ts
6. Run `npm run start:sync:full` to start the sync.ts in --full-reindex mode

You may also use `npm run dev:app`, `npm run dev:sync` and `npm run dev:sync:full` to run the app in development mode
