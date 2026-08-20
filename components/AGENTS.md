# Context for Agents: /components

## Component State Architecture
This dashboard does not use Redux or Zustand. Global state is managed entirely through the URL query string and `DataProvider.tsx`.

### The URL is the Source of Truth
Global filters (Province, Program, Vendor, Prio1, Prio2) are attached to the URL via standard `?province=X` parameters. 

### `DataProvider.tsx`
This context provider reads `useSearchParams()`, filters the raw row data, runs it through `lib/transforms.ts`, and broadcasts the calculated metrics down the tree. 
* Do not attempt to add local React state (`useState`) for global dashboard filters. Always push it to the URL query parameters so the entire dashboard stays synced.

### `Sidebar.tsx` (Preserving State)
Because the URL is the source of truth, navigating between routes (e.g. from `/overview` to `/pipeline`) will wipe out the user's active filters if the query string is dropped. 
* `Sidebar.tsx` has been explicitly engineered to append the current `useSearchParams().toString()` to every navigation `<Link>`. 
* **Rule**: If you add new navigation buttons or tabs anywhere in the UI, you MUST carry over the query string exactly as the Sidebar does.
