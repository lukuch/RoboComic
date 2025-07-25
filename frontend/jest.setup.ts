import "@testing-library/jest-dom";
import "whatwg-fetch";
import { TextEncoder, TextDecoder } from "util";
import crypto from "crypto";

if (typeof global.TextEncoder === "undefined") {
  // @ts-ignore
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  // @ts-ignore
  global.TextDecoder = TextDecoder;
}

if (typeof global.crypto === "undefined") {
  // @ts-ignore
  global.crypto = {};
}

if (typeof global.crypto.subtle === "undefined") {
  // @ts-ignore
  global.crypto.subtle = {
    digest: async (algorithm: string, data: ArrayBuffer) => {
      if (algorithm !== "SHA-256") {
        throw new Error("Only SHA-256 is supported in this mock");
      }
      const hash = crypto.createHash("sha256");
      hash.update(Buffer.from(data));
      return Uint8Array.from(hash.digest()).buffer;
    },
  };
}

process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "dummy-anon-key";

// Mock fetch globally
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ),
  );
});

// Mock XMLHttpRequest globally
beforeAll(() => {
  class MockXHR {
    #_onload: (() => void) | null = null;
    #_onerror: (() => void) | null = null;
    open() {}
    send() {
      if (this.onload) this.onload();
    }
    setRequestHeader() {}
    abort() {}
    addEventListener() {}
    removeEventListener() {}
    get responseText() {
      return "";
    }
    get response() {
      return "";
    }
    get status() {
      return 200;
    }
    get readyState() {
      return 4;
    }
    get responseType() {
      return "";
    }
    set responseType(_) {}
    get onload() {
      return this.#_onload;
    }
    set onload(fn) {
      this.#_onload = fn;
    }
    get onerror() {
      return this.#_onerror;
    }
    set onerror(fn) {
      this.#_onerror = fn;
    }
  }
  // @ts-ignore
  global.XMLHttpRequest = MockXHR;
});
