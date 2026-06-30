export function getFoundationBreadcrumbItems(title, onNavigate) {
  return [
    { href: '/', label: 'Home', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
    { href: '/foundations', label: 'Foundations', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('foundations') } },
    { label: title },
  ]
}
