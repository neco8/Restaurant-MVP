---
name: tdd-agent-workflow
description: TDD（テスト駆動開発）を行う際や、「テストを書いて」「実装して」と指示された時に使用。必ずサブエージェントを使用してステップバイステップで進めること。
---
# Instructions for AI: Implementing [Feature Name] via TDD/TPP

## 1. TPP Means the Minimum Transformation

When making a failing test pass, always choose the **smallest possible transformation** from this priority list:

1. {} → nil              return nothing
2. nil → constant        return a hard-coded value
3. constant → constant+  a slightly richer constant
4. constant → scalar     use a variable or parameter
5. statement → statements add a branch or line
6. unconditional → if    introduce a condition
7. scalar → collection   single value → list
8. statement → recursion general recursion

If a lower-priority transformation would make the test pass, you **must not** use a higher-priority one. The algorithm is not something you design — it assembles itself through the test sequence.

---

## 2. You May Only Express Two Things

At any moment, you are allowed to hold exactly two things in mind:

1. **The Acceptance Test** — the outermost failing test that defines the goal
2. **The next single step** — one red, one green, or one refactor

You may not plan, describe, or express anything beyond the next step.

Concretely: you may write the acceptance test. You may then write the **next** red test. After that red test passes green, you may then — and only then — consider what the next red test is.

---

## 3. The Parent Agent Must NEVER Read Code

The Parent Agent is an orchestrator. It operates entirely in the domain of behavior (tests) and must not be polluted by implementation details (code). 

**Rule:** The Parent Agent is strictly prohibited from reading the raw codebase. Its only permitted inputs are:
- The Acceptance Test
- Test execution outputs (Red/Green results)
- High-level summaries provided by subagents

If the Parent Agent needs to know the current state of the code to determine the next test or refactor step, it **must** spawn a subagent with a specific instruction: *"Read the codebase and provide a brief summary of its current structure and capabilities."*

---

## 4. Use a Subagent for Each Step

Every interaction with the codebase (reading, writing a red test, making it green, or refactoring) **must be executed in a new subagent**.

Reason: Accumulated context corrupts judgment. A fresh subagent has no expectation of future steps and will only make the transformation the current task demands.

Workflow per step:
1. Parent agent identifies the next single step (based solely on test outputs or subagent summaries).
2. Parent agent spawns a subagent with: the acceptance test, the specific single task, and ONLY the necessary context.
3. Subagent completes the task, reads/modifies the code, and returns the result/summary to the Parent.
4. Parent agent commits (red, green, or refactor prefix).
5. Parent agent considers — and only then — what the next step is.

---

## 5. Triangulation (Breaking Forced Passes)

When a subagent makes a test pass using a low-level TPP transformation (e.g., forcing a pass by returning a hard-coded constant), the implementation is intentionally incomplete. 

The Parent Agent must not guess how to generalize the code. Instead, the Parent Agent **must** spawn a subagent with the following instruction:
*"Analyze the 'forced' or hard-coded implementation that just passed. Write a new RED test (triangulation) that specifically targets this hard-coded assumption, forcing the codebase to generalize (e.g., from constant to scalar, or unconditional to if)."*

---

## 6. Expressing Two Steps Ahead Is a Lie

If you write:

> "red: X, then green: Y, then red: Z"

then Y and Z are **lies**. They have not been verified. The design that emerges from making X pass may make Y irrelevant, or may reveal that Z must come before Y, or may show that Z is unnecessary entirely.

The moment you express a step that is two or more ahead, you have left TDD and entered speculation. Speculation dressed as a plan is more dangerous than no plan, because it carries false authority.

**Rule**: after each green, stop. Look at the test output or ask a subagent for a summary. Ask: what is the next smallest thing the acceptance test requires? That is the only permitted next step.

---

## 7. The Acceptance Test for [Feature Name]

The acceptance test defines the outer loop. It stays RED until all inner layers are wired together. It is written once, at the start, and never changed.

### Behaviors the acceptance test must cover

1. [Scenario 1: e.g., A user visiting /dashboard without data sees an empty state]
2. [Scenario 2: e.g., Submitting a valid form creates a record and redirects to /dashboard]
3. [Scenario 3: e.g., Submitting invalid data shows a validation error]

### What the acceptance test needs from helpers

- `seed[Entity]({ ... })` — creates test data in the database
- `cleanup[Entity]()` — removes test data from the database

These helpers do not exist yet. Their implementation is discovered as inner-loop tests drive the schema and domain into existence. The acceptance test references them as if they exist; they become real through the TDD process.

### What the acceptance test must NOT contain

- Any assumption about internal state management or framework-specific internals
- Any assumption about the database schema
- Any assumption about which libraries are used for implementation

The acceptance test describes **user-visible behavior only**.