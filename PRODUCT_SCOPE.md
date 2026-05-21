# NextStop Product Scope

## Product Thesis

NextStop is a mobile-first trip planning app that helps groups build itineraries, coordinate packing, track basic costs, attach important trip documents, and stay aligned during the trip.

The first version is not a public travel marketplace, booking app, Venmo replacement, AI itinerary generator, or flight/hotel aggregator.

The first goal is to replace the messy combination of spreadsheets, group chats, Notes, screenshots, and memory.

## Primary User

The first user to optimize for is the planner friend.

This person currently:
- Creates the spreadsheet
- Chases people in group chats
- Tracks ideas, costs, reservations, and timing
- Reminds people what is next
- Coordinates who is bringing what

The app must still be useful even if only the planner is highly active and other members are passive.

## Core Jobs To Be Done

NextStop should answer these questions better than a spreadsheet and group chat:

1. What are we doing?
2. What is next?
3. What changed?
4. Who agreed?
5. Who is going?
6. What does it cost?
7. What still needs to be booked?
8. What is everyone bringing?
9. Where are the tickets or important files?

## Beta Scope

The beta should include:

- User accounts
- Create trip
- Join trip through invite code/link
- Trip members
- Day-by-day itinerary
- Activity creation and editing
- Activity participants
- Ideas board
- Idea reactions
- Promote idea to itinerary
- Basic cost estimates
- Packing list
- Private packing items
- Public personal packing items
- Shared/group-responsibility packing items
- Attachments for tickets, screenshots, confirmations, and trip documents
- Today view
- Important notifications
- Offline read access for trip essentials

## Explicitly Out of Scope For Beta

Do not build these in the first beta:

- Public marketplace
- Public itinerary search
- Venmo integration
- Payment processing
- Flight import
- Hotel import
- AI trip generation
- Map routing
- Full chat
- Complex polls
- Native widgets
- Creator profiles
- Paid templates
- Affiliate bookings
- Social feed
- Advanced offline collaboration

## Product Modules

### Trips

A trip is the main workspace.

A trip contains:
- Members
- Itinerary
- Ideas
- Packing
- Costs
- Attachments
- Updates

### Itinerary

The itinerary is the committed plan.

Activities may include:
- Title
- Date
- Start time
- End time
- Location
- Notes
- Participants
- Cost estimate
- Booking status
- Attachments

### Ideas

Ideas are not committed plans.

Ideas may include:
- Text
- Link
- Image or attachment
- Suggested day/time
- Estimated cost
- Reactions

Ideas can be promoted into itinerary activities.

### Packing

Packing supports individual and group coordination.

Packing item types:
- Private item: visible only to the owner
- Public personal item: visible to the group, but owned personally
- Shared item: visible to the group and relied on by the group

If an item is shared, it must be public.

### Costs

Costs are estimates only in beta.

No payment integration.

Cost features:
- Free or paid
- Estimated cost
- Per-person cost
- Total split cost
- Paid by
- Participants included in cost

### Attachments

Attachments are trip documents, not social media uploads.

Examples:
- Tickets
- Reservation screenshots
- Confirmation PDFs
- Parking passes
- Maps
- Receipts
- Important notes

Attachments must support visibility:
- Private
- Shared with trip

### Today View

Today view is the during-trip command center.

It should show:
- Current activity
- Next activity
- Later activities
- Relevant tickets or attachments
- Time-sensitive notes
- Basic reminders

## Product Lifecycle

NextStop should eventually support this lifecycle:

Plan -> Pack -> Coordinate -> Use During Trip -> Recap -> Reuse/Share

Beta focuses on:

Plan -> Pack -> Coordinate -> Use During Trip

## Future Direction

If beta succeeds, future phases may include:

1. Trip recap
2. Duplicate trip as template
3. Private/friend-shared templates
4. Public itinerary templates
5. Marketplace
6. Creator tools
7. Carefully selected integrations

## Product Principles

- Fast messy input first, structure later.
- Do not require perfect participation from every member.
- Avoid notification spam.
- Private data must stay private by default.
- Users should review before anything becomes public.
- Every feature must help coordinate a real trip.
- If a feature does not beat spreadsheets, group chat, or Notes, cut it.