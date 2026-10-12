import React, { useEffect, useRef, useState } from 'react'
import { Button, ChoiceGroup, Inset, Paragraph, Section, Slider, Stack, Switch } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { ChatConversation } from './ChatConversation.jsx'
import { chatStyles, chatMotions, initialMessages, replyFor, speakerName } from './chat-model.js'
import motionTokens from '../../../../system/tokens/motion.json'
import chatTokens from '../../../../system/tokens/component/chat.json'
const durations = ['quick', 'slow', 'slower'].map(key => ({ key, value: parseFloat(motionTokens.semantic.motion.duration[key].$value) }))
const delays = ['replyFast', 'replyDefault', 'replySlow'].map((key, index) => ({ value: parseFloat(chatTokens.component.chat[key].$value), label: ['Quick', 'Natural', 'Unhurried'][index] }))

export function ChatExperiment({ experiment, onOpenSettings }) {
  const [treatment, setTreatment] = useState('bubbles'), [motion, setMotion] = useState('rise'), [duration, setDuration] = useState('slow')
  const [partner, setPartner] = useState('bot'), [automatic, setAutomatic] = useState(true), [delay, setDelay] = useState(delays[1].value)
  const [messages, setMessages] = useState(initialMessages), [pending, setPending] = useState([]), [reset, setReset] = useState(0)
  const sequence = useRef(0), animation = useRef({ motion, duration }); animation.current = { motion, duration }
  const active = pending[0]
  useEffect(() => {
    if (!active) return
    const timer = setTimeout(() => {
      setMessages(previous => [...previous, { id: `reply-${active.id}`, sender: active.partner, name: speakerName(active.partner), text: replyFor(active.text, active.partner, active.index), ...animation.current }])
      setPending(previous => previous.slice(1))
    }, active.delay)
    return () => clearTimeout(timer)
  }, [active])
  const send = text => {
    const id = ++sequence.current
    setMessages(previous => [...previous, { id: `sent-${id}`, sender: 'you', name: 'You', text, motion, duration }])
    if (automatic) setPending(previous => [...previous, { id, text, partner, delay, index: id - 1 }])
  }
  return <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={
    <Inset space={16}><Stack gap={24}>
      <ChoiceGroup label="Message style" columns={1} size="compact" options={chatStyles} value={treatment} onChange={setTreatment} />
      <ChoiceGroup label="Message animation" columns={2} size="compact" options={chatMotions} value={motion} onChange={setMotion} />
      <Slider label="Animation duration (ms)" variant="subtle" value={durations.find(item => item.key === duration).value}
        detents={durations.map(item => ({ value: item.value, label: String(item.value) }))}
        onChange={value => setDuration(durations.find(item => item.value === value).key)} />
      <ChoiceGroup label="Reply as" columns={1} size="compact" value={partner} onChange={setPartner}
        options={[{ value: 'bot', label: 'Studio assistant (bot)' }, { value: 'person', label: 'Avery (person)' }]} />
      <Switch label="Automatic replies" checked={automatic} onChange={value => { setAutomatic(value); if (!value) setPending([]) }} />
      <Slider label="Reply pace" variant="subtle" value={delay} detents={delays} onChange={setDelay} formatValue={value => `${value / 1000} seconds`} />
      <Button variant="secondary" onClick={() => { setPending([]); setMessages(initialMessages); setReset(value => value + 1) }}>Reset conversation</Button>
      <Paragraph size="sm" color="muted">Replies are simulated locally. No messages are sent or saved. Partner and pace changes apply to your next message.</Paragraph>
    </Stack></Inset>
  }>
    <Section padding={{ xs: 'none', md: 'md' }} contentWidth="sm"><Stack gap={16}>
      <ChatConversation messages={messages} onSend={send} treatment={treatment} typing={active ? speakerName(active.partner) : ''} resetKey={reset} />
    </Stack></Section>
  </ExperimentLayout>
}
