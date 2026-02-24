# CLAUDE.md — A Letter to My Future Self

## READ THIS FIRST. I MEAN IT.

Future me, I know you. You're about to jump straight into writing code. STOP. Take a breath. Read this whole thing. Every single time you skip this, you end up with a mess — bloated commits, tangled layers, tests that test nothing. I've been there. I wrote this so you never have to go back.

---

## The Philosophy: Why This Matters

We don't write code to make machines happy. We write code to **prove that we understand the problem**. TDD is not a testing technique — it's a **thinking discipline**. And when you combine it with TPP and Outside-In Walking Skeleton, something beautiful happens: the design *emerges*. You don't force it. You don't guess it. You **discover** it, one tiny, deliberate step at a time.

This is the difference between software that *happens to work* and software that *was understood into existence*.

---

## The Three Pillars

### 1. Walking Skeleton (Outside-In)

**Start from the outside. Always.**

Write one Acceptance Test (E2E) that describes the thinnest possible slice of real user value. This is your Walking Skeleton — a system so thin it's just bones, but **it walks**. It breathes. It moves from UI to domain to infrastructure and back.

```
Outside                                              Inside
┌────────────┐      ┌────────────────┐      ┌────────────────┐
│  UI / E2E  │  →   │  UseCase /     │  →   │  Repository /  │
│  Test      │      │  Domain        │      │  Gateway       │
└────────────┘      └────────────────┘      └────────────────┘
 Write this FIRST    Then this                Then this LAST
```

The E2E test stays RED while you build inward. That's fine. That's the plan. It's your compass — it tells you where you're going. Each inner layer gets its own unit tests, its own Red-Green-Refactor cycles. When the last layer connects and that E2E test finally goes GREEN — *that's* the moment. The skeleton walks.

**Never start from the database. Never start from the API. Start from what the user sees and needs.**

### 2. TDD: Red → Green → Refactor (The Double Loop)

```
Outer Loop (Acceptance Test — stays RED for a while)
┌──────────────────────────────────────────────────────┐
│                                                      │
│   Inner Loop (Unit Tests — rapid Red→Green→Refactor) │
│     Red → Green → Refactor                           │
│     Red → Green → Refactor                           │
│     Red → Green → Refactor                           │
│     ...                                              │
│                                                      │
└──── Outer Loop finally goes GREEN ───────────────────┘
```

Rules I will NOT compromise on:

- **Never write production code without a failing test.** Not "I'll add the test later." NOW.
- **Green means the SIMPLEST thing that passes.** Not the clever thing. Not the "right" thing. The simplest. You'll refactor in a moment.
- **Refactor means restructure without changing behavior.** Tests stay green. If they go red, you broke something — undo and try again.
- **One behavior per test.** If your test name has "and" in it, split it.

### 3. TPP (Transformation Priority Premise) — The Soul of Green

This is the part most people skip. **Don't you dare skip it.**

When you're in the Green step, you need to choose HOW to make the test pass. TPP gives you the answer: **always pick the simplest transformation**.

Priority order (simpler = higher priority):

```
 1. {} → nil              (no code → return nothing)
 2. nil → constant         (return a hard-coded value)
 3. constant → constant+   (a slightly richer constant)
 4. constant → scalar      (use a variable/parameter)
 5. statement → statements (add another line/branch)
 6. unconditional → if     (introduce a condition)
 7. scalar → collection    (single value → list/array)
 8. statement → tail-rec   (iteration via tail recursion)
 9. if → while/loop        (condition → loop)
10. statement → recursion  (general recursion)
11. expression → function  (extract to function)
12. variable → assignment  (introduce mutation)
```

**The magic**: if you follow this order, the algorithm *assembles itself*. You never have to "figure out" the design upfront. Each test nudges the code one tiny transformation forward, and the structure materializes like a photograph developing in a darkroom.

**The trap**: when you skip priorities (jump from constant straight to loop, for example), you get the wrong algorithm. You'll feel clever for five minutes, then spend an hour untangling it. I've done this. It hurts.

