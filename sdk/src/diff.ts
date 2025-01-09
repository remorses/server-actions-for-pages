import compareOpenApiSchemas from 'openapi-schema-diff/lib'
import deepmerger from '@fastify/deepmerge'
const deepmerge = deepmerger({})

import { RefResolver } from 'json-schema-ref-resolver'

import dedent from 'string-dedent'
import { OpenAPIV3 } from 'openapi-types'
import { diffJson } from 'diff'
import { randomUUID } from 'crypto'

export function getOpenApiDiffPrompt({
  previousOpenApiSchema,
  openApiSchema,
}: {
  previousOpenApiSchema?: OpenAPIV3.Document
  openApiSchema: OpenAPIV3.Document
}) {
  if (!previousOpenApiSchema) {
    return {
      fullPrompt: '',
      changedRoutesText: [],
      addedRoutesText: [],
      deletedRoutesText: [],
    }
  }
  const { changedRoutes, addedRoutes, deletedRoutes } = compareOpenApiSchemas(
    previousOpenApiSchema,
    openApiSchema,
  )
  const changedRoutesText = changedRoutes
    .map((route) => {
      if (!route.changes) {
        return {
          route,
          diffPrompt: `<route type="changed" method="${route.method.toUpperCase()}" path="${
            route.path
          }" />`,
        }
      }

      const changesText = route.changes.map((change) => {
        const diff = diffJson(
          lessIndentation(
            recursivelyResolveComponents({
              // subsetSchema: change.sourceSchema,
              openApiSchema: previousOpenApiSchema,
              path: route.path,
              method: route.method,
            }),
          ) || {},
          lessIndentation(
            recursivelyResolveComponents({
              // subsetSchema: change.targetSchema,
              openApiSchema: openApiSchema,
              path: route.path,
              method: route.method,
            }),
          ) || {},
        )
        const diffText = diff
          .map((part) => {
            const prefix = part.added ? '+' : part.removed ? '-' : ' '
            return (
              part.value
                .split('\n')
                // .filter(x => x)
                // .map(line => prefix + ' ' + line)
                .map((line) => (line.trim() ? prefix + ' ' + line : line))
                .join('\n')
            )
          })
          .join('')

        return {
          route,
          diffPrompt: dedent`
            This route should be updated in the SDK as it was updated from the OpenAPI schema.
              <route type="changed" method="${route.method.toUpperCase()}" path="${
            route.path
          }">
              <comment>${change.type} ${change.action}: ${
            change.comment
          }</comment>
              <diff>
              ${diffText}
              </diff>
              </route>
              `,
        }
      })

      return changesText
    })
    .flat()

  const addedRoutesText = addedRoutes.map((route) => {
    const schema = recursivelyResolveComponents({
      // subsetSchema: route.targetSchema,
      openApiSchema: openApiSchema,
      path: route.path,
      method: route.method,
    })
    return {
      route,
      diffPrompt: dedent`
            This route should be added to the SDK as it was added to the OpenAPI schema.
            <route type="added" method="${route.method.toUpperCase()}" path="${
        route.path
      }">
            <comment>Added new route</comment>
            <diff>
            ${lessIndentation(schema)
              .split('\n')
              // .map((line) => '+ ' + line)
              .join('\n')}
            </diff>
            </route>
        `,
    }
  })

  const deletedRoutesText = deletedRoutes.map((route) => {
    const schema =
      recursivelyResolveComponents({
        // subsetSchema: route.sourceSchema,
        openApiSchema: previousOpenApiSchema,
        path: route.path,
        method: route.method,
      }) || null

    return {
      route,
      diffPrompt: dedent`
        This route should be removed from the SDK as it was deleted from the OpenAPI schema.
        <route type="deleted" method="${route.method.toUpperCase()}" path="${
        route.path
      }">
        <comment>Deleted route</comment>
        <diff>
        ${lessIndentation(schema)
          .split('\n')
          .map((line) => '- ' + line)
          .join('\n')}
        </diff>
        </route>
        `,
    }
  })

  const llmPrompt = dedent`
    <changedRoutes>
    ${changedRoutesText.map((r) => r.diffPrompt).join('\n\n') || 'None'}
    </changedRoutes>

    <addedRoutes>
    ${addedRoutesText.map((r) => r.diffPrompt).join('\n\n') || 'None'}
    </addedRoutes>

    <deletedRoutes>
    ${deletedRoutesText.map((r) => r.diffPrompt).join('\n\n') || 'None'} 
    </deletedRoutes>
    `

  return {
    fullPrompt: llmPrompt,
    changedRoutesText,
    addedRoutesText,
    deletedRoutesText,
  }
}

// turns /x/y into { x: { y: value }}
function refPathToObject(ref: string, value: any) {
  const parts = ref.replace(/^#\//, '').split('/') // Remove leading #/ with regex
  let result = {}
  let current = result

  // Build the nested structure
  for (let i = 0; i < parts.length - 1; i++) {
    current[parts[i]] = {}
    current = current[parts[i]]
  }

  // Set the final value
  current[parts[parts.length - 1]] = value
  return result
}

export function recursivelyResolveComponents({
  openApiSchema,
  path,
  method,
}: {
  openApiSchema: OpenAPIV3.Document
  path: string
  method: string
}) {
  const resolver = new RefResolver()
  const id = randomUUID()
  resolver.addSchema(openApiSchema, id)
  const subsetSchema = openApiSchema.paths?.[path]?.[method]
  if (!subsetSchema) {
    throw new Error(
      `Invalid open api schema, cannot get route with path ${path}`,
    )
  }

  let paths: OpenAPIV3.PathsObject = {
    [path]: {
      [method]: subsetSchema,
    },
  }

  const stack = [{ key: '', value: structuredClone(subsetSchema) }]

  while (stack.length > 0) {
    const { value } = stack.pop()!

    if (typeof value === 'object' && value !== null) {
      if ('$ref' in value) {
        const resolved = resolver.getSchema(id, value.$ref as any)
        const refObject = refPathToObject(value.$ref as string, resolved)
        paths = deepmerge(paths, refObject)
      } else {
        for (const [k, v] of Object.entries(value)) {
          stack.push({ key: k, value: v })
        }
      }
    }
  }

  const fullOpenapi = {
    ...openApiSchema,
    paths,
  }
  return fullOpenapi
}

function lessIndentation(schema) {
  const json = JSON.stringify(schema, null, 2)
  return json
  return json
    .split('\n')
    .filter((line) => line.length > 0)
    .slice(1, -1) // Remove first and last lines (curly braces)
    .map((line) => line.slice(2)) // Remove 2 spaces of indentation
    .join('\n')
}
