# Tool Calling

```ts
import { z } from "zod";
import { generateText, tool } from "ai";
import { sarvam } from "sarvam-ai-sdk";

const result = await generateText({
	model: sarvam("sarvam-105b"),
	tools: {
		weather: tool({
			description: "Get the weather in a location",
			inputSchema: z.object({
		location: z.string(),
			}),
			execute: async ({ location }) => ({
				location,
				temperature: 72 + Math.floor(Math.random() * 21) - 10,
			}),
		}),
	},
	system: "Your are a helpful AI",
	prompt: "കൊച്ചിയിലെ കാലാവസ്ഥ എന്താണ്?",
});

console.log(result.toolResults);
```
