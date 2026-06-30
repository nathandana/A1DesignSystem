import { useT } from '../labels/useT'
import { PageTitleArea } from './PageTitleArea.jsx'

export function Projects({ onNavigate }) {
  const t = useT()
  return (
    <PageTitleArea
      headingId="projects-heading"
      breadcrumbItems={[
        { label: t('label.app.page.home', 'Home'), href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
        { label: t('label.app.page.projects', 'Projects') },
      ]}
      title={t('label.app.page.projects', 'Projects')}
      description={t('label.app.projects.comingSoon', 'Coming soon.')}
    />
  )
}
