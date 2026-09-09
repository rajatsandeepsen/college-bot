declare global {
	namespace NodeJS {
		interface ProcessEnv {
			EVE_SERVER_URL: string;
			SARVAM_API_KEY: string;
			EXA_API_KEY: string;
			TELEGRAM_BOT_TOKEN: string;
			TELEGRAM_WEBHOOK_SECRET_TOKEN: string;
		}
	}
}

export {};
