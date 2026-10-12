export const METHODS = [
  { value: 'pages', label: 'Paginated', subtext: 'Move through the form a page at a time.', icon: 'auto_stories' },
  { value: 'sidenav', label: 'Side navigation', subtext: 'Jump directly to any of the 20 sections.', icon: 'view_sidebar' },
  { value: 'visual', label: 'Visual grouping', subtext: 'One continuous form, divided into clear sections.', icon: 'view_agenda' },
]
export const CHAPTERS = ['The essentials', 'People and access', 'The experience', 'Operations', 'Ready to launch']
// Fictional event-planning content belongs to the demo, not the reusable form.
const content = [
  ['Event overview', 'Give your gathering a name and a purpose.', ['Event name', 'Fieldnote community day'], ['What is the purpose?', 'Bring local makers together to share practical skills.'], ['Who is the audience?', 'Neighbors, makers and curious beginners']],
  ['Your organization', 'Identify the team behind the event.', ['Organization name', 'Fieldnote Collective'], ['Lead organizer', 'Alex Morgan'], ['Team responsibilities', 'Programming, welcome desk and volunteer coordination']],
  ['Date and schedule', 'Set the day and the hours guests should expect.', ['Event date', 'June 12, 2027'], ['Doors open', '9 a.m.'], ['Event ends', '5 p.m.']],
  ['Venue', 'Describe where the event will take place.', ['Venue name', 'Riverside community hall'], ['Venue address', '24 Garden Lane, Example City'], ['Room or entrance', 'Main hall, garden entrance']],
  ['Attendance', 'Plan the size and format of the gathering.', ['Expected guests', '120'], ['Maximum capacity', '150'], ['Attendance format', 'In person, with a streamed closing talk']],
  ['Registration', 'Explain how people reserve their place.', ['Registration method', 'Online registration with a walk-in allocation'], ['Registration deadline', 'June 5, 2027'], ['Waitlist plan', 'Release unclaimed places 24 hours before the event']],
  ['Accessibility', 'Plan access before guests arrive.', ['Step-free access', 'Level garden entrance with automatic doors'], ['Communication support', 'Live captions and a hearing loop'], ['Accommodation requests', 'Contact the welcome team before June 1']],
  ['Travel', 'Help guests find their way.', ['Public transport', 'River Street bus stop, 5 minutes from the hall'], ['Parking and drop-off', 'Accessible drop-off at the garden gate'], ['Directions for guests', 'Follow the blue signs from River Street']],
  ['Program', 'Describe the structure of the day.', ['Opening activity', 'Welcome and a short tour of the stations'], ['Main activities', 'Printmaking, repair demonstrations and short talks'], ['Closing activity', 'Community showcase and feedback circle']],
  ['Speakers', 'Plan the people leading the sessions.', ['Speaker coordinator', 'Jamie Chen'], ['Speaker lineup', 'Local artists, repair volunteers and community organizers'], ['Speaker briefing', '20-minute sessions with time for audience questions']],
  ['Workshops', 'Describe the hands-on sessions.', ['Workshop topics', 'Bookbinding, simple repairs and nature journaling'], ['Places per workshop', '15'], ['Materials provided', 'Tools, paper and reusable aprons']],
  ['Food and drink', 'Make a plan for refreshments.', ['Catering provider', 'Garden Kitchen cooperative'], ['Dietary options', 'Vegetarian, vegan and clearly labeled allergen information'], ['Water stations', 'Refill stations at both hall entrances']],
  ['Equipment', 'List the tools needed to run the day.', ['Audio and display', '2 microphones, projector and portable hearing loop'], ['Furniture', '12 workshop tables and 150 chairs'], ['Connectivity', 'Guest Wi-Fi plus a wired connection for the stream']],
  ['Staffing', 'Give the delivery team clear responsibilities.', ['Staffing lead', 'Sam Rivera'], ['Volunteer roles', 'Welcome, room guides, workshop support and cleanup'], ['Shift arrangements', '2 shifts with a 30-minute handover']],
  ['Safety', 'Prepare for incidents and support needs.', ['Safety lead', 'Jordan Lee'], ['First aid location', 'Quiet room beside the welcome desk'], ['Emergency procedure', 'Follow venue evacuation routes to the garden assembly point']],
  ['Budget', 'Set out the expected costs.', ['Total budget', '6,000 demo credits'], ['Main expenses', 'Venue, accessibility support, materials and catering'], ['Contingency', '600 demo credits reserved for unexpected costs']],
  ['Communications', 'Plan what guests hear before the day.', ['Communications lead', 'Taylor Green'], ['Promotion channels', 'Community newsletter, library posters and local groups'], ['Reminder schedule', '1 week before and the day before the event']],
  ['Sustainability', 'Plan how to reduce waste.', ['Reusable materials', 'Borrowed tools, washable cups and reusable signs'], ['Waste collection', 'Labeled recycling, compost and general waste stations'], ['Leftover supplies', 'Donate unused materials to the community workshop']],
  ['Feedback', 'Decide what to learn from the event.', ['Feedback method', 'Short accessible survey and a paper feedback station'], ['Success measures', 'Attendance, workshop participation and guest feedback'], ['Review meeting', 'The organizing team meets 1 week after the event']],
  ['Final handover', 'Make sure everyone knows what happens next.', ['Final approver', 'Alex Morgan'], ['Handover recipient', 'Venue and volunteer leads'], ['Final briefing', 'Share the schedule, contact sheet and access arrangements']],
]
export const SECTIONS = content.map(([title, description, ...questions], index) => ({
  id: `section-${index + 1}`, title, description, chapter: Math.floor(index / 4),
  fields: questions.map(([label, example], question) => ({ id: `s${index + 1}-q${question + 1}`, label, example })),
}))
export function exampleAnswers(sections = SECTIONS, count = sections.length) {
  return Object.fromEntries(sections.flatMap((section, index) => section.fields.map(field => [field.id, index < count ? field.example : ''])))
}
export function formProgress(sections, values) {
  const counts = sections.map(section => section.fields.filter(field => String(values[field.id] ?? '').trim()).length)
  return { counts, answered: counts.reduce((sum, count) => sum + count, 0), total: sections.reduce((sum, section) => sum + section.fields.length, 0), complete: counts.filter((count, index) => count === sections[index].fields.length).length }
}
export function visibleSections(method, current, length, pageSize = 4) {
  if (method === 'visual') return Array.from({ length }, (_, index) => index)
  if (method === 'pages') {
    const start = Math.floor(current / pageSize) * pageSize
    return Array.from({ length: Math.min(pageSize, length - start) }, (_, index) => start + index)
  }
  return [current]
}
export function missingAnswers(sections, values) {
  return sections.flatMap((section, index) => section.fields.filter(field => !String(values[field.id] ?? '').trim()).map(field => ({ ...field, section: index })))
}
