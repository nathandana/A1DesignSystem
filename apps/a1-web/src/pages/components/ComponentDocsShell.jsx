export function ComponentDocsShell({ children, fill = false }) {
  return (
    <div className={`a1-web-components-shell${fill ? ' a1-web-components-shell--fill' : ''}`}>
        {children}
    </div>
  )
}
