import { getLang } from './lang.svelte'

const de: Record<string, string> = {
  'My events': 'Meine Veranstaltungen',
  'Sign in': 'Anmelden',
  'Sign out': 'Abmelden',

  'Upcoming': 'Bevorstehend',
  'Past': 'Vergangen',
  'No events yet.': 'Noch keine Veranstaltungen.',

  "You haven't created any events yet.": 'Du hast noch keine Veranstaltungen erstellt.',
  '+ Create event': '+ Veranstaltung erstellen',
  'Edit': 'Bearbeiten',
  'Delete': 'Löschen',
  'Confirm delete': 'Löschen bestätigen',
  'Cancel': 'Abbrechen',

  '← Back': '← Zurück',

  'Create event': 'Veranstaltung erstellen',
  'Edit event': 'Veranstaltung bearbeiten',
  'Name': 'Name',
  'Event name': 'Name der Veranstaltung',
  'Description': 'Beschreibung',
  "What's this event about?": 'Worum geht es bei dieser Veranstaltung?',
  'Starts at': 'Beginn',
  'Ends at': 'Ende',
  'Location': 'Ort',
  'Search for a place…': 'Ort suchen…',
  'Mode': 'Modus',
  'Status': 'Status',
  'Creating…': 'Wird erstellt…',
  'Saving…': 'Wird gespeichert…',
  'Save changes': 'Änderungen speichern',

  'In person': 'Vor Ort',
  'Virtual': 'Online',
  'Hybrid': 'Hybrid',

  'Scheduled': 'Geplant',
  'Planned': 'In Planung',
  'Cancelled': 'Abgesagt',
  'Postponed': 'Verschoben',
  'Rescheduled': 'Neu terminiert',
}

export function t(english: string): string {
  return getLang() === 'de' ? (de[english] ?? english) : english
}
