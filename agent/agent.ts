import { simulateStreamingMiddleware, wrapLanguageModel } from "ai";
import { defineAgent } from "eve";
import { sarvam } from "sarvam-ai-sdk";
import { SarvamChatModelInfo } from "sarvam-ai-sdk/info";

const model = wrapLanguageModel({
	model: sarvam("sarvam-105b-conversations", {
		reasoning_effort: "low",
	}),
	middleware: simulateStreamingMiddleware(),
});

export default defineAgent({
	model,
	modelContextWindowTokens:
		SarvamChatModelInfo["sarvam-105b-conversations"].context_window,
	defaultTools: false,
});
