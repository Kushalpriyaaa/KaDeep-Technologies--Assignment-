# PRODUCTION CRASH FIX - Symbol(functionName) Error

## ROOT CAUSE ANALYSIS

### The Error
```
TypeError: Cannot read properties of undefined (reading 'Symbol(functionName)')
```

### Why It Happened

Your app was importing the Convex `api` object using **relative paths** like:
```javascript
import { api } from '../../../../convex/_generated/api';
```

**This worked in development** because:
- The `convex/` folder exists at the project root
- Vite dev server can resolve relative paths outside the `client/` directory

**This FAILED in production** because:
- Vite builds from `client/` directory
- The `convex/` folder is OUTSIDE the build source tree
- After bundling, those imports resolve to `undefined`
- When `useQuery(api.modules.menu.menu.getAvailableMenuItems)` executes with `api = undefined`
- Convex client tries to access `undefined.modules.menu.menu.getAvailableMenuItems`
- Then tries to read `Symbol(functionName)` property on undefined → **CRASH**

## THE FIX

### Created Bundled API File
Created [client/src/convex-api/api.js](client/src/convex-api/api.js) with all function references properly structured:

```javascript
export const api = {
  modules: {
    menu: {
      menu: {
        getAvailableMenuItems: { 
          _functionName: "modules/menu/menu:getAvailableMenuItems", 
          [Symbol.for("functionName")]: "modules/menu/menu:getAvailableMenuItems" 
        },
        // ... all other functions
      },
    },
    // ... all other modules
  },
};
```

### Updated All Imports
Changed **14 files** from relative imports to bundled imports:

**Admin Pages:**
- [client/src/admin/pages/Dashboard.jsx](client/src/admin/pages/Dashboard.jsx)
- [client/src/admin/pages/Orders.jsx](client/src/admin/pages/Orders.jsx)
- [client/src/admin/pages/Menu.jsx](client/src/admin/pages/Menu.jsx)
- [client/src/admin/pages/Offers.jsx](client/src/admin/pages/Offers.jsx)
- [client/src/admin/pages/Profile.jsx](client/src/admin/pages/Profile.jsx)
- [client/src/admin/pages/Reports.jsx](client/src/admin/pages/Reports.jsx)
- [client/src/admin/pages/SpecialServingHours.jsx](client/src/admin/pages/SpecialServingHours.jsx)

**User Pages:**
- [client/src/user/pages/Home.jsx](client/src/user/pages/Home.jsx)
- [client/src/user/pages/UserMenu.jsx](client/src/user/pages/UserMenu.jsx)
- [client/src/user/pages/Cart.jsx](client/src/user/pages/Cart.jsx)
- [client/src/user/pages/Profile.jsx](client/src/user/pages/Profile.jsx)
- [client/src/user/pages/ServingHours.jsx](client/src/user/pages/ServingHours.jsx)

**Components & Context:**
- [client/src/user/components/CategoryPopup.jsx](client/src/user/components/CategoryPopup.jsx)
- [client/src/context/AuthContext.jsx](client/src/context/AuthContext.jsx)

All now use:
```javascript
import { api } from '../../convex-api/api';  // or appropriate relative path
```

## VERIFICATION STEPS

Before deploying, verify locally:

1. **Clear everything:**
   ```powershell
   cd client
   Remove-Item -Recurse -Force dist, node_modules\.vite
   ```

2. **Build:**
   ```powershell
   npm run build
   ```

3. **Check bundled output:**
   ```powershell
   Select-String -Path "dist/assets/*.js" -Pattern "convex-api" | Select-Object -First 5
   ```
   Should show the api object is bundled.

4. **Preview production build:**
   ```powershell
   npm run preview
   ```
   Test all pages (admin, user, login, etc.)

## DEPLOYMENT CHECKLIST

- [x] Created bundled api.js file with all function references
- [x] Updated all 14 import statements
- [ ] Test local production build
- [ ] Deploy to Render/Vercel
- [ ] Test deployed app in incognito mode
- [ ] Verify no console errors

## WHY THIS FIX WORKS

1. **api.js is now in client/src/**: Vite can bundle it properly
2. **All Symbol(functionName) properties are defined**: No undefined access
3. **Function references match backend**: All deployed Convex functions are present
4. **No external dependencies**: Everything Vite needs is within build root

## MAINTENANCE NOTE

**IMPORTANT:** When you add new Convex functions:

1. Add them to the backend (`convex/modules/...`)
2. Deploy backend: `npx convex deploy`
3. Update `client/src/convex-api/api.js` with the new function reference:
   ```javascript
   newFunction: { 
     _functionName: "modules/path/file:newFunction", 
     [Symbol.for("functionName")]: "modules/path/file:newFunction" 
   }
   ```

Or create a script to auto-generate this from `convex/_generated/api.d.ts`.
