let _lang = $state<'en' | 'de'>('en')

export function getLang(): 'en' | 'de' {
  return _lang
}

export function setLang(l: 'en' | 'de') {
  _lang = l
}
