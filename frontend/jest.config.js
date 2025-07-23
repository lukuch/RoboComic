export default {
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^.+\\.(css|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": [
      "babel-jest",
      { configFile: "./jest.babel.config.js" },
    ],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(isows|@supabase|@supabase/realtime-js|@supabase/supabase-js)/)",
  ],
};
