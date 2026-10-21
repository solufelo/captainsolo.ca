import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatEmail, validateContact } from '../worker/contact.ts'

const good = { name: 'Ada', email: 'ada@example.com', message: 'I need a portfolio site.' }

test('accepts a normal submission', () => {
  const r = validateContact({ ...good, phone: '416-555-0100', service: 'Website', budget: 'Not sure yet' })
  assert.equal(r.ok, true)
  assert.equal(r.spam, false)
  assert.equal(r.data.service, 'Website')
})

test('rejects missing name, bad email and short messages', () => {
  assert.equal(validateContact({ ...good, name: '  ' }).ok, false)
  assert.equal(validateContact({ ...good, email: 'ada@' }).ok, false)
  assert.equal(validateContact({ ...good, email: 'a b@example.com' }).ok, false)
  assert.equal(validateContact({ ...good, message: 'hi' }).ok, false)
  assert.equal(validateContact(null).ok, false)
  assert.equal(validateContact('text').ok, false)
})

test('enforces length limits', () => {
  assert.equal(validateContact({ ...good, message: 'x'.repeat(5001) }).ok, false)
  assert.equal(validateContact({ ...good, name: 'x'.repeat(101) }).ok, false)
  assert.equal(validateContact({ ...good, message: 'x'.repeat(5000) }).ok, true)
})

test('honeypot submissions are flagged as spam, not errors', () => {
  const r = validateContact({ ...good, website: 'http://spam.example' })
  assert.equal(r.ok, true)
  assert.equal(r.spam, true)
})

test('header fields cannot carry line breaks (no header injection)', () => {
  const r = validateContact({ ...good, name: 'Ada\r\nBcc: victim@example.com', service: 'Web\nsite' })
  assert.equal(r.ok, true)
  assert.doesNotMatch(r.data.name, /[\r\n]/)
  const { subject } = formatEmail(r.data)
  assert.doesNotMatch(subject, /[\r\n]/)
})

test('non-string fields are ignored rather than crashing', () => {
  const r = validateContact({ ...good, phone: { evil: true }, budget: 42 })
  assert.equal(r.ok, true)
  assert.equal(r.data.phone, '')
  assert.equal(r.data.budget, '')
})

test('email body keeps the message and shows blanks as dashes', () => {
  const r = validateContact(good)
  const { subject, text } = formatEmail(r.data)
  assert.equal(subject, 'New enquiry: General — Ada')
  assert.match(text, /Phone: {3}—/)
  assert.match(text, /I need a portfolio site\./)
})
