// Split Button shares Button's controls and the editor's Button + split JSON contract.
import * as button from './button.jsx'

export const jsonType = button.jsonType

export function getDefaultConfig() {
  return { ...button.getDefaultConfig(), split: true }
}

export function Preview(props) {
  return <button.Preview {...props} viewAs="react" config={{ ...props.config, split: true }} />
}

export function Controls(props) {
  return <button.Controls {...props} viewAs="react" splitOnly config={{ ...props.config, split: true }} />
}

export function Snippet(props) {
  return <button.Snippet {...props} viewAs="react" config={{ ...props.config, split: true }} />
}

export function toJson(config) {
  return button.toJson({ ...config, split: true })
}

export function fromJson(node) {
  return button.fromJson({ ...node, props: { ...node.props, split: true } })
}
