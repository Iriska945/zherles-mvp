# Original User Request

## 2026-08-01T15:09:43Z

Redesign the main page to include a clear product explanation, a live count of collaborating businesses, and a real interactive map (using an API like Google Maps, Yandex, or Mapbox) where clicking a pin opens the business passport. Implement a B2C personal cabinet backed by a real database and authentication system (e.g., phone number login) to track discounts, bonuses, and levels. Provide a distinct B2B entry point leading to the business dashboard. Integrate a WhatsApp bot experience to deliver promotions and information directly via chat. Wrap the entire experience in a clean, lightweight design with Kazakh aesthetic touches, optimized using social engineering and marketing psychology (inspired by community-driven brands like Zebra Coffee) to maximize user engagement.

Working directory: /Users/ramil/teamwork_projects/zherles_mvp
Integrity mode: development

## Requirements

### R1. Interactive Homepage & Map
Implement a lightweight, intuitive homepage. It must feature a clear explanation of the product, display the number of cooperating businesses, and integrate a real mapping service (e.g., Google Maps/Yandex/Mapbox) to show establishment locations. Clicking an establishment's pin must open its business passport.

### R2. B2C Personal Cabinet with Real Database & Auth
Implement a B2C Personal Cabinet that uses a real database and authentication system (e.g., Firebase Auth or Supabase with phone/email login). The cabinet must accurately display the authenticated user's current level, accumulated bonuses, and active discounts.

### R3. WhatsApp Bot Integration
Implement the WhatsApp bot integration to provide users with necessary information and promotions directly via chat. The exact technical scope (e.g., full Green API webhooks vs. frontend simulation) is left to the agent team's discretion, provided it fulfills the user experience goal.

### R4. Aesthetic & Psychological Optimization
Design the interface to be practical, light, and easy to understand. Incorporate subtle Kazakh aesthetics. Apply marketing psychology and social engineering principles (e.g., cues for community belonging and quick service, akin to Zebra Coffee) to encourage users to actively engage with the system.

## Acceptance Criteria

### Homepage & Map
- [ ] The homepage loads without errors and displays the product explanation and business count.
- [ ] A real map component renders successfully on the page.
- [ ] Clicking a map marker successfully opens the corresponding business passport (via navigation or modal).

### Database & Authentication
- [ ] A user can successfully register and log in using the implemented authentication system.
- [ ] The user's personal cabinet successfully reads and writes their level, bonuses, and discounts to the real database.

### WhatsApp Integration
- [ ] The WhatsApp bot integration is demonstrable (either via verified backend webhooks or a functional frontend simulation) and clearly shows the flow of information retrieval.

### Design & Marketing
- [ ] The UI visually reflects a lighter, less cluttered design compared to the previous iteration.
- [ ] Kazakh aesthetic elements (e.g., patterns, color palettes, or typography) are visibly integrated.
- [ ] At least one specific psychological lever (e.g., social proof, community belonging) is demonstrably applied in the UI/UX.

## Follow-up — 2026-08-02T09:28:16Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Execute the teamwork_preview subagent

A cross-marketing web platform (Zherles MVP) featuring a landing page with a 2GIS business map, a B2C client dashboard, a B2B business dashboard, and a Green API WhatsApp bot. The design will be practical, light, and incorporate Kazakh aesthetics, applying social engineering principles (e.g., Zebra coffee strategies) to drive user retention.

Working directory: /Users/ramil/teamwork_projects/zherles_mvp
Integrity mode: demo

## Requirements

### R1. Landing Page & 2GIS Map Integration
Create a main landing page with a basic product explanation, a real-time counter of collaborating businesses, and an interactive 2GIS map showing participating establishments. Clicking an establishment on the map should open its "passport" view.

### R2. B2C Personal Account (Client Module)
Develop a user dashboard displaying the user's current discounts, bonuses, and loyalty level.

### R3. B2B Business Dashboard
Provide a clear button/entry point for businesses leading to their management dashboard (`/b2b/dashboard`) and settings (`/b2b/settings`).

### R4. UI/UX & Marketing Design
Implement a clean, practical design with Kazakh aesthetics. Apply marketing and social engineering principles (inspired by Zebra coffee) to influence user behavior and encourage system adoption.

### R5. WhatsApp Bot Integration (Green API)
Implement a WhatsApp webhook/bot service that notifies users about bonus operations (earning/spending) and can respond to basic user commands (e.g., checking balance or level).

## Acceptance Criteria

### Verification Method: Agent-as-Judge
An independent AI agent will evaluate the final implementation based on the following criteria:

- [ ] The landing page successfully renders an interactive 2GIS map showing at least one dummy business location.
- [ ] Clicking a location on the map correctly routes the user to the business's passport view.
- [ ] The B2C client dashboard correctly displays mock or real state data for user discounts, bonuses, and loyalty level.
- [ ] The UI incorporates distinct visual elements consistent with Kazakh aesthetics (e.g., color palette, typography, or subtle patterns) and is free of excessive clutter.
- [ ] A dedicated API route or service file exists for handling WhatsApp webhooks via Green API, containing logic for both sending notifications and processing incoming commands.

