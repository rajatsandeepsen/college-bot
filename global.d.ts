declare global {
	namespace NodeJS {
		interface ProcessEnv {
			EVE_SERVER_URL: string;
			SARVAM_API_KEY: string;
			EXA_API_KEY: string;
			TELEGRAM_BOT_TOKEN: string;
			TELEGRAM_WEBHOOK_SECRET_TOKEN: string;
			DATABASE_URL: string;
			DATABASE_URL_DIRECT: string;
			TELEGRAM_ADMIN_ID: string;
		}
	}
}

declare global {
	interface ObjectConstructor {
		// keys<T>(obj: T): [keyof T];
		keys<R, T extends object>(
			obj: T,
		): R extends true ? [keyof T] : Array<keyof T>;
		values<T>(obj: T): Array<T[keyof T]>;
		entries<T>(obj: T): Array<[keyof T, T[keyof T]]>;
	}
}

export {};
