# Labs button configurator menu

`/experiments/button-configurator-menu` tests component-owned configuration.
The standard Labs configuration panel chooses the Menu, compact Toolbar,
Extended toolbar, Context menu or Consolidated context menu presentation;
selecting the live A1 Button opens that configurator in an anchored overlay.

The experiment uses the shared Button, Menu, MenuSection, TextField,
SelectField, Switch, Stack, Toolbar and Section components. Local CSS only
positions the component-owned overlays; controls and visual states come from
the design system. State stays in the experiment page, and the shared layout
moves the variant selector into its usual mobile configuration sheet.

The menu controls label, variant, size, icon, icon position, link destination,
full width, loading and disabled. Escape and outside selection close the menu;
the shared Menu owns focus trapping and responsive modal behavior. This is a
Labs design-tool candidate, not a promoted configurator pattern.

The Toolbar presentation puts common preset values and state toggles directly
in A1's overlay Toolbar, positioned beside the Button without a Menu wrapper. A
separate Extended toolbar replaces the Variant menu with five direct icon
choices and replaces the Size menu with Decrease size and Increase size
buttons. Both share Button state with the full Menu presentation so switching
compares control density rather than different output. Both floating toolbars
measure against the viewport instead of the Button width. In the compact
Toolbar, Variant, Size, Icon and Icon position come before state and Label, so
narrow layouts retain useful direct tools and move only trailing controls into
More.

The Menu presentation is offset beside the real Button—right when space allows,
otherwise left—rather than rendering a duplicate preview. The actual configured
component therefore remains visible while values change. Its Variant, Size,
Icon position and State controls reuse the same labelled Toolbar,
ToolbarGroup and ToolbarToggle composition as the main A1 Button configurator.

The Context menu presentation opens at the pointer's right-click coordinates.
Appearance properties carry a trailing chevron and open a second A1 ContextMenu
directly against the triggering row of the first, matching a native cascading
menu. The current value is active in that submenu after a 200 ms hover delay or
immediately on click, while the parent remains open during selection. Full
width, Loading and Disabled are direct primary-menu rows with explicit On/Off
values; they do not use the stronger active-row fill or open a submenu. In the
Context menu presentation the Button renders as an ARIA button rather than a
native disabled control, so right-click configuration remains reachable while
Disabled or Loading is on. Label editing is omitted from the menu and forced
inline on the Button. Shared menus own focus, arrow-key navigation, Escape and
viewport clamping, and suppress the browser context menu when the user
right-clicks anywhere while an A1 context menu is open.

The Consolidated context menu keeps Variant and Icon as cascading menus, but
places Size directly in the primary menu as three icon-only radio controls and
Icon position as two icon-only radio controls. The selected option uses the
shared ToolbarGroup selected treatment. These embedded controls use
ContextMenu's governed custom control-group entry rather than local menu UI.

Label is always unrestricted editable text: TextField in the full Menu, a
compact TextField directly in either overlay Toolbar, and forced double-click
inline editing for both Context menu presentations.

No presentation provides a reset action. The experiment models a persistent
editor: configuration remains until the user changes it or reloads the page.

The side-panel `Edit label inline` option applies to the Menu and both Toolbar
presentations. Both Context menu variants force the option on and disable its switch. The
shared seamless InlineEditable renders inside the Button; double-click enters
editing, Enter or F2 is the keyboard equivalent, and Escape exits.
