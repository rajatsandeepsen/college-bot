# Generating Structured Outputs

```ts
import { z } from "zod";
import { sarvam } from "sarvam-ai-sdk";
import { generateText, Output } from "ai";

const { output } = await generateText({
	model: sarvam("sarvam-105b"),
	output: Output.object({
		name: "Recipe",
		description: "A recipe with a name, ingredients and steps",
		schema: z.object({
			recipe: z.object({
				name: z.string(),
				ingredients: z.array(z.string()),
				steps: z.array(z.string()),
			}),
		}),
	}),
	prompt: "Generate a South Indian recipe, in Malayalam",
});

console.log(output);
```
