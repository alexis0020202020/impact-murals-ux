# Start here

> Document historique. Pour les corrections et le branchement actuels, lire LIRE-MOI-CORRECTIONS-SEO.md et docs/SEO-ACTIVATION.md. Les anciennes consignes de confirmation, de pause et de configuration ne font plus référence.

## 1. Copy the pack
Copy the contents of this folder into the root of the Impact Murals repository.

## 2. Start with the identity spine
Open Claude Code from that repository and confirm the official frontend-design skill is active.

Paste:
`prompts/01-IDENTITY-SPINE.md`

This builds only the decisive part first:
- navigation;
- logo motion;
- hero;
- hero-to-work transition;
- first project surface;
- intentional mobile treatment.

Review that preview before expanding the full landing.

## 3. Continue after approval
When the identity spine is strong, paste:
`prompts/02-FULL-LANDING.md`

## 4. Save Git checkpoints
After identity-spine approval:

```bash
git add .
git commit -m "feat: establish Impact Murals identity spine"
```

After complete V1:

```bash
git add .
git commit -m "feat: build Impact Murals landing v1"
```

## Important
- Do not begin with mass SEO pages.
- Do not add a CMS during this pass.
- The V1 form is a visual interface until a real delivery method is configured.
- Replace placeholders with real project assets after the structural and visual system is approved.
