# NextStop Database Schema Draft

This is the initial schema direction for the beta.

Supabase/Postgres is the source of truth.

All tables should use UUID primary keys unless there is a strong reason not to.

Most shared tables should include:

- id
- created_at
- updated_at
- deleted_at
- version
- created_by
- updated_by

## Core Tables

### profiles

Stores public user profile info.

Fields:
- id
- user_id
- display_name
- avatar_url
- created_at
- updated_at

Notes:
- user_id references auth.users
- Do not store sensitive auth data here

### trips

Stores trip workspaces.

Fields:
- id
- owner_user_id
- title
- destination
- start_date
- end_date
- description
- timezone
- invite_code
- created_at
- updated_at
- deleted_at
- version

### trip_members

Stores trip membership and roles.

Fields:
- id
- trip_id
- user_id
- role
- status
- joined_at
- created_at
- updated_at

Role values:
- owner
- member

Status values:
- invited
- active
- removed
- left

### itinerary_items

Stores committed itinerary activities.

Fields:
- id
- trip_id
- title
- description
- date
- start_time
- end_time
- location_name
- location_address
- location_url
- status
- booking_status
- cost_type
- estimated_cost
- paid_by_user_id
- created_by_user_id
- updated_by_user_id
- created_at
- updated_at
- deleted_at
- version

Status values:
- draft
- proposed
- needs_review
- finalized
- skipped
- cancelled

Booking status values:
- not_needed
- needed
- booked
- cancelled

Cost type values:
- free
- per_person
- total_split
- paid_by_one_person

### itinerary_item_participants

Stores who is participating in each activity.

Fields:
- id
- itinerary_item_id
- user_id
- status
- created_at
- updated_at

Status values:
- going
- maybe
- not_going

### ideas

Stores uncommitted trip ideas.

Fields:
- id
- trip_id
- created_by_user_id
- title
- description
- link_url
- suggested_date
- suggested_time
- estimated_cost
- promoted_itinerary_item_id
- created_at
- updated_at
- deleted_at
- version

### idea_reactions

Stores reactions to ideas.

Fields:
- id
- idea_id
- user_id
- reaction
- created_at
- updated_at

Reaction values:
- yes
- maybe
- no

Unique constraint:
- idea_id + user_id

### packing_items

Stores trip packing items.

Fields:
- id
- trip_id
- owner_user_id
- assigned_to_user_id
- title
- category
- quantity
- is_packed
- is_public
- is_shared
- notes
- source_template_id
- created_at
- updated_at
- deleted_at
- version

Rules:
- If is_shared is true, is_public must also be true.
- Private item: is_public false, is_shared false.
- Public personal item: is_public true, is_shared false.
- Shared item: is_public true, is_shared true.

### packing_templates

Stores reusable personal packing templates.

Fields:
- id
- owner_user_id
- title
- description
- category
- created_at
- updated_at
- deleted_at
- version

Examples:
- Camping
- Beach trip
- Weekend visit
- Ski trip
- International travel

### packing_template_items

Stores items inside reusable templates.

Fields:
- id
- template_id
- title
- category
- quantity
- default_is_public
- default_is_shared
- notes
- sort_order
- created_at
- updated_at

### cost_items

Stores basic estimated costs.

Fields:
- id
- trip_id
- itinerary_item_id
- title
- cost_type
- estimated_amount
- currency
- paid_by_user_id
- notes
- created_at
- updated_at
- deleted_at
- version

Cost type values:
- free
- per_person
- total_split
- paid_by_one_person

### cost_item_participants

Stores who is included in a cost.

Fields:
- id
- cost_item_id
- user_id
- share_amount
- status
- created_at
- updated_at

Status values:
- included
- excluded
- paid
- unpaid

Payment statuses are informational only in beta.

### attachments

Stores attachment metadata.

Fields:
- id
- trip_id
- itinerary_item_id
- uploaded_by_user_id
- title
- file_path
- file_type
- file_size
- visibility
- offline_recommended
- created_at
- updated_at
- deleted_at
- version

Visibility values:
- private
- trip

Notes:
- Actual files live in Supabase Storage.
- Private attachments should only be visible to uploader.
- Trip attachments are visible to active trip members.

### change_events

Stores important changes for review/update history.

Fields:
- id
- trip_id
- entity_type
- entity_id
- action
- changed_by_user_id
- old_value_json
- new_value_json
- requires_review
- created_at

Entity types:
- trip
- itinerary_item
- idea
- packing_item
- cost_item
- attachment

Actions:
- created
- updated
- deleted
- finalized
- skipped

### approvals

Stores approval/object responses for reviewable changes.

Fields:
- id
- change_event_id
- user_id
- response
- comment
- created_at
- updated_at

Response values:
- approved
- objected
- ignored

Unique constraint:
- change_event_id + user_id

### device_push_tokens

Stores push notification tokens.

Fields:
- id
- user_id
- token
- platform
- device_id
- created_at
- updated_at
- disabled_at

### notifications

Stores notification records.

Fields:
- id
- user_id
- trip_id
- type
- title
- body
- data_json
- read_at
- created_at

## Future Tables

Not needed for beta, but likely later:

### trip_templates

Public or private reusable itinerary templates.

### trip_template_items

Activities inside a template.

### template_reviews

Reviews from users who copied/completed a template.

### trip_recaps

Post-trip summary and completion data.

### activity_feedback

Feedback on individual activities.

### public_profiles

Creator profile info for marketplace.

## Row-Level Security Direction

RLS should enforce:

- Users can read trips where they are active members.
- Users can update trips only if owner or permitted member.
- Users can read itinerary items for trips where they are active members.
- Users can create ideas in trips where they are active members.
- Users can read public packing items for trip members.
- Users can read their own private packing items.
- Users can read trip attachments if visibility is trip.
- Users can read private attachments only if uploaded_by_user_id matches.
- Users can update/delete their own content unless owner permissions override.

## Indexes To Consider

- trips.owner_user_id
- trip_members.trip_id
- trip_members.user_id
- itinerary_items.trip_id
- itinerary_items.date
- ideas.trip_id
- packing_items.trip_id
- packing_items.owner_user_id
- attachments.trip_id
- attachments.itinerary_item_id
- change_events.trip_id
- approvals.change_event_id

## Open Schema Questions

- Should cost_items be separate from itinerary_items in beta, or should activity cost fields be enough at first?
- Should packing templates support sharing later?
- Should invite codes live directly on trips or in a separate trip_invites table?
- Should approvals be per change_event or directly per itinerary_item?
- Should attachments support selected-user visibility in v1 or later?