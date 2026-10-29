import type {StudioPathLike} from '@sanity/client/csm'
import {createDataAttribute} from '@sanity/visual-editing-csm'
import type {DocumentRef, PathSegment} from '~/types/sanity'

/**
 * Builds `data-sanity` attributes for elements that stega cannot annotate
 * (images, sections, list items). Returns `undefined` for regular visitors,
 * so public HTML stays clean.
 */
export function useEditAttr() {
  const state = useSanityVisualEditingState()
  const studioUrl = useSanityConfig().visualEditing?.studioUrl

  return (doc: DocumentRef | null | undefined, path: StudioPathLike): string | undefined => {
    if (!state?.enabled || !doc?._id || !studioUrl) return undefined
    return createDataAttribute({id: doc._id, type: doc._type, path, baseUrl: studioUrl}).toString()
  }
}

/** Edit attributes scoped to a page builder block, e.g. `attr('image')` or `attr('items', {_key})`. */
export function useBlockAttr(props: {doc?: DocumentRef; path?: PathSegment[]}) {
  const editAttr = useEditAttr()
  return (...segments: PathSegment[]) => editAttr(props.doc, [...(props.path ?? []), ...segments])
}

export function useIsPreview() {
  const state = useSanityVisualEditingState()
  return computed(() => Boolean(state?.enabled))
}
