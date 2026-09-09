import { defineAgent } from "eve";
import { sarvam } from "sarvam-ai-sdk";
import { SarvamChatModelInfo } from "sarvam-ai-sdk/info";

export default defineAgent({
	model: sarvam("sarvam-105b", {
		reasoning_effort: "low",
	}),
	modelContextWindowTokens: SarvamChatModelInfo["sarvam-105b"].context_window,
});
