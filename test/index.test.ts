import { strict } from "node:assert";
import test from "node:test";

test("expected equal", () => {
	strict.equal("Hello", "Hello");
	strict.equal("Hi", "Hi");
});
