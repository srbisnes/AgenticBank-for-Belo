## 2025-05-18 - Hoisting RegEx & Data Structures on Hot Paths
**Learning:** Instantiating RegEx objects and allocating intermediate arrays inside route handlers and React renders introduces unnecessary Garbage Collection overhead and CPU cycles on hot paths.
**Action:** Always hoist static RegEx patterns and constant arrays/sets to module scope, and prefer single-pass loops/reductions over intermediate `flatMap` or `Object.keys/values` calls.
