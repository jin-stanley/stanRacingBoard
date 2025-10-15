# Next to Go Races

Racing app showing next 5 races from Neds API. Built with Vue 3 + TypeScript.

## Run Project

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## What it does

- Show 5 upcoming races
- Live countdown timer
- Filter by race type (Horse/Greyhound/Harness)
- Filter by country
- Auto refresh every minute
- Race disappear after 60s when started

## Tech I used

- Vue 3 (Composition API)
- TypeScript
- Pinia for state
- SCSS for styles
- Vite

## Folder structure

```
src/
├── components/     - 6 Vue components
├── stores/        - Pinia store
├── services/      - API stuff
├── utils/         - helper functions
├── types/         - TypeScript types
└── assets/        - SCSS variables
```

## Some notes

### State management
I use Pinia instead of Vuex because it simpler and better TypeScript. The store do these things:
- Fetch data from API
- Refresh data every 60s
- Filter races by category/country
- Group by venue

### Error handling
Add some basic error handling:
- Timeout after 10s
- Show error message if API fail
- Can retry when error
- Check if response is valid

Because sometimes API can down or slow, so better to handle it.

### Tests
Write some unit tests for main logic:
- Time format functions
- Store filter logic
- API errors

Total 11 tests. I know not 100% coverage but I think test the important business logic is enough. UI test maybe use E2E better, but didn't have time to do it.

### Styles
Using scoped SCSS in components. At first I try CSS Modules but then remove it, feel like too much for small project. Scoped CSS is enough and more simple to maintain.

Put all colors/spacing in variables file so can change theme easy.

## Why I choose these

**Pinia vs Vuex**
Pinia is new and simpler. Also Vue 3 recommend it now.

**No component library**
Want to show I can build UI myself. Also bundle size smaller.

**60s refresh**
Balance between fresh data and not call API too much. Can change if need.

**What I didn't add**
- Race detail modal (can click race to see more info)
- Save favorite races
- Offline mode
- easy animations

Most of these not in requirements so I focus on main features first.

## Code quality

```bash
npm run lint        # 0 errors
npm run type-check  # 0 errors
npm run test:unit   # 11/11 pass
```

## Browser tested

Chrome and Firefox work good. Should work on Safari/Edge too(I didn't test them).

## The API

```
https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=100
```

Get 100 races but only show 5 next ones.

## If have more time

Could add:
- Race detail page
- Better mobile design
- Loading skeleton
- API cache
- Push notification for race start

But try not over-engineer for now.

## Development process

**Time spent:** About 6 hours total

**AI assistance:**
I used AI (Cursor and ChatGPT) to help with store and utils structure. To be honest, I needed help to quickly understand the product requirements and data structure. This really help me understand what exactly need to build.

**Design inspiration:**
I looked at these racing sites for UI/UX ideas:
- https://www.neds.com.au/racing
- https://www.ladbrokes.com.au/racing
- https://www.playup.com.au/betting/racing
- https://swiftbet.com.au/racing

Borrow some layout ideas from them but make it simpler for this project.

## Other notes

First time use Pinia, usually use Vuex. Also I simplify the code after first version - remove some abstractions that not really need.

Project is around 2000 lines include tests.
