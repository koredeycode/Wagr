// // lib/auth-client.ts
// import { createAuthClient } from "better-auth/client";
// import { siweClient } from "better-auth/client/plugins";

// export const authClient = createAuthClient({
//   plugins: [siweClient()],
//   baseURL: "/api/auth", // Matches your API route
// });

import { createAuthClient } from "better-auth/client";
import { siweClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [siweClient()],
});
