/**
 * Checks that Content Source Maps resolve page builder content to the right document:
 * fields of referenced products, articles and testimonials open their own documents.
 *
 *   yarn verify:source-maps
 */
import {readFileSync} from 'node:fs'
import {homedir} from 'node:os'
import {createClient} from '@sanity/client'
import {resolveEditInfo} from '@sanity/client/csm'
import {createJiti} from 'jiti'

const jiti = createJiti(import.meta.url)
const {pageBySlugQuery} = await jiti.import('../app/queries/pages.ts')
const token = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, 'utf8')).authToken
const client = createClient({projectId: '40bhay7m', dataset: 'production', apiVersion: '2025-02-19', token, useCdn: false})
const {result, resultSourceMap} = await client.fetch(pageBySlugQuery, {slug: 'home', language: process.env.LANGUAGE || 'en'}, {perspective: 'drafts', resultSourceMap: 'withKeyArraySelector', filterResponse: false})
const at = (resultPath) => resolveEditInfo({resultPath, resultSourceMap, studioUrl: 'http://localhost:3333'})
const idx = (type) => result.pageBuilder.findIndex((b) => b._type === type)
const cases = [
  ['hero heading', ['pageBuilder', idx('heroBlock'), 'heading']],
  ['product name in product grid', ['pageBuilder', idx('productGridBlock'), 'items', 0, 'name']],
  ['article title in news grid', ['pageBuilder', idx('newsGridBlock'), 'items', 0, 'title']],
  ['testimonial quote', ['pageBuilder', idx('testimonialBlock'), 'testimonials', 0, 'quote']],
  ['FAQ question', ['pageBuilder', idx('faqBlock'), 'items', 1, 'question']],
]
for (const [label, path] of cases) {
  const info = at(path)
  console.log(`✔ ${label.padEnd(30)} → ${info?.type}:${info?.id} @ ${typeof info?.path === 'string' ? info.path : JSON.stringify(info?.path)}`)
}
