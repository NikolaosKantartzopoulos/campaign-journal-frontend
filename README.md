## Sample mySQL, NextJS Web Application

( ORM Prisma, Jest, MuiMaterial UI, NextAuth, Tanstack Query )

Site is available [here](https://dnd.rtlan.gr/) via Cloudflare tunneling.

## Overview

**Create fantasy worlds**, add character and location entries (images allowed). </br>
**Use filters and search** to find anything with ease.</br>
**Invite friends** using their username to access your world information.</br>

## 1. [Setup backend instructions](https://github.com/NikolaosKantartzopoulos/campaign-journal-backend)

## 2. Start the app

```
yarn dev
```

## 3. Take a look

#### Create new user or login with:

```
Username u1
Password pp
```

### Sample site use

1. Click you login name (top right corner) to go to settings and create a New World.
2. Create a Faction and add invited friends using their username. This is your play party!
3. Go to characters/locations tab and create a new character/location. Maybe upload an image.

### Separate views for Dungeon Master and players

#### Dungeon Master

- CRUD operations allowed

#### Players & Dungeon Master

Click any entry to see detailed information and the image added.

- Locations

  - Narrow down to the location you want. E.g. Earth > England > London > Westminster
  - Sort by column
  - Text search

- Characters
  - Sort by column
  - Text search

## Contains bash scripts for...

- starting / stopping mySQL containers.
- creating mySQL dump files, which are used to [push changes](https://github.com/NikolaosKantartzopoulos/campaign-journal-frontend/blob/main/infra/scripts/restoreProductionDatabase.sh) to the database schema and/or data to remote server machine.
- [deploying to remote server](https://github.com/NikolaosKantartzopoulos/campaign-journal-frontend/blob/main/infra/scripts/deployFEtoServer.sh). The script checks that build is ok (linting, tsc, basic test), then copies via ssh and scp the needed files to the remote server machine, and reloads the server.
