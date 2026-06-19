import { getLang } from './lang.svelte'

const de: Record<string, string> = {
  'My events': 'Meine Veranstaltungen',
  'Sign in': 'Anmelden',
  'Sign out': 'Abmelden',

  'Upcoming': 'Bald',
  'Past': 'Schon vorbei',
  'No events yet.': 'Noch keine Veranstaltungen.',

  "You haven't created any events yet.": 'Du hast noch keine Veranstaltungen erstellt.',
  '+ Create event': '+ Veranstaltung erstellen',
  'Edit': 'Bearbeiten',
  'Delete': 'Löschen',
  'Confirm delete': 'Löschen bestätigen',
  'Cancel': 'Abbrechen',

  'About us': 'Über uns',
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

  'Meet real people. Build community. Without Big Tech.':
    'Echte Menschen treffen. Community aufbauen. Ohne Big Tech.',

  'Sign in with your Atmosphere account. You can get one at {eurosky} or {bluesky}.':
    'Melde dich mit deinem Atmosphere-Konto an. Du kannst dir eines bei {eurosky} oder {bluesky} erstellen.',

  "This is supposed to be about us, but for now it mainly an experiment by me, {hilke}. It is a website that I built to help my musical peers escape big tech social media but stil stay connected.":
    "Hier steht mit Absicht 'Über uns', aber im Moment ist es vor allem ein Experiment von mir, {hilke}. Es ist eine Website, die ich gebaut habe, damit meine musikalischen 'peers' von den großen Tech-Konzernen wegkommen, aber trotzdem in Verbindung bleiben können.",

  "It is a curated list of events for our music community, but the data is not locked into a database of this website. It is built on an open and interoperable system, called the Atmosphere.":
    "Es ist eine kuratierte Liste von Veranstaltungen für unsere Musik-Community, aber die Daten sind nicht in einer Datenbank dieser Website gespeichert. Sie basiert auf einem offenen und interoperablen System, der sogenannten Atmosphere.",

  "You can create your own events if you log in with what we call an {atmoaccount}. It is one account for an ecosystem of many apps, and you can get one at {eurosky} or {bluesky}, for instance. The events will also show up on other event apps of the Atmosphere, like {atmo} and {smokesignal}.":
    "Du kannst eigene Veranstaltungen erstellen, wenn du dich mit einem sogenannten {atmoaccount} anmeldest. Es ist ein Konto für ein Ökosystem vieler Apps, und du kannst eines bei {eurosky} oder {bluesky} erstellen. Die Veranstaltungen erscheinen auch in anderen Event-Apps der Atmosphere, wie {atmo} und {smokesignal}.",

  "Right now the events on the homepage are curated to a selection of accounts, but please reach out to byebye@broligar.ch if you think your events should be included.":
    "Die Veranstaltungen auf der Startseite sind derzeit auf eine Auswahl von Accounts beschränkt. Melde dich gerne unter byebye@broligar.ch, wenn du denkst, dass deine Veranstaltungen aufgenommen werden sollten.",

  "I want this website to be shaped by our community. And if you stop liking what I do, I don't own your event data. You keep them and you can build something different with it on your own.":
    "Ich möchte, dass diese Website von unserer Community mitgestaltet wird. Und falls dir nicht mehr gefällt, was ich mache: Deine Veranstaltungsdaten gehören dir. Du behältst sie und kannst damit eigenständig etwas anderes aufbauen.",

  'Admin': 'Admin',
  'Curated accounts': 'Kuratierte Accounts',
  'Events from these accounts appear on the home page.': 'Veranstaltungen dieser Accounts erscheinen auf der Startseite.',
  'Add account': 'Account hinzufügen',
  'Add': 'Hinzufügen',
  'No accounts yet.': 'Noch keine Accounts.',
  'Accounts': 'Accounts',
  'Remove': 'Entfernen',

  'Share your events with others': 'Teile deine Veranstaltungen mit anderen',
  'Copy link': 'Link kopieren',
  'Copied!': 'Kopiert!',

  'In person': 'Vor Ort',
  'Virtual': 'Online',
  'Hybrid': 'Hybrid',

  'Scheduled': 'Geplant',
  'Planned': 'In Planung',
  'Cancelled': 'Abgesagt',
  'Postponed': 'Verschoben',
  'Rescheduled': 'Neu terminiert',
}

export function t(english: string, replacements?: Record<string, string>): string {
  const translated = getLang() === 'de' ? (de[english] ?? english) : english
  if (!replacements) return translated
  return translated.replace(/\{(\w+)\}/g, (_, key) => replacements[key] ?? `{${key}}`)
}
