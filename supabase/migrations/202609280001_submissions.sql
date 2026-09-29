-- Run once in Supabase SQL Editor or with the Supabase migration CLI.
begin;

create table public.antique_submissions (
  id uuid primary key,
  created_at timestamptz not null default now(),
  status text not null default 'uploading' check (status in ('uploading','received','reviewing','closed')),
  name text not null, email text not null, phone text,
  category text, description text not null, approximate_age text,
  asking_price_cents integer check (asking_price_cents >= 0),
  additional_details text, preferred_contact text not null check (preferred_contact in ('email','call','text')),
  photo_paths text[] not null default '{}',
  notification_status text not null default 'pending' check (notification_status in ('pending','sending','sent','failed')),
  notification_attempts integer not null default 0,
  notification_next_attempt timestamptz not null default now(),
  notification_lease uuid,
  notification_sent_at timestamptz,
  constraint max_photos check (cardinality(photo_paths) <= 5)
);
create index antique_submissions_queue on public.antique_submissions(notification_next_attempt) where notification_status in ('pending','sending');
alter table public.antique_submissions enable row level security;
revoke all on public.antique_submissions from anon, authenticated;
grant all on public.antique_submissions to service_role;

create table public.form_rate_limits (
  key text primary key, count integer not null, expires_at timestamptz not null
);
alter table public.form_rate_limits enable row level security;
revoke all on public.form_rate_limits from anon, authenticated;
grant all on public.form_rate_limits to service_role;

create function public.consume_form_rate_limit(p_keys text[], p_limits integer[], p_windows integer[])
returns boolean language plpgsql security definer set search_path = '' as $$
declare i integer; hits integer; allowed boolean := true;
begin
  if cardinality(p_keys) <> 2 or cardinality(p_limits) <> 2 or cardinality(p_windows) <> 2 then raise exception 'Invalid rate limit arguments'; end if;
  for i in 1..2 loop
    insert into public.form_rate_limits as limits (key, count, expires_at)
    values (p_keys[i], 1, now() + make_interval(secs => p_windows[i]))
    on conflict (key) do update set
      count = case when limits.expires_at <= now() then 1 else limits.count + 1 end,
      expires_at = case when limits.expires_at <= now() then excluded.expires_at else limits.expires_at end
    returning count into hits;
    if hits > p_limits[i] then allowed := false; end if;
  end loop;
  return allowed;
end;
$$;

create function public.claim_submission_notifications(p_id uuid default null)
returns setof public.antique_submissions language sql security definer set search_path = '' as $$
  update public.antique_submissions set
    notification_status = 'sending', notification_attempts = notification_attempts + 1,
    notification_next_attempt = now() + interval '5 minutes', notification_lease = gen_random_uuid()
  where id in (
    select id from public.antique_submissions
    where status <> 'uploading' and notification_status in ('pending','sending')
      and notification_attempts < 8 and notification_next_attempt <= now()
      and (p_id is null or id = p_id)
    order by created_at for update skip locked limit 1
  ) returning *;
$$;

revoke all on function public.consume_form_rate_limit(text[], integer[], integer[]) from public, anon, authenticated;
revoke all on function public.claim_submission_notifications(uuid) from public, anon, authenticated;
grant execute on function public.consume_form_rate_limit(text[], integer[], integer[]) to service_role;
grant execute on function public.claim_submission_notifications(uuid) to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('antique-submissions', 'antique-submissions', false, 3145728, array['image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
-- Deliberately no anon/authenticated storage or table policies. Only the server's service role can access submissions.
commit;
