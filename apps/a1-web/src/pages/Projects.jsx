import { PageTitle } from '@gtivr4/a1-design-system-react'
import { useT } from '../labels/useT'

export function Projects({ onNavigate }) {
  const t = useT()
  return (
    <PageTitle
      titleId="projects-heading"
      breadcrumb={[
        { label: t('label.app.page.home', 'Home'), href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
        { label: t('label.app.page.projects', 'Projects') },
      ]}
      title={t('label.app.page.projects', 'Projects')}
      description={t('label.app.projects.comingSoon', 'Coming soon.')}
    />
  )
}
