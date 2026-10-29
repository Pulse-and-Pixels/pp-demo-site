/**
 * End-to-end check of draft preview and visual editing against a running dev server.
 *
 *   yarn dev            (in another terminal)
 *   yarn verify:preview
 *
 * Uses your Sanity CLI login (`npx sanity login`) to create a temporary draft of the
 * homepage and a preview secret, exactly like the Presentation tool does, then deletes both.
 */
import {readFileSync} from 'node:fs'
import {homedir} from 'node:os'
import {createClient} from '@sanity/client'
import {createPreviewSecret} from '@sanity/preview-url-secret/create-secret'

const BASE = process.env.SITE_URL || 'http://localhost:3000'
const viewerToken = (readFileSync(new URL('../.env', import.meta.url), 'utf8').match(/^NUXT_SANITY_VISUAL_EDITING_TOKEN=(.+)$/m) ?? [])[1]
const token = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, 'utf8')).authToken
const client = createClient({projectId: '40bhay7m', dataset: 'production', apiVersion: '2025-02-19', token, useCdn: false, perspective: 'raw'})
const STEGA = /[​‌‍⁢⁣﻿]{8,}/
const check = (ok, label) => {
  if (!ok) process.exitCode = 1
  console.log(`${ok ? '✔' : '✘'} ${label}`)
}
const html = async (path, cookie) => (await fetch(BASE + path, {headers: {accept: 'text/html', ...(cookie ? {cookie} : {})}})).text()

const DRAFT_HEADING = 'DRAFT ONLY: visual editing test heading'
const published = await client.getDocument('seed-page-home')
const draft = structuredClone(published)
draft._id = 'drafts.seed-page-home'
draft.pageBuilder[0].heading = DRAFT_HEADING
delete draft._rev

try {
  await client.createOrReplace(draft)
  const {secret} = await createPreviewSecret(client, 'pp-demo-verify', 'http://localhost:3333')

  // 1. Enable preview the way the Presentation tool does
  const enable = await fetch(`${BASE}/preview/enable?sanity-preview-secret=${secret}&sanity-preview-pathname=/`, {redirect: 'manual'})
  const setCookie = enable.headers.get('set-cookie') ?? ''
  const cookie = setCookie.split(';')[0]
  check(enable.status === 307 && cookie.startsWith('sanity-preview-id='), `preview/enable → ${enable.status}, httpOnly cookie: ${/HttpOnly/i.test(setCookie)}`)
  const bad = await fetch(`${BASE}/preview/enable?sanity-preview-secret=wrong&sanity-preview-pathname=/`, {redirect: 'manual'})
  check(bad.status === 401, `invalid secret rejected (${bad.status})`)

  // 2. Preview session: drafts + stega + data-sanity
  const preview = await html('/', cookie)
  const previewText = preview.replace(/[​‌‍⁢⁣﻿]/g, '')
  check(previewText.includes(DRAFT_HEADING), 'preview shows the unpublished draft heading')
  check(STEGA.test(preview), 'preview HTML contains stega edit metadata')
  check(preview.includes('data-sanity='), `preview HTML has data-sanity attributes (${preview.match(/data-sanity=/g)?.length ?? 0})`)
  check(!viewerToken || !preview.includes(viewerToken), 'preview HTML never contains the server-side token')
  const head = preview.slice(0, preview.indexOf('</head>'))
  check(!STEGA.test(head), 'no stega metadata leaks into <head>')

  // 3. Public visitor: published only, no editing metadata
  const pub = await html('/')
  check(!pub.includes(DRAFT_HEADING), 'public page does NOT show the draft')
  check(pub.includes(published.pageBuilder[0].heading), 'public page shows the published heading')
  check(!STEGA.test(pub), 'public HTML has no stega metadata')
  check(!pub.includes('data-sanity='), 'public HTML has no data-sanity attributes')

  // 4. Client-side draft proxy is locked behind the preview cookie
  const body = JSON.stringify({query: '*[_id == "seed-page-home"][0].pageBuilder[0].heading', params: {}, options: {perspective: 'drafts'}})
  const proxyNoCookie = await fetch(`${BASE}/_sanity/visual-editing/fetch`, {method: 'POST', body, headers: {'content-type': 'application/json'}})
  check(proxyNoCookie.status === 403, `draft proxy without cookie → ${proxyNoCookie.status}`)
  const proxy = await fetch(`${BASE}/_sanity/visual-editing/fetch`, {method: 'POST', body, headers: {'content-type': 'application/json', cookie}})
  const proxied = await proxy.text()
  check(proxy.status === 200 && proxied.includes('DRAFT ONLY'), `draft proxy with cookie → ${proxy.status} returns draft`)

  // 5. Public CDN never returns drafts
  const cdn = await (await fetch(`https://40bhay7m.apicdn.sanity.io/v2025-02-19/data/query/production?query=${encodeURIComponent('*[_id in ["seed-page-home","drafts.seed-page-home"]]{_id, "h": pageBuilder[0].heading}')}`)).json()
  check(cdn.result.length === 1 && !cdn.result[0].h.includes('DRAFT'), `unauthenticated CDN query sees ${cdn.result.length} doc(s), no draft`)

  // 6. Explicit data-sanity attributes on referenced items point at their own documents
  check(preview.includes('id=seed-product-'), 'product cards carry data-sanity for the product document')

  // 7. Disable preview
  const disable = await fetch(`${BASE}/preview/disable?redirect=/`, {redirect: 'manual', headers: {cookie}})
  check(/sanity-preview-id=;|Max-Age=0|expires=Thu, 01 Jan 1970/i.test(disable.headers.get('set-cookie') ?? ''), `preview/disable clears the cookie (${disable.status})`)
} finally {
  await client.delete('drafts.seed-page-home')
  const secrets = await client.fetch('*[_type == "sanity.previewUrlSecret" && source == "pp-demo-verify"]._id')
  for (const id of secrets) await client.delete(id)
  console.log(`cleanup: removed test draft and ${secrets.length} preview secret(s)`)
}
