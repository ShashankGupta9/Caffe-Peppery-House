# ☕ Peppery House

A cozy indie café — dine-in + online ordering + AI recommendations.

## Tech Stack
- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL + Realtime)
- **Auth:** Supabase Phone OTP
- **Payments:** Razorpay + Cash options
- **AI:** Anthropic Claude API

## Brand Colors
| Name     | Hex       |
|----------|-----------|
| Caramel  | `#C87740` |
| Raisin   | `#2E1F26` |
| Cream    | `#F5ECD8` |
| Espresso | `#8B5A3A` |
| Dusk     | `#4A3040` |

## Quick Start

```bash
# 1. Clone & install
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Fill in your Supabase, Razorpay, and Anthropic keys

# 3. Set up database
# Go to Supabase → SQL Editor → paste supabase-schema.sql → Run

# 4. Start dev server
npm run dev
```

## Project Structure
```
app/
├── (public)/        # Guest-accessible pages
│   ├── menu/        # Full menu with cart
│   ├── track/[id]/  # Real-time order tracking
│   └── ai/          # AI features hub
├── (auth)/          # Login / OTP verify
├── (customer)/      # Protected customer pages
├── admin/           # Admin KDS dashboard
└── api/             # API routes
```

## AI Features
| Feature | Endpoint | Description |
|---------|----------|-------------|
| Coffee Mood Finder | `POST /api/ai/mood-finder` | Energy + taste + temp → drink |
| AI Barista | `POST /api/ai/barista` | Context/vibe → coffee + food combo |
| Coffee Pairing Engine | `POST /api/ai/pairing` | Drink → best food pairings |

## Order Flow
Guest/Customer → Add to cart → Checkout (name+phone+address) → Pay (Razorpay/COD) → Admin KDS → Real-time tracking

## Deployment
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy — done!

## Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
ANTHROPIC_API_KEY=
```
