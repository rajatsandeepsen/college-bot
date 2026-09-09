import { defineAgent } from "eve";
import { sarvam } from "sarvam-ai-sdk";

export default defineAgent({
	model: sarvam("sarvam-105b", {
		reasoning_effort: "low",
	}),
	modelContextWindowTokens: 128_000,
});
