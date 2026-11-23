import tseslint from "typescript-eslint";

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-globals": ["error", {
        name: "setTimeout",
        message: "Don't use setTimeout in feature code. Use scheduleAfterRender from src/framework/scheduler, or fix the ordering problem the timer is hiding.",
      }],
    },
  },
);
