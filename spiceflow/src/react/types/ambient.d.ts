/// <reference types="vite/client" />
// import {Spiceflow} from '../../spiceflow.js'

declare module '@jacob-ebey/react-server-dom-vite/server' {
  export function renderToPipeableStream<T>(
    data: T,
    manifest: import('.').ClientReferenceMetadataManifest,
    options?: {
      environmentName?: string | (() => string)
      filterStackFrame?: (url: string, functionName: string) => boolean
      onError?: (error: any) => void
      onPostpone?: (reason: string) => void
      identifierPrefix?: string
      temporaryReferences?: any
    },
  ): import('react-dom/server').PipeableStream

  export function decodeReply(body: string | FormData): Promise<unknown[]>

  export function decodeAction(
    body: FormData,
    manifest: import('.').ServerReferenceManifest,
  ): Promise<() => Promise<unknown>>

  export function decodeFormState(
    returnValue: unknown,
    body: FormData,
    manifest: import('.').ServerReferenceManifest,
  ): Promise<import('react-dom/client').ReactFormState>
  const defaultExport: {
	registerServerReference: Function
	registerClientReference: Function
	decodeReply: typeof decodeReply
	decodeAction: typeof decodeAction
	decodeFormState: typeof decodeFormState
	renderToPipeableStream: typeof renderToPipeableStream
  }
  export default defaultExport
}

declare module 'spiceflow/dist/react/server-dom-client-optimized' {
  export function createFromNodeStream<T>(
    stream: import('node:stream').Readable,
    manifest: import('.').ClientReferenceManifest,
  ): Promise<T>

  export function createFromReadableStream<T>(
    stream: ReadableStream,
    manifest: import('.').ClientReferenceManifest,
    options: {
      callServer: import('.').CallServerFn
    },
  ): Promise<T>

  export function createFromFetch<T>(
    fetchReturn: ReturnType<typeof fetch>,
    manifest: unknown,
    options: {
      callServer: import('.').CallServerFn
    },
  ): Promise<T>

  export function encodeReply(v: unknown[]): Promise<string | FormData>
}

declare module 'virtual:ssr-assets' {
  export const bootstrapModules: string[]
}
declare module 'virtual:app-styles' {
   const cssUrls: string[]
   export default cssUrls
}

declare module 'virtual:app-entry' {
  import type { Spiceflow } from 'spiceflow'
  const app: Spiceflow
  export default app
}

declare module 'virtual:build-client-references' {
  const value: Record<string, () => Promise<Record<string, unknown>>>
  export default value
}

declare module 'virtual:build-server-references' {
  const value: Record<string, () => Promise<Record<string, unknown>>>
  export default value
}

declare const __raw_import: (id: string) => Promise<any>
declare const __callServer: CallServerFn
