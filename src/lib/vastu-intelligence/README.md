# AstroLife Vastu Intelligence Engine

This patch creates a source-tagged Vastu Intelligence Engine for AstroLife.

## What is included

- Classical Vastu physical room-direction scoring
- Modern practical axis rules
- MahaVastu-style remedy layer policy
- Lal Kitab Makan Vastu as a separate kundli-gated module
- Kundli-safe symbolic remedy logic
- SE bedroom contradiction handling
- Makan Aukat calculator
- Construction-stage Vastu rules
- API route: `/api/vastu/analyze`
- Dashboard page: `/dashboard/vastu`

## Important policy

Do not mix Lal Kitab Makan Vastu with Classical Vastu.

Classical Vastu can run without kundli.
Lal Kitab symbolic remedies require kundli validation.
MahaVastu product remedies are modern/secondary and should not be treated as classical authority.

## Test

```bash
npm run lint
npm run build
```

Then open:

```txt
/dashboard/vastu
```

or POST to:

```txt
/api/vastu/analyze
```
