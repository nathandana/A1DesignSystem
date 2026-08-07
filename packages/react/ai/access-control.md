# A1 Web access control

## Outcome and boundary

A1-405 introduces end-to-end role-based access for a1-web. It
replaces the hosted app's all-or-nothing sign-in gate with four roles, enforces
page and feature policy in one client module, and adds database policies where
the current data model can enforce them safely. The Administration page also
uses a server-only function to list accounts, show detailed profiles, send
invitations, assign roles, delete accounts and read append-only account and
login audit trails. The separate Visit analytics page lists first-party site
visits recorded through a public write-only server endpoint and provides
administrator-only session details.

This slice does not add public sign-up, teams, per-user workspaces, account
deactivation or invitation resend. It also does not claim that a hidden client
route is a security boundary. Supabase row-level security and the authenticated
server function remain the authorities for protected operations.

## Roles

| Role | Source | Intended outcome |
|---|---|---|
| Guest | No hosted session | Read public system guidance, use public experiments, and try the page builder with browser-local storage |
| User | Signed-in account; default when no explicit role is assigned | Use cloud workspace tools and detailed release notes |
| Editor | `app_metadata.role = "editor"` | Manage governance content and the Backlog |
| Administrator | `app_metadata.role = "admin"` | Open administrative and high-impact preview tools |

The client and Supabase policies read only trusted `app_metadata`. They do not
authorize from `user_metadata`, which account holders can edit themselves.
Role order is cumulative: administrators inherit editor and user access, and
editors inherit user access.

When Supabase is not configured, a1-web uses local administrator access. This
preserves offline development, route baselines and local-only data workflows.
Hosted builds with Supabase configured treat signed-out visitors as guests.

## Feature and page recommendations

These recommendations are the policy implemented in
`apps/a1-web/src/access/accessPolicy.js`.

| Area | Minimum role | Notes |
|---|---|---|
| Home, Features, Get started, Presentation, Blog, About | Guest | Public product and system information |
| Labs | Guest | Public experiments; experiment status remains separate from access role |
| Foundations and Components | Guest | Public documentation and configurators |
| JSON playground | Guest | Public local experiment |
| Projects and page editor | Guest | Guest work remains in browser-local storage; signing in enables the shared cloud workspace |
| Published and standalone previews | Guest | Public prototype viewing |
| Help and Accessibility | Guest | Public guidance and reports |
| Releases — simplified | Guest | Only sources with an authored simplified changelog are available |
| Account | Guest | Sign-in and account recovery entry point |
| Kitchen sink | Guest | Public theme and component smoke surface |
| Patterns | User | Shared reusable authoring content |
| Image library and custom icons | User | Shared project assets |
| Data sources | User | Shared project datasets |
| Releases — detailed | User | Implementation and package maintenance context |
| System dashboard | Editor | Includes Backlog and governance data |
| Backlog and ticket pages | Editor | UI, global search, shortcuts and Supabase rows are restricted |
| Rule editor | Editor | Governance authoring |
| Label editor | Editor | Workspace label writes are restricted by Supabase policy |
| Priority Guide editor | Editor | Shared content-planning authoring |
| Theme editor | Administrator | High-impact preview that changes shared visual foundations |
| Administration | Administrator | Account list, detailed profiles, invitations, role assignment, deletion, lifecycle and login history, and preview entry point |
| Visit analytics | Administrator | First-party metrics, charts, visitor map, visit list, device/request context, full session timeline and on-demand approximate IP location and network details |
| Virtual team | Administrator | Development-only administrative automation |

Navigation visibility is convenience, not authorization. Direct URLs render an
accessible access-required page, and restricted feature providers avoid loading
or seeding their data for unauthorized roles.

## Supabase setup

Apply these migrations to an existing workspace:

- `apps/a1-web/supabase/migrations/20260729_a1_405_user_access.sql` adds
  `a1_current_role()` and `a1_has_min_role()` helpers, limits Backlog tables to
  editors and administrators, and limits workspace-label writes to those roles.
- `apps/a1-web/supabase/migrations/20260729_a1_405_user_management.sql` adds the
  server-only `a1_user_admin_audit` table. Authenticated and anonymous browser
  roles receive no privileges or row-level policies for this table.
- `apps/a1-web/supabase/migrations/20260729_a1_405_user_profile_management.sql`
  adds account-deletion audit support and the browser-inaccessible
  `a1_user_login_audit` table. It also adds the authenticated
  `a1_record_login()` recorder used after successful A1 password sign-in.
- `apps/a1-web/supabase/migrations/20260731_a1_site_visit_analytics.sql` adds
  the browser-inaccessible `a1_site_visit_audit` table and the service-only
  recorder used by the visit-analytics Netlify function.
- `apps/a1-web/supabase/migrations/20260801_a1_site_visit_context.sql` adds the
  whitelisted Netlify geolocation/request and browser-reported device context
  used by charts, the visitor map and session details.

