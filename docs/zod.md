# Zod

```ts
import { z } from "zod";

const User = z.object({
	name: z.string(),
	age: z.number(),
});

// some untrusted data...
const input = {
	/* stuff */
};

const data = User.parse(input);

console.log(data.name);
```
