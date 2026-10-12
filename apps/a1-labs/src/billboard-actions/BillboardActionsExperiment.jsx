import React, { useState } from 'react'
import { ChoiceGroup, Inset, Stack, Switch, TextField, TextareaField, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { ResponsivePreviewFrame, VIEWPORT_PRESETS, viewportSize } from '../../../a1-web/src/pages/components/detail/ResponsivePreviewFrame.jsx'
import { ActionBillboard } from './ActionBillboard.jsx'

const devices = {xs:'Phone',sm:'Landscape phone',md:'Tablet',lg:'Laptop',xl:'Desktop'}
const actions = [
  {id:'explore',icon:'science',title:'Find your next experiment',description:'Explore ideas in motion, interaction and interface design.',href:'/',target:'_top'},
  {id:'system',icon:'widgets',title:'Build with A1',description:'Explore the components and foundations. Opens a new tab.',href:'https://a1design.app',target:'_blank'},
  {id:'notes',icon:'history',title:'See what’s new',description:'Follow recent experiments and release notes.',href:'/about#release-notes',target:'_top'},
]
const features=[
  {id:'tokens',icon:'palette',label:'Built with A1 tokens'},
  {id:'input',icon:'keyboard',label:'Keyboard and touch'},
  {id:'mode',icon:'contrast',label:'Light and dark'},
]
export function BillboardActionsExperiment({experiment,onOpenSettings}) {
  const [viewport,setViewport]=useState('lg')
  const [title,setTitle]=useState('Small ideas. Big possibilities.')
  const [description,setDescription]=useState('Try a fresh direction. Explore a growing collection of interface experiments, adjust the details and discover what your next idea could become.')
  const [panelTitle,setPanelTitle]=useState('Your next move')
  const [tone,setTone]=useState('accent')
  const [actionStyle,setActionStyle]=useState('cards')
  const [showDetails,setShowDetails]=useState(true)
  const [stacked,setStacked]=useState(false)
  const configuration=<Inset space={16}><Stack gap={24}>
    <Toolbar label="Viewport"><ToolbarGroup aria-label="Viewport" value={viewport} onChange={setViewport}
      options={VIEWPORT_PRESETS.filter(preset=>devices[preset.value]).map(preset=>({value:preset.value,label:devices[preset.value],icon:preset.icon}))} /></Toolbar>
    <TextField label="Headline" value={title} maxLength={100} onChange={event=>setTitle(event.target.value)} />
    <TextareaField label="Introduction" value={description} rows={4} maxLength={400} onChange={event=>setDescription(event.target.value)} />
    <TextField label="Action panel heading" value={panelTitle} maxLength={80} onChange={event=>setPanelTitle(event.target.value)} />
    <ChoiceGroup label="Surface" value={tone} onChange={setTone} columns={2} size="compact" options={[{value:'accent',label:'Accent'},{value:'neutral',label:'Neutral'}]} />
    <ChoiceGroup label="Actions" value={actionStyle} onChange={setActionStyle} columns={2} size="compact" options={[{value:'cards',label:'Cards'},{value:'tiles',label:'Action tiles'}]} />
    <Switch label="Show action descriptions" checked={showDetails} onChange={setShowDetails} />
    <Switch label="Stack columns" checked={stacked} onChange={setStacked} />
  </Stack></Inset>
  return <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
    <ResponsivePreviewFrame {...viewportSize(viewport)}>
      <main aria-label="Billboard preview">
        <ActionBillboard eyebrow="A1 Labs · An open playground" title={title.trim() || 'Small ideas. Big possibilities.'} description={description}
          callout={{icon:'auto_awesome',label:'Make something worth trying.'}} features={features}
          panelTitle={panelTitle.trim() || 'Your next move'} panelDescription="Choose a path. Bring your curiosity."
          actions={actions} tone={tone} actionStyle={actionStyle} showDetails={showDetails} stacked={stacked} />
      </main>
    </ResponsivePreviewFrame>
  </ExperimentLayout>
}
