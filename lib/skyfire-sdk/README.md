## Skyfire Widget Migration Note

### Install Skyfire Widget

#### Add Privider to the app

```
import SkyfireWidget from "@/lib/skyfire-sdk/components/skyfire-widget"
import { SkyfireProvider } from "@/lib/skyfire-sdk/context/context"

<SkyfireProvider>
   <YourAppProvider>
      <div className="relative flex min-h-screen flex-col pb-20">
      <SiteHeader />
      <SkyfireWidget />
      <div className="flex-1">{children}</div>
      </div>
      <TailwindIndicator />
   </YourAppProvider>
</SkyfireProvider>

```

#### Add API route for proxy call

```
api/chat/route.ts
```

### Shadcn dependencies

```
npx shadcn@latest add alert avatar badge card form input scroll-area table tooltip dialog popover tabs toast
```

### NPM dependencies

```
yarn add @hookform/resolvers react-hook-form zod framer-motion react-markdown ai axios
```

### Tailwind config

```
content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
```

### Set Environment variable
