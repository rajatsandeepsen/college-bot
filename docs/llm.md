# Simple LLM

```bash
SARVAM_API_KEY="your_api_key"
```

```ts
import { sarvam } from 'sarvam-ai-sdk';
import { generateText } from 'ai';

const { text } = await generateText({
	model: sarvam("sarvam-105b"),
    prompt: "Translate this to malayalam: 'Keep cooking, guys'",
});

console.log(text); // പാചകം തുടരൂ, സുഹൃത്തുക്കളേ
```
