# A1 Icon Usage

This file is the system-level source of truth for which icon to use in common interface situations. It is written for AI agents and humans building A1 interfaces.

Use `system/icons/material-symbols.json` as the definitive list of available icon names. Use this file to choose the right icon for a scenario.

Theme-specific products may override these choices later with a theme-local icon usage file, but the system default below is the baseline. If a theme override exists, keep the same scenario intent and document the replacement icon there.

## Rules

1. Use Material Symbols names in snake_case in web and React code.
2. React Native MaterialIcons may require hyphen-case for the same concept, for example `arrow-forward` instead of `arrow_forward`.
3. Icons are decorative unless the icon-only control has no visible text. Icon-only buttons must have a specific accessible label.
4. Use the clearest action icon for the actual action. Do not use a generic icon when a specific one exists.
5. Add new rows to the usage lookup as icons are introduced in product or documentation work.
6. Do not add icons that are not present in `system/icons/material-symbols.json`.

## Usage Lookup

<!-- icon-usage-table:start -->
| Icon | Scenario |
| --- | --- |
| accessibility_new | Accessibility, inclusive design, accessibility foundation, or accessibility review. |
| account_circle | User account avatar, profile trigger, or account menu trigger. |
| add | Add, create, insert, or start a new item. |
| animation | Motion foundation, easing, animation, or motion settings. |
| arrow_back | Back navigation or return to the previous surface. |
| arrow_forward | Continue, next step, forward navigation, or primary link that moves onward. |
| arrow_right | Inline next indicator or compact forward affordance in lists and prose. |
| auto_awesome | AI, generated assistance, enhancement, or polished system capability. |
| bar_chart | Analytics, metrics, reporting, or charted data. |
| block | Blocked, unavailable, disabled by policy, deprecated, or prohibited. |
| bolt | Speed, power, quick action, high energy, or performance. |
| campaign | Announcement, banner, broadcast, or feedback-message category. |
| cancel | Failed, unavailable, cancelled, or not configured. Prefer `close` for dismissing UI. |
| check | Selected option or checkmark control state. |
| check_circle | Success, completion, passed status, stable status, verified success, completed requirement, or positive validation. |
| chevron_left | Previous page, previous item, or carousel/list movement left. |
| chevron_right | Next item, disclosure affordance, drill-in row, or movement right. |
| close | Close, dismiss, cancel dialog, remove transient surface, or clear a panel. |
| code | Code, React package, implementation, developer surface, source example, or code-assistance tool. |
| content_copy | Copy, duplicate content, copy code, or copy a value to the clipboard. |
| crop_square | Card, rectangular surface, or basic shape item. |
| dark_mode | Dark mode, dark section, or dark theme state. |
| dashboard | Dashboard, overview panel, or dashboard view. |
| delete | Delete, remove permanently, destructive discard, or trash action. |
| description | Document, page, written guide, report, or long-form content. |
| design_services | Design work, design process, or design-service capability. |
| devices | Responsive design, cross-device support, or multi-device surfaces. |
| download | Download, export, or save a file from the system to the user's device. |
| edit | Edit, modify, update, or change an existing item. |
| edit_note | Field labels, editable text notes, or editor-specific content. |
| error | Error, failed status, invalid state, or blocking problem. |
| expand_more | Expand/collapse disclosure or select/menu indicator. |
| favorite | Favorite, liked, loved, or highly positive emotional state. |
| flag | Priority guide principle, goal marker, flag, or notable milestone. |
| folder | Project group, folder, projects area, grouped navigation, or folder empty state. |
| format_quote | Quotation, testimonial, blockquote, or quoted emphasis. |
| forum | Forum, conversation, recommendation, testimonial, or discussion. |
| grid_view | Grid view, collection of tiles, or component grid. |
| home | Home, overview, root route, or landing destination. |
| hub | Connected system, central hub, integration, or token-to-platform relationship. |
| inbox | Empty state, inbox, no items, or blank content area. |
| info | Informational status, general notice, or neutral guidance. |
| inventory_2 | Inventory, package, component inventory, or cataloged system item. |
| keyboard | Keyboard input, shortcut, command palette, or keyboard control. |
| label | Badge, label, tag, or short status marker. |
| layers | Layers, stack, composition, or system strata. |
| light_mode | Light mode, light section, or light theme state. |
| link | Link, inline link component, copy link, or relationship between pages. |
| lock | Locked, restricted, secure, or inaccessible option. |
| logout | Sign out or log out. |
| mail | Email, message, contact, or inbox message. |
| menu | Main menu, navigation drawer, side nav trigger, or menu control. |
| more_horiz | More actions in horizontal layout. |
| more_vert | More options, overflow menu, kebab menu, or row action menu. |
| new_releases | Release notes, changelog release page, newly published version, or product release announcement. |
| notes | Notes, paragraph body text, supporting text, or written notes. |
| notifications | Notification, alert center, feedback category, or notification badge. |
| open_in_new | External link, open in new window, or modal/dialog launch when the destination leaves the current context. |
| palette | Color foundation, theme, visual style, styling, tokens, or color-related design work. |
| people | Team, group, members, or collective users. |
| person | Single user, profile, individual account, or person tab. |
| phone_iphone | Native package, mobile device, phone preview, or iOS/React Native context. |
| precision_manufacturing | Build tools, generation tooling, production workflow, or automated manufacturing-style pipeline. |
| psychology | Cognitive load, thinking, discovery, learning, or research insight. |
| rate_review | Review request, review action, or requested feedback. |
| record_voice_over | Screen reader, spoken announcement, voiceover, or assistive technology review. |
| remove | Remove from a set or decrement. Use `delete` for permanent destructive deletion. |
| rocket_launch | Get started, launch, new initiative, or kickoff. |
| save | Save changes, persist edits, or store current state. |
| search | Search, find, or filter by text query. |
| settings | Settings, preferences, configuration, system preferences surface, or settings page. |
| share | Share item, share link, or send content to another destination. |
| shield | Protection, safety, security, or guarded behavior. |
| smart_button | Button component, action category, or control that triggers an action. |
| science | Beta status, experimental status, proof of concept, or test-stage work. |
| star | Feature, highlighted item, rating, or notable capability. |
| straighten | Size, spacing, measuring, dimensions, or icon sizing tokens. |
| sync | Saving in progress, syncing, refresh of state, or background update. |
| table_chart | Data table, tabular data, spreadsheet-like data, or structured rows and columns. |
| terminal | Technical stack, terminal, command line, or developer tooling. |
| text_fields | Typography, text fields, type scale, or text input category. |
| title | Heading, title, or headline typography. |
| token | Design tokens, token system, or token-first architecture. |
| touch_app | Touch target, action labels, interactive action, or pointer/touch behavior. |
| view_agenda | Section, layout container, agenda-style stacked layout, or layout foundation. |
| view_list | List, text list, grouped rows, list view, minor feature list, examples list, or list-style page view. |
| visibility | View, inspect, visual review, or visibility/accessibility foundation. |
| warning | Warning, caution, pass with warnings, or non-blocking risk. |
| widgets | Components, component library, widgets, or assembled UI pieces. |
| work | Work, case studies, professional project, or portfolio work. |
<!-- icon-usage-table:end -->

## Open Decisions

These were found during the repo scan but are not yet system-standardized.

- `open_in_new` is used for both external links and dialog/modal examples. This is acceptable for now.