Bootstrap the first administrator through the Supabase dashboard by setting
`auth.users.raw_app_meta_data.role` to `admin`. After that, administrators can
use the Administration page to invite accounts and assign `user`, `editor`, or
`admin`. The page does not allow an administrator to change their own role, so
one account cannot accidentally remove its own access. It also prevents the
signed-in administrator from deleting their own account. Deleting another
account requires the administrator to type its email address, or its user ID
when no email exists, exactly.

## User-administration server boundary

The browser calls `/.netlify/functions/user-admin` with its current Supabase
access token. The Netlify function:

1. validates the token with Supabase;
2. requires trusted `app_metadata.role = "admin"`;
3. uses `SUPABASE_SERVICE_ROLE_KEY` only on the server;
4. returns a limited account projection instead of complete Auth records;
5. reads complete per-account lifecycle and login history;
6. blocks role changes and deletion for the acting administrator; and
7. records invitations, role changes and deletions in
   `a1_user_admin_audit`.

Configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` through Netlify's
environment-variable UI. A `VITE_SUPABASE_URL` value declared only in
`netlify.toml` is a build variable and is not available to a Function at
runtime. Scope the service key to Functions when the Netlify plan supports
scoped variables. Never prefix that key with `VITE_`, commit it, log it or
return it from the function. Use Netlify Dev for local end-to-end testing
because the Vite-only server does not host Netlify functions.

A changed account must refresh its session, usually by signing out and back in,
before the new role reaches its JSON Web Token. The actor cannot change their
own role from the page.

After a successful password sign-in, the browser calls the security-definer
`a1_record_login()` function. Supabase supplies the authenticated user ID and
email from the session; the database supplies the timestamp. Browser clients
cannot select, insert, update or delete rows in `a1_user_login_audit`, while the
administrator-authenticated Netlify function can read the complete list. A
30-second duplicate guard prevents repeated submissions for the same sign-in.
The history begins when the profile-management migration and recorder are
deployed; Supabase does not provide a retroactive list of earlier sign-ins.
Session refreshes and already-active sessions are not recorded as new logins.

## Site-visit analytics boundary

The browser calls `/.netlify/functions/visit-analytics` for the initial route,
SPA route changes, a 30-second heartbeat and a best-effort page-exit event. The
endpoint accepts anonymous requests so public visits are included, but it takes
the IP address only from Netlify's trusted function context. A valid Supabase
session adds the account ID and email; it is never accepted from request JSON.

A visit is one browser-tab session with a 30-minute inactivity boundary. The
database stores every IP observed during that session, ordered route paths,
page-view timestamps, the visit start, last heartbeat and best-effort end time.
Visit length is therefore approximate. It also stores a whitelisted context
object: Netlify geolocation, request ID, execution region, deploy/site metadata
and the trusted `Netlify-Agent-Category` header; plus raw User-Agent,
Accept-Language and available User-Agent Client Hints from the request. The
device type, browser and platform are inferred from those headers. Browser
headers are optional client claims, not verified identity, and can be missing
or spoofed. The recorder truncates string fields and does not store cookies,
authorization headers, Netlify account metadata, skew-protection tokens,
referrers, query strings, fragments, page content or fingerprints.

Browser roles cannot read or write the table directly; the public endpoint can
only call the service-role recorder, and the administrator-authenticated
`user-admin` function performs reads for `/admin/analytics`. The page summarizes
the selected live or sample dataset with metrics, daily/page/device charts and
a map of sessions that have Netlify coordinates. Sample mode is deterministic,
uses reserved documentation IP ranges and never writes to Supabase.

Opening a session-details dialog sends each stored IP address from the Netlify
function to ipapi.co and returns a limited projection of approximate location,
time-zone and network-ownership fields. This lookup is on demand, is not stored
in Supabase and can fail independently without hiding the recorded session.
The dialog identifies the external provider and describes the data as
approximate.

IP addresses are personal data in many jurisdictions. Before production use,
publish the appropriate privacy notice and define a retention/deletion policy;
this implementation does not automatically expire records.

## Remaining slices

Sequence follow-up tickets in this order. Ticket references should be added when
they are filed; none are invented here.

1. **Split the shared workspace envelope by protected resource.** Dependency:
   agree whether Projects, Patterns, themes and Priority Guides are shared,
   per-user or team-scoped. Acceptance: Supabase can reject unauthorized writes
   independently for each resource, including Theme and Priority Guide changes.
2. **Add workspace membership and ownership.** Dependency: product decision on
   personal versus team workspaces. Acceptance: data policies scope reads and
   writes to an explicit workspace membership instead of one global row.
3. **Add feature-flag lifecycle controls.** Dependency: define owners and exit
   criteria for experimental, preview and stable features. Acceptance: admins
   can enable a preview for selected roles or workspaces, and the server enforces
   protected preview data where applicable.
4. **Expand access regression coverage.** Dependency: seeded Supabase test users
   for all roles. Acceptance: route, navigation, API and role-change tests run
   for guest, user, editor and administrator sessions in CI.

## Known limitation in this slice

Projects, Patterns, themes and Priority Guides still share one
`shared_state.data` envelope. Supabase cannot distinguish a theme edit from a
project edit inside that blob. Theme Editor and Priority Guide access are
therefore enforced in the client in this slice; the data split above is required
before those writes can receive independent row-level policies.
