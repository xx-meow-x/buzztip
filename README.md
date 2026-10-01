# BuzzTip

A campus community app for TIP: chats, course group chats, groups, a campus feed,
announcements, events, reminders, a marketplace, lost & found and a freedom wall.

This is the **client-side prototype**. Everything is saved in the browser
(localStorage). There is no server or database yet.

## Run it

```bash
npm install
npm run dev          # opens http://localhost:5173
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Production build in `dist/` |
| `npm run preview` | Serves the `dist/` build locally |
| `npm run build:single` | One self-contained HTML file in `dist-single/` for sharing a preview |

**Demo account:** `user@tip.edu.ph` / `buzztip123`. The login screen has a "Fill in" button.
You can also register any `@tip.edu.ph` email with a password of 8+ characters.

To start over, open **Profile → Reset demo data**.

## What works

- **Sign up and log in.** Only `@tip.edu.ph` emails, 8+ character passwords, duplicate emails rejected. You stay logged in after a refresh.
- **Course group chats.** Every account is put into the chats for its enrolled courses (sample enrollment for now). They show a "Course" tag and can't be left.
- **Chats.** Each chat has its own messages. Someone "replies" a few seconds after you send (turn this off in `src/config.js`). Unread counts show on the Chats tab.
- **Groups.** Join, leave and create groups. Creating a group lets you pick members and opens its chat.
- **Create menu (+).** New Post, Group Chat, Campus Event, Announcement, Lost & Found, Freedom Wall and Marketplace Listing all work.
- **Lost & Found / Marketplace.** "Message", "I found this!", "This is mine!" and "Message Seller" open a real direct message. Your own posts can be marked resolved or sold. Listings and your profile picture accept photo uploads.
- Light and dark mode, saved per browser.

## Project layout

```
src/
  main.jsx            App entry: router + providers
  App.jsx             All routes
  config.js           Switches: email domain, password length, simulated replies, data version
  styles/global.css   All styles. Colors are CSS variables at the top (light + dark)
  assets/
    logo.svg          The bee logo, used everywhere
    icons.js          Every emoji icon in one map
  data/seed.js        Sample data the app starts with
  store/
    AppContext.jsx    App state, saved to localStorage
    actions.js        Every state change (one function per action)
    selectors.js      Lookups: membership, chat titles, unread counts
    UIContext.jsx     Bottom sheets and toasts
  lib/
    auth.js           Validation and password hashing (prototype only)
    enrollment.js     Where course group chats come from
    storage.js        load/save (swap for API calls later)
    format.js         Dates, money, ids
  components/         Shared UI: headers, nav, avatars, cards, sheet
  screens/            One file per page
  sheets/             One file per bottom sheet/form
```

## Replacing images and icons

- **Logo:** replace `src/assets/logo.svg`. The welcome screen, headers and Freedom Wall avatars all use it.
- **Icons:** every emoji is in `src/assets/icons.js`. Change a value there and it updates everywhere. To use image or SVG icons instead, put the files in `src/assets/` and render them where `ICONS.x` is used.
- **Line icons** (back, menu, send, pin…) are in `src/components/Icon.jsx`.
- **Avatars:** `<Avatar src="...">` shows a photo; without `src` it shows initials. Users can upload a profile picture in Edit Profile.
- **Marketplace photos:** listings with an `image` show it; otherwise they show their `icon`.
- **Colors:** edit the tokens at the top of `src/styles/global.css`.

## Connecting a backend later

The app is set up so each piece can be swapped one at a time:

1. **Storage:** `src/lib/storage.js` loads and saves the whole state. Replace it with API calls, or move to fetching per screen.
2. **Actions:** each function in `src/store/actions.js` is one change (send message, create group, RSVP…). Each maps to one API endpoint.
3. **Auth:** `src/lib/auth.js`. Move registration, login and password hashing to the server (bcrypt or argon2). The SHA-256 in the browser is **not** real security.
4. **Student number:** `verifyStudentNumber()` in `src/lib/auth.js` is a stub. Add the field to `screens/Register.jsx` when you're ready.
5. **Enrollment:** replace `getEnrolledCourses()` in `src/lib/enrollment.js` with a lookup by student number. Course chats then follow real enrollment.
6. **Real-time chat:** replace the simulated replies (`SIMULATE_REPLIES` in `config.js`) with WebSockets or a service like Firebase/Supabase.
7. **Routing:** `HashRouter` in `main.jsx` works on any static host. Switch to `BrowserRouter` once a server handles routes.

If you change the shape of `data/seed.js`, bump `DATA_VERSION` in `config.js` so old saved data is replaced.
