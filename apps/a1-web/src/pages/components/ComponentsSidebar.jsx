import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { componentCategories } from './data.js'
import { getComponentPath, navigateCard } from './utils.js'

function ComponentTree({ activePage, onNavigate, search }) {
  const query = search.trim().toLowerCase()
  const visibleCategories = componentCategories
    .map((category) => ({
      ...category,
      components: category.components.filter((component) =>
        !query ||
        component.title.toLowerCase().includes(query) ||
        component.body.toLowerCase().includes(query) ||
        category.title.toLowerCase().includes(query)
      ),
    }))
    .filter((category) => !query || category.components.length > 0)

  return (
    <SideNav className="a1-web-components-tree" header="Component tree" defaultCollapsed={false}>
      <SideNavItem
        as="a"
        href={getComponentPath('components')}
        icon="widgets"
        label="Overview"
        active={activePage === 'components'}
        onClick={(event) => navigateCard(event, onNavigate, 'components')}
      />
      {visibleCategories.map((category) => (
        <SideNavGroup
          key={category.id}
          icon={category.icon}
          label={category.title}
          defaultOpen={!query || activePage === `components-${category.id}` || category.components.some((component) => activePage === `component-${component.id}`)}
        >
          <SideNavItem
            as="a"
            href={getComponentPath(`components-${category.id}`)}
            label="Category overview"
            active={activePage === `components-${category.id}`}
            onClick={(event) => navigateCard(event, onNavigate, `components-${category.id}`)}
          />
          {category.components.map((component) => (
            <SideNavItem
              key={component.id}
              as="a"
              href={getComponentPath(`component-${component.id}`)}
              label={component.title}
              active={activePage === `component-${component.id}`}
              onClick={(event) => navigateCard(event, onNavigate, `component-${component.id}`)}
            />
          ))}
        </SideNavGroup>
      ))}
    </SideNav>
  )
}

export function ComponentsSidebar({ activePage, onNavigate, search, setSearch }) {
  return (
    <SideNav>
      <TextField
        label="Search components"
        size="compact"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <ComponentTree activePage={activePage} onNavigate={onNavigate} search={search} />
    </SideNav>
  )
}