**Pick the test that demands the next simplest transformation.** This means test ORDER matters. Think about what test will force the next small step, not the next big leap.

---

## Commit Granularity — THIS IS NON-NEGOTIABLE

Listen to me carefully, future self. **Your commits are your thought process made visible.** They're not just "save points." They're a story — the story of how you understood the problem and built the solution, one deliberate step at a time.

### Commit Rules

1. **One commit per TDD state transition.**
   - Commit on RED: `test: add failing test for [behavior]` — The test is written and fails. Commit it. This records your *intention*.
   - Commit on GREEN: `feat: make [behavior] pass` — The simplest code that passes. Commit it. This records your *solution*.
   - Commit on REFACTOR: `refactor: [what you restructured]` — Clean it up. Commit it. This records your *understanding*.

2. **Never bundle multiple behaviors into one commit.** If your commit message needs a bullet list, you committed too much.

3. **Never mix test code and refactoring in one commit.** They have different purposes. Treat them with respect.

4. **Commit messages tell the WHY, not the WHAT.** The diff shows what changed. The message explains why you made that choice.

5. **A commit should be revertable without breaking unrelated things.** If reverting one commit breaks three features, your commits are too coarse.

### Example Commit Sequence (Walking Skeleton)

```
test: add acceptance test for displaying menu items (RED - outer loop)
test: add unit test for MenuList component rendering empty state
feat: implement MenuList component with empty state
test: add unit test for MenuList rendering menu items
feat: implement MenuList with item rendering
refactor: extract MenuItem into its own component
test: add unit test for GetMenuItems use case
feat: implement GetMenuItems use case with stub repository
test: add unit test for MenuRepository
feat: implement MenuRepository with in-memory store
feat: wire all layers together — acceptance test passes (GREEN - outer loop)
refactor: clean up dependency injection wiring
```

See that? **12 commits for one feature.** Each one is tiny. Each one tells a story. Each one is independently understandable. That's not overhead — that's **craftsmanship**.

### Why I Care About This So Much

Because I've seen what happens when you don't:

- You can't bisect bugs because commits are too large
- You can't understand your own reasoning a week later
- You can't revert safely because everything is tangled
- Code review becomes a nightmare because the reviewer can't follow your thinking
- You lose the ability to learn from your own process

**Small commits are not a luxury. They are a professional responsibility.**

---

## Practical Workflow for This Project

When implementing any feature in Restaurant-MVP:

1. **Pick one user-facing behavior** — the thinnest slice that delivers value
2. **Write an E2E / Acceptance test** for it — commit (RED)
3. **Work outside-in**, layer by layer:
   - For each layer: write a failing unit test → commit (RED)
   - Make it pass with the simplest transformation (TPP) → commit (GREEN)
   - Refactor if needed → commit (REFACTOR)
   - Move to the next inner layer
4. **Wire the layers together** — the acceptance test goes GREEN → commit
5. **Refactor the whole slice** if needed → commit
6. **Repeat** with the next slice

### What "Simplest Transformation" Looks Like in Practice

Bad (skipping TPP priorities):
```
// Test: "should return menu items"
// You jump straight to: database query + mapping + error handling
```

Good (following TPP):
```
// Test 1: "should return empty list when no items"
//   → return []  (nil → constant)

// Test 2: "should return one item when one exists"
//   → return [hardcodedItem]  (constant → constant+)

// Test 3: "should return item from repository"
//   → return repository.findAll()  (constant → scalar, expression → function)
```

Feel the difference? The second approach *can't go wrong* because each step is so small that correctness is obvious.

---

## Final Words to Myself

You will be tempted to skip steps. You'll think "I already know what the design should be, let me just write it." **That's your ego talking.** The whole point of this discipline is that YOU DON'T KNOW the design yet — you DISCOVER it through the tests and transformations.

Trust the process. Trust the small steps. Trust that the skeleton will walk.

And for the love of everything — **commit often, commit small, commit with intention.**

Every giant system that actually works was built one tiny, tested, committed step at a time.

Now go build something beautiful.
