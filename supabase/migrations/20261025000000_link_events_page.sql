-- Issue #62: a 'page' event is another page of shogo.build opened after /links in the same tab.
-- Its path goes in `target` (already capped at 64 characters). Existing rows are untouched.

alter table public.link_events drop constraint if exists link_events_kind_check;
alter table public.link_events
  add constraint link_events_kind_check check (kind in ('view', 'click', 'mode', 'page'));
