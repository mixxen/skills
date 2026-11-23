# Controls by language

Common, maintained tools for each kind of control in `SKILL.md`. Prefer what the project already uses. These are starting points, not an exhaustive list.

| Language | Ban an API or import | Enforce a boundary | Write a custom rule |
|---|---|---|---|
| JavaScript / TypeScript | ESLint `no-restricted-imports`, `no-restricted-syntax`, `no-restricted-globals`, scoped with `files` and `ignores` in the config | `eslint-plugin-boundaries`, `dependency-cruiser` | ESLint custom rule with `meta.messages` (and an optional fixer) |
| Python | Ruff `banned-api` (flake8-tidy-imports, rule TID251) | `import-linter` contracts: `forbidden`, `layers`, `independence` | Ruff doesn't load plugins; use Semgrep, or a small AST-based test |
| Go | golangci-lint `forbidigo`, `depguard` | `depguard`; `internal/` packages | `go/analysis` analyzer |
| Rust | Clippy `disallowed_methods`, `disallowed_types` in `clippy.toml` | crate boundaries; `pub(crate)` visibility | Dylint |
| Java / Kotlin | Error Prone (Java), detekt (Kotlin), ArchUnit | ArchUnit layer rules; JPMS module `exports` | Error Prone check, detekt rule or ArchUnit rule |
| C / C++ | clang-tidy checks; `#pragma GCC poison` for banned identifiers | separate libraries and include paths | clang-tidy custom check |
| Any | Semgrep or ast-grep rules | Semgrep or ast-grep rules | Semgrep or ast-grep |

## Making something impossible with types

- **Branded or newtype values:** a `UserId` that only a validated constructor can create, so raw strings can't be passed.
- **Private modules:** export only the safe API; keep the internal one unexported, or in `internal/` (Go) or `pub(crate)` (Rust).
- **Narrow signatures:** remove the option that caused the bug (for example, an `unsafe: boolean` flag) and give the rare legitimate case its own explicitly named function.

## Scoping a rule to product code

Most fenced-API rules need an exemption for the wrapper module that legitimately uses the API. Express the exemption in the tool's configuration (exempt paths or an allow-list), not in inline disable comments. Configuration is reviewed in one place; scattered disable comments look like permission to the next agent.
