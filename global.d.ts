declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TELEGRAM_BOT_TOKEN: string;
			EVE_SERVER_URL: string;
			TELEGRAM_WEBHOOK_SECRET_TOKEN: string;
		}
	}
}

export {};
