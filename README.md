# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **example** directory and create a blank **src/app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


## Silksong Items and Quests navigation

- **Items** replaces the Silksong **Tools & Crests** tab and includes tools,
  crests, Mask Shards, Spool Fragments, Memory Lockets, Silk Hearts,
  Pale Oil, Craftmetal, and Skills & Abilities.
- Swipe the category filters to focus on an item family; search and
  collected/not-collected filters work across the combined list.
- **Quests** is a separate Silksong-only tab showing all 54 wishes, with quest
  type, location, rewards, search, and completed/not-completed filters.
- **Progress** keeps its existing completion breakdown. Tapping a category
  opens the relevant Items filter or Quests tab. The old all-collectibles
  checklist remains available as a combined view.
- The original item names and `c:<name>` keys remain unchanged, so existing
  checkmarks and notes carry over automatically. Quests are marked **Completed**.
- The Hollow Knight **Charms** tab remains unchanged.

These are JavaScript-only navigation changes; test with the existing Expo
  development client. No API rebuild or new native binary is needed unless
  you change native dependencies. Publishing the Surge data API separately
  is only necessary for data changes, not these tab UI changes.
