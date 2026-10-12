export const chatStyles = [
  { value: 'bubbles', label: 'Bubbles' }, { value: 'soft', label: 'Soft blocks' },
  { value: 'outline', label: 'Outlined' }, { value: 'editorial', label: 'Editorial' },
  { value: 'compact', label: 'Compact' },
]
export const chatMotions = [
  { value: 'instant', label: 'Instant' }, { value: 'fade', label: 'Fade' },
  { value: 'rise', label: 'Rise' }, { value: 'slide', label: 'Slide in' },
  { value: 'pop', label: 'Pop' }, { value: 'unfold', label: 'Unfold' },
]
export const speakerName = kind => kind === 'person' ? 'Avery' : 'Studio assistant'
export const initialMessages = [
  { id: 'welcome', sender: 'bot', name: 'Studio assistant', text: 'What should we explore today?' },
  { id: 'example', sender: 'you', name: 'You', text: 'Let’s make conversations feel a little more alive.' },
  { id: 'suggestion', sender: 'bot', name: 'Studio assistant', text: 'Try a message below. You can change the style and motion while we chat.' },
]
export function replyFor(text, kind, index = 0) {
  const topic = /\b(color|theme|dark|light)\b/i.test(text) ? 'theme' : /\b(motion|animate|animation|move)\b/i.test(text) ? 'motion' : 'general'
  const replies = kind === 'person' ? {
    theme: ['I like that direction. Let’s try it in light and dark mode.', 'The theme makes a big difference. Want to compare another one?'],
    motion: ['That entrance feels good. I’d try a shorter duration next.', 'Let’s compare a subtle fade with something a little more playful.'],
    general: ['I’m with you. What would you like to try next?', 'Good idea. Let’s explore it together.', 'I can picture that. Send me another thought.'],
  } : {
    theme: ['The message colors follow the active A1 theme. Try Light or Dark to compare.', 'You can change the theme without losing this conversation.'],
    motion: ['Try Rise for a gentle entrance, or Pop for a more expressive send.', 'Reduced motion keeps new messages still while replies continue normally.'],
    general: ['Here’s an idea: compare Bubbles with Editorial using the same conversation.', 'Try another message style or switch the reply partner to Avery.', 'This reply is simulated locally. Your messages stay in this page.'],
  }
  const choices = replies[topic]
  return choices[index % choices.length]
}
