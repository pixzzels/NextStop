# NextStop Architecture

## Recommended Stack

- Mobile app: React Native + Expo
- Language: TypeScript
- Routing: Expo Router
- Backend: Supabase
- Database: Postgres
- Auth: Supabase Auth
- Storage: Supabase Storage
- Realtime: Supabase Realtime
- Edge/server logic: Supabase Edge Functions
- Local offline cache: Expo SQLite
- Data fetching/cache: TanStack Query
- Local UI state: Zustand
- Validation: Zod
- Styling: NativeWind
- Notifications: Expo Notifications
- Error tracking: Sentry
- Analytics: PostHog later

## Source of Truth

Supabase/Postgres is the source of truth.

TanStack Query owns server state in the UI.

SQLite stores offline snapshots and pending mutations.

Zustand owns local UI-only state.

Do not put server-derived state in Zustand.

## State Ownership Rules

### Supabase/Postgres

Owns:
- Trips
- Members
- Itinerary items
- Ideas
- Reactions
- Packing items
- Costs
- Attachments metadata
- Change events
- Approvals
- Notification records

### TanStack Query

Owns:
- Fetching server data
- Caching server data
- Refetching
- Optimistic updates where safe
- Invalidating stale data

### SQLite

Owns:
- Cached trip snapshots
- Cached itinerary
- Cached packing list
- Cached attachment metadata
- Local file index
- Offline mutation queue

SQLite is not a competing source of truth.

### Zustand

Owns:
- Modal open/closed state
- Current local filters
- Selected tab
- Draft form state
- Temporary UI preferences

## Offline Strategy

Offline v1 prioritizes read access.

Offline v1 should support:
- View today's itinerary
- View full trip itinerary
- View packing list
- View saved attachments
- Check/uncheck packing items offline
- Create safe local drafts

Offline v1 should not support:
- Complex itinerary reordering
- Deleting shared items
- Approving major changes
- Editing costs with multiple participants
- Changing trip dates
- Managing members/permissions
- Publishing templates

## Sync Model

When online:
1. UI reads server state through TanStack Query.
2. Supabase updates data.
3. Realtime events invalidate or patch TanStack Query.
4. SQLite snapshots are refreshed in the background.

When offline:
1. UI can load cached snapshots from SQLite.
2. Safe actions can be queued.
3. Unsafe actions should be blocked or saved as drafts.
4. On reconnect, queued mutations are synced.

## Conflict Resolution

Important rows should include:

- id
- created_at
- updated_at
- deleted_at
- version
- updated_by

For risky updates, the client sends the expected version.

If server version matches expected version:
- Apply update
- Increment version

If server version does not match:
- Reject update
- Mark conflict
- Ask user to review

Do not silently overwrite important shared data.

## Last-Write-Wins Allowed

Last-write-wins is acceptable for low-risk fields such as:
- Local drafts
- UI preferences
- Notification preferences
- Maybe packing item check status

## Version Checks Required

Version checks are required for:
- Itinerary time changes
- Activity deletion
- Cost changes
- Participant changes
- Booking status changes
- Attachment visibility changes
- Approvals
- Membership and role changes

## Offline Mutation Queue

SQLite should eventually include an offline mutation queue with:

- id
- entity_type
- entity_id
- operation
- payload_json
- base_version
- status
- created_at
- error_message

Statuses:
- pending
- syncing
- failed
- conflict

## Realtime Strategy

Supabase Realtime should not independently own UI state.

Realtime event flow:

Realtime event -> update/invalidate TanStack Query -> UI updates -> SQLite snapshot refreshes

## Attachment Strategy

Attachment metadata lives in Postgres.

Attachment files live in Supabase Storage.

Offline attachment files live on device using Expo FileSystem.

Each attachment should have:
- trip_id
- optional itinerary_item_id
- uploaded_by_user_id
- title
- file_path
- file_type
- visibility
- offline_recommended
- created_at

Local files should be indexed by:
- attachment_id
- local_uri
- downloaded_at
- file_size
- checksum if available

## Privacy Rules

Private trip data must not be public by default.

Never publish without explicit review.

Sensitive data includes:
- Member names
- Comments
- Payment statuses
- Flight details
- Exact lodging address
- Personal notes
- Ticket barcodes
- Reservation numbers
- Contact info

## Navigation Structure

Recommended route structure:

app/
  (auth)/
    sign-in.tsx
    sign-up.tsx

  (main)/
    _layout.tsx
    trips.tsx
    packing.tsx
    profile.tsx

  trip/
    [tripId]/
      _layout.tsx
      today.tsx
      itinerary.tsx
      ideas.tsx
      packing.tsx
      more.tsx
      activity/
        [activityId].tsx

## Trip-Level Navigation

Primary trip tabs:
- Today
- Itinerary
- Ideas
- Packing
- More

More includes:
- Costs
- Attachments
- Members
- Updates
- Settings

## Engineering Principles

- Build vertical slices.
- Keep beta scope narrow.
- Prefer boring, stable tools.
- Avoid premature marketplace architecture.
- Avoid complex offline editing until the core product works.
- Validate data at boundaries with Zod.
- Keep server state out of Zustand.
- Keep private and public/template-safe data separate.