# A1 Web access control

## Outcome and boundary

A1-405 introduces end-to-end role-based access for a1-web. It
replaces the hosted app's all-or-nothing sign-in gate with four roles, enforces
page and feature policy in one client module, and adds database policies where
the current data model can enforce them safely. The Administration page also
uses a server-only function to list accounts, send invitations, assign roles
and read an append-only access audit trail.

This slice does not add public sign-up, teams, per-user workspaces, account
deactivation or account deletion by administrators. It also does not claim that
a hidden client route is a security boundary. Supabase row-level security and
the authenticated server function remain the authorities for protected
operations.

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
| Administration | Administrator | Account list, invitations, role assignment, access audit and preview entry point |
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

Bootstrap the first administrator through the Supabase dashboard by setting
`auth.users.raw_app_meta_data.role` to `admin`. After that, administrators can
use the Administration page to invite accounts and assign `user`, `editor`, or
`admin`. The page does not allow an administrator to change their own role, so
one account cannot accidentally remove its own access.

## User-administration server boundary

The browser calls `/.netlify/functions/user-admin` with its current Supabase
access token. The Netlify function:

1. validates the token with Supabase;
2. requires trusted `app_metadata.role = "admin"`;
3. uses `SUPABASE_SERVICE_ROLE_KEY` only on the server;
4. returns a limited account projection instead of complete Auth records; and
5. records invitations and role changes in `a1_user_admin_audit`.

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
