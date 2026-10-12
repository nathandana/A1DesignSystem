import tokens from '../../../../system/tokens/component/magnetic-reordering.json'
import spacing from '../../../../system/tokens/spacing.json'

export const physics = tokens.component.magneticReordering
export const snapRadii = ['radiusNear', 'radiusDefault', 'radiusWide'].map(key => {
  const reference = physics[key].$value.slice(1, -1).split('.')
  return parseFloat(reference.reduce((value, part) => value[part], spacing).$value)
})
