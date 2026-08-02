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
