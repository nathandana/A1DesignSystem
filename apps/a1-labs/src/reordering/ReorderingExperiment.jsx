import React, { useState } from 'react'
import { Button, ChoiceGroup, Inset, Paragraph, Section, Slider, Stack } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { ReorderList } from './ReorderList.jsx'
import { MagneticGrid } from './MagneticGrid.jsx'
import { physics, snapRadii } from './magnetic-config.js'
import motion from '../../../../system/tokens/motion.json'
const initialItems = [
  { id: 'discover', label: 'Discover', description: 'Find the problem worth solving' },
  { id: 'sketch', label: 'Sketch', description: 'Make room for possibilities' },
  { id: 'prototype', label: 'Prototype', description: 'Give the idea something to do' },
  { id: 'test', label: 'Test', description: 'Try it with real people' },
  { id: 'ship', label: 'Ship', description: 'Put the learning into practice' },
]
const speeds = ['fast','slow','slower'].map(key=>({key,value:parseFloat(motion.semantic.motion.duration[key].$value)}))
export function ReorderingExperiment({ experiment, onOpenSettings }) {
  const [items,setItems]=useState(initialItems)
  const [history,setHistory]=useState([])
  const [mode,setMode]=useState('list')
  const [radius,setRadius]=useState(snapRadii[1])
  const [stiffness,setStiffness]=useState(physics.stiffnessDefault.$value)
  const [damping,setDamping]=useState(physics.dampingDefault.$value)
  const changeItems = next => { if (next === items) return; setHistory(previous => [...previous.slice(-19), items]); setItems(next) }
  const undo = () => { if (!history.length) return; setItems(history.at(-1)); setHistory(previous => previous.slice(0, -1)) }
  const [placement,setPlacement]=useState('plop')
  const [indicator,setIndicator]=useState('rail')
  const [duration,setDuration]=useState('slow')
  const [session,setSession]=useState(0)
  const configuration=<Inset space={16}><Stack gap={24}>
    <ChoiceGroup label="Reordering style" name="reordering-style" columns={1} size="compact" value={mode} onChange={setMode}
      options={[{ value: 'list', label: 'List' }, { value: 'magnetic', label: 'Magnetic drag and drop' }]} />
    {mode === 'magnetic' ? <>
      <Paragraph size="sm" color="muted">Approach a slot to attract the tile. Neighbors spring into their preview positions; the outlined slot is the landing position.</Paragraph>
      <Slider label="Snap threshold" variant="subtle" value={radius} onChange={setRadius}
        detents={snapRadii.map(value => ({ value, label: `${value} px` }))} formatValue={value => `${value} pixels`} />
      <Slider label="Spring stiffness" variant="subtle" value={stiffness} onChange={setStiffness}
        detents={['Soft','Default','Firm'].map((label, index) => ({ label, value: [physics.stiffnessSoft.$value,physics.stiffnessDefault.$value,physics.stiffnessFirm.$value][index] }))} />
      <Slider label="Spring damping" variant="subtle" value={damping} onChange={setDamping}
        detents={['Bouncy','Balanced','Calm'].map((label, index) => ({ label, value: [physics.dampingLow.$value,physics.dampingDefault.$value,physics.dampingHigh.$value][index] }))} />
    </> : <>
    <ChoiceGroup label="Placement animation" columns={2} size="compact" value={placement} onChange={setPlacement}
      options={[{value:'subtle',label:'Subtle'},{value:'plop',label:'Plop'},{value:'tilt',label:'Tilt and settle'},{value:'spring',label:'Spring'},
        {value:'pop',label:'Pop'},{value:'slide',label:'Slide in'},{value:'fade',label:'Fade in'},{value:'instant',label:'Instant'}]} />
    <ChoiceGroup label="Insertion indicator" columns={2} size="compact" value={indicator} onChange={setIndicator}
      options={[{value:'line',label:'Insertion line'},{value:'outline',label:'Target outline'},{value:'slot',label:'Empty slot'},
        {value:'glow',label:'Glow'},{value:'arrows',label:'Arrows'},{value:'marker',label:'Side marker'},
        {value:'pointer',label:'Pointer'},{value:'rail',label:'Position rail'}]} />
    <Slider label="Placement duration" variant="subtle" value={speeds.find(speed=>speed.key===duration).value}
      detents={speeds.map(speed=>({value:speed.value,label:`${speed.value} ms`}))} formatValue={value=>`${value} milliseconds`}
      onChange={value=>setDuration(speeds.find(speed=>speed.value===value).key)} />
    </>}
    <Button variant="secondary" onClick={()=>{setItems(initialItems);setHistory([]);setSession(value=>value+1)}}>Reset order</Button>
  </Stack></Inset>
  return <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
    <Section padding={{xs:'none',md:'md'}} contentWidth="md"><Stack align="center">
      {mode === 'magnetic' ? <MagneticGrid key={session} items={items} onChange={changeItems} radius={radius} stiffness={stiffness} damping={damping} onUndo={undo} canUndo={history.length > 0} /> :
      <ReorderList key={session} items={items} onChange={changeItems} placement={placement} indicator={indicator} duration={duration} label="Design process" />}
    </Stack></Section>
  </ExperimentLayout>
}
