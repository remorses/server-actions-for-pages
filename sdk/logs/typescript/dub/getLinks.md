openapi: 3.0.3
info:
  title: Dub.co API
  description: Dub is link management infrastructure for companies to create marketing campaigns, link sharing features, and referral programs.
  version: 0.0.1
  contact:
    name: Dub.co Support
    email: support@dub.co
    url: https://dub.co/api
  license:
    name: AGPL-3.0 license
    url: https://github.com/dubinc/dub/blob/main/LICENSE.md
servers:
  - url: https://api.dub.co
    description: Production API
paths:
  /links:
    get:
      operationId: getLinks
      x-speakeasy-name-override: list
      x-speakeasy-pagination:
        type: offsetLimit
        inputs:
          - name: page
            in: parameters
            type: page
          - name: pageSize
            in: parameters
            type: limit
        outputs:
          results: $
      summary: Retrieve a list of links
      description: Retrieve a paginated list of links for the authenticated workspace.
      tags:
        - Links
      parameters:
        - in: query
          name: domain
          description: The domain to filter the links by. E.g. `ac.me`. If not provided, all links for the workspace will be returned.
          schema:
            type: string
            description: The domain to filter the links by. E.g. `ac.me`. If not provided, all links for the workspace will be returned.
        - in: query
          name: tagId
          description: Deprecated. Use `tagIds` instead. The tag ID to filter the links by.
          schema:
            type: string
            description: Deprecated. Use `tagIds` instead. The tag ID to filter the links by.
            deprecated: true
        - in: query
          name: tagIds
          description: The tag IDs to filter the links by.
          schema:
            anyOf:
              - type: string
              - type: array
                items:
                  type: string
            description: The tag IDs to filter the links by.
        - in: query
          name: tagNames
          description: The unique name of the tags assigned to the short link (case insensitive).
          schema:
            anyOf:
              - type: string
              - type: array
                items:
                  type: string
            description: The unique name of the tags assigned to the short link (case insensitive).
        - in: query
          name: search
          description: The search term to filter the links by. The search term will be matched against the short link slug and the destination url.
          schema:
            type: string
            description: The search term to filter the links by. The search term will be matched against the short link slug and the destination url.
        - in: query
          name: userId
          description: The user ID to filter the links by.
          schema:
            type: string
            description: The user ID to filter the links by.
        - in: query
          name: showArchived
          description: Whether to include archived links in the response. Defaults to `false` if not provided.
          schema:
            type: boolean
            default: 'false'
            description: Whether to include archived links in the response. Defaults to `false` if not provided.
        - in: query
          name: withTags
          description: DEPRECATED. Filter for links that have at least one tag assigned to them.
          schema:
            type: boolean
            default: 'false'
            description: DEPRECATED. Filter for links that have at least one tag assigned to them.
            deprecated: true
        - in: query
          name: sort
          description: The field to sort the links by. The default is `createdAt`, and sort order is always descending.
          schema:
            type: string
            enum:
              - createdAt
              - clicks
              - lastClicked
            default: createdAt
            description: The field to sort the links by. The default is `createdAt`, and sort order is always descending.
        - in: query
          name: page
          description: The page number for pagination.
          schema:
            type: number
            minimum: 0
            exclusiveMinimum: true
            default: 1
            description: The page number for pagination.
            example: 1
        - in: query
          name: pageSize
          description: The number of items per page.
          schema:
            type: number
            minimum: 0
            exclusiveMinimum: true
            maximum: 100
            default: 100
            description: The number of items per page.
            example: 50
      responses:
        '200':
          description: A list of links
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/LinkSchema'
        '400':
          $ref: '#/components/responses/400'
        '401':
          $ref: '#/components/responses/401'
        '403':
          $ref: '#/components/responses/403'
        '404':
          $ref: '#/components/responses/404'
        '409':
          $ref: '#/components/responses/409'
        '410':
          $ref: '#/components/responses/410'
        '422':
          $ref: '#/components/responses/422'
        '429':
          $ref: '#/components/responses/429'
        '500':
          $ref: '#/components/responses/500'
components:
  responses:
    '400':
      description: The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
      content:
        application/json:
          schema:
            x-speakeasy-name-override: BadRequest
            type: object
            properties:
              error:
                type: object
                properties:
                  code:
                    type: string
                    enum:
                      - bad_request
                    description: A short code indicating the error code returned.
                    example: bad_request
                  message:
                    x-speakeasy-error-message: true
                    type: string
                    description: A human readable explanation of what went wrong.
                    example: The requested resource was not found.
                  doc_url:
                    type: string
                    description: A link to our documentation with more details about this error code
                    example: https://dub.co/docs/api-reference/errors#bad-request
                required:
                  - code
                  - message
            required:
              - error
    '401':
      description: Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
      content:
        application/json:
          schema:
            x-speakeasy-name-override: Unauthorized
            type: object
            properties:
              error:
                type: object
                properties:
                  code:
                    type: string
                    enum:
                      - unauthorized
                    description: A short code indicating the error code returned.
                    example: unauthorized
                  message:
                    x-speakeasy-error-message: true
                    type: string
                    description: A human readable explanation of what went wrong.
                    example: The requested resource was not found.
                  doc_url:
                    type: string
                    description: A link to our documentation with more details about this error code
                    example: https://dub.co/docs/api-reference/errors#unauthorized
                required:
                  - code
                  - message
            required:
              - error
    '403':
      description: The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server.
      content:
        application/json:
          schema:
            x-speakeasy-name-override: Forbidden
            type: object
            properties:
              error:
                type: object
                properties:
                  code:
                    type: string
                    enum:
                      - forbidden
                    description: A short code indicating the error code returned.
                    example: forbidden
                  message:
                    x-speakeasy-error-message: true
                    type: string
                    description: A human readable explanation of what went wrong.
                    example: The requested resource was not found.
                  doc_url:
                    type: string
                    description: A link to our documentation with more details about this error code
                    example: https://dub.co/docs/api-reference/errors#forbidden
                required:
                  - code
                  - message
            required:
              - error
    '404':
      description: The server cannot find the requested resource.
      content:
        application/json:
          schema:
            x-speakeasy-name-override: NotFound
            type: object
            properties:
              error:
                type: object
                properties:
                  code:
                    type: string
                    enum:
                      - not_found
                    description: A short code indicating the error code returned.
                    example: not_found
                  message:
                    x-speakeasy-error-message: true
                    type: string
                    description: A human readable explanation of what went wrong.
                    example: The requested resource was not found.
                  doc_url:
                    type: string
                    description: A link to our documentation with more details about this error code
                    example: https://dub.co/docs/api-reference/errors#not-found
                required:
                  - code
                  - message
            required:
              - error
    '409':
      description: This response is sent when a request conflicts with the current state of the server.
      content:
        application/json:
          schema:
            x-speakeasy-name-override: Conflict
            type: object
            properties:
              error:
                type: object
                properties:
                  code:
                    type: string
                    enum:
                      - conflict
                    description: A short code indicating the error code returned.
                    example: conflict
                  message:
                    x-speakeasy-error-message: true
                    type: string
                    description: A human readable explanation of what went wrong.
                    example: The requested resource was not found.
                  doc_url:
                    type: string
                    description: A link to our documentation with more details about this error code
                    example: https://dub.co/docs/api-reference/errors#conflict
                required:
                  - code
                  - message
            required:
              - error
    '410':
      description: This response is sent when the requested content has been permanently deleted from server, with no forwarding address.
      content:
        application/json:
          schema:
            x-speakeasy-name-override: InviteExpired
            type: object
            properties:
              error:
                type: object
                properties:
                  code:
                    type: string
                    enum:
                      - invite_expired
                    description: A short code indicating the error code returned.
                    example: invite_expired
                  message:
                    x-speakeasy-error-message: true
                    type: string
                    description: A human readable explanation of what went wrong.
                    example: The requested resource was not found.
                  doc_url:
                    type: string
                    description: A link to our documentation with more details about this error code
                    example: https://dub.co/docs/api-reference/errors#invite-expired
                required:
                  - code
                  - message
            required:
              - error
    '422':
      description: The request was well-formed but was unable to be followed due to semantic errors.
      content:
        application/json:
          schema:
            x-speakeasy-name-override: UnprocessableEntity
            type: object
            properties:
              error:
                type: object
                properties:
                  code:
                    type: string
                    enum:
                      - unprocessable_entity
                    description: A short code indicating the error code returned.
                    example: unprocessable_entity
                  message:
                    x-speakeasy-error-message: true
                    type: string
                    description: A human readable explanation of what went wrong.
                    example: The requested resource was not found.
                  doc_url:
                    type: string
                    description: A link to our documentation with more details about this error code
                    example: https://dub.co/docs/api-reference/errors#unprocessable-entity
                required:
                  - code
                  - message
            required:
              - error
    '429':
      description: The user has sent too many requests in a given amount of time ("rate limiting")
      content:
        application/json:
          schema:
            x-speakeasy-name-override: RateLimitExceeded
            type: object
            properties:
              error:
                type: object
                properties:
                  code:
                    type: string
                    enum:
                      - rate_limit_exceeded
                    description: A short code indicating the error code returned.
                    example: rate_limit_exceeded
                  message:
                    x-speakeasy-error-message: true
                    type: string
                    description: A human readable explanation of what went wrong.
                    example: The requested resource was not found.
                  doc_url:
                    type: string
                    description: A link to our documentation with more details about this error code
                    example: https://dub.co/docs/api-reference/errors#rate-limit_exceeded
                required:
                  - code
                  - message
            required:
              - error
    '500':
      description: The server has encountered a situation it does not know how to handle.
      content:
        application/json:
          schema:
            x-speakeasy-name-override: InternalServerError
            type: object
            properties:
              error:
                type: object
                properties:
                  code:
                    type: string
                    enum:
                      - internal_server_error
                    description: A short code indicating the error code returned.
                    example: internal_server_error
                  message:
                    x-speakeasy-error-message: true
                    type: string
                    description: A human readable explanation of what went wrong.
                    example: The requested resource was not found.
                  doc_url:
                    type: string
                    description: A link to our documentation with more details about this error code
                    example: https://dub.co/docs/api-reference/errors#internal-server_error
                required:
                  - code
                  - message
            required:
              - error
  schemas:
    LinkSchema:
      type: object
      properties:
        id:
          type: string
          description: The unique ID of the short link.
        domain:
          type: string
          description: The domain of the short link. If not provided, the primary domain for the workspace will be used (or `dub.sh` if the workspace has no domains).
        key:
          type: string
          description: The short link slug. If not provided, a random 7-character slug will be generated.
        url:
          type: string
          format: uri
          description: The destination URL of the short link.
        trackConversion:
          type: boolean
          default: false
          description: '[BETA] Whether to track conversions for the short link.'
        externalId:
          type: string
          nullable: true
          description: This is the ID of the link in your database that is unique across your workspace. If set, it can be used to identify the link in future API requests. Must be prefixed with 'ext_' when passed as a query parameter.
        archived:
          type: boolean
          default: false
          description: Whether the short link is archived.
        expiresAt:
          type: string
          nullable: true
          description: The date and time when the short link will expire in ISO-8601 format.
        expiredUrl:
          type: string
          nullable: true
          format: uri
          description: The URL to redirect to when the short link has expired.
        password:
          type: string
          nullable: true
          description: The password required to access the destination URL of the short link.
        proxy:
          type: boolean
          default: false
          description: Whether the short link uses Custom Social Media Cards feature.
        title:
          type: string
          nullable: true
          description: The title of the short link generated via `api.dub.co/metatags`. Will be used for Custom Social Media Cards if `proxy` is true.
        description:
          type: string
          nullable: true
          description: The description of the short link generated via `api.dub.co/metatags`. Will be used for Custom Social Media Cards if `proxy` is true.
        image:
          type: string
          nullable: true
          description: The image of the short link generated via `api.dub.co/metatags`. Will be used for Custom Social Media Cards if `proxy` is true.
        video:
          type: string
          nullable: true
          description: 'The custom link preview video (og:video). Will be used for Custom Social Media Cards if `proxy` is true. Learn more: https://d.to/og'
        rewrite:
          type: boolean
          default: false
          description: Whether the short link uses link cloaking.
        doIndex:
          type: boolean
          default: false
          description: Whether to allow search engines to index the short link.
        ios:
          type: string
          nullable: true
          description: The iOS destination URL for the short link for iOS device targeting.
        android:
          type: string
          nullable: true
          description: The Android destination URL for the short link for Android device targeting.
        geo:
          type: object
          nullable: true
          properties:
            AF:
              type: string
              format: uri
            AL:
              type: string
              format: uri
            DZ:
              type: string
              format: uri
            AS:
              type: string
              format: uri
            AD:
              type: string
              format: uri
            AO:
              type: string
              format: uri
            AI:
              type: string
              format: uri
            AQ:
              type: string
              format: uri
            AG:
              type: string
              format: uri
            AR:
              type: string
              format: uri
            AM:
              type: string
              format: uri
            AW:
              type: string
              format: uri
            AU:
              type: string
              format: uri
            AT:
              type: string
              format: uri
            AZ:
              type: string
              format: uri
            BS:
              type: string
              format: uri
            BH:
              type: string
              format: uri
            BD:
              type: string
              format: uri
            BB:
              type: string
              format: uri
            BY:
              type: string
              format: uri
            BE:
              type: string
              format: uri
            BZ:
              type: string
              format: uri
            BJ:
              type: string
              format: uri
            BM:
              type: string
              format: uri
            BT:
              type: string
              format: uri
            BO:
              type: string
              format: uri
            BA:
              type: string
              format: uri
            BW:
              type: string
              format: uri
            BV:
              type: string
              format: uri
            BR:
              type: string
              format: uri
            IO:
              type: string
              format: uri
            BN:
              type: string
              format: uri
            BG:
              type: string
              format: uri
            BF:
              type: string
              format: uri
            BI:
              type: string
              format: uri
            KH:
              type: string
              format: uri
            CM:
              type: string
              format: uri
            CA:
              type: string
              format: uri
            CV:
              type: string
              format: uri
            KY:
              type: string
              format: uri
            CF:
              type: string
              format: uri
            TD:
              type: string
              format: uri
            CL:
              type: string
              format: uri
            CN:
              type: string
              format: uri
            CX:
              type: string
              format: uri
            CC:
              type: string
              format: uri
            CO:
              type: string
              format: uri
            KM:
              type: string
              format: uri
            CG:
              type: string
              format: uri
            CD:
              type: string
              format: uri
            CK:
              type: string
              format: uri
            CR:
              type: string
              format: uri
            CI:
              type: string
              format: uri
            HR:
              type: string
              format: uri
            CU:
              type: string
              format: uri
            CY:
              type: string
              format: uri
            CZ:
              type: string
              format: uri
            DK:
              type: string
              format: uri
            DJ:
              type: string
              format: uri
            DM:
              type: string
              format: uri
            DO:
              type: string
              format: uri
            EC:
              type: string
              format: uri
            EG:
              type: string
              format: uri
            SV:
              type: string
              format: uri
            GQ:
              type: string
              format: uri
            ER:
              type: string
              format: uri
            EE:
              type: string
              format: uri
            ET:
              type: string
              format: uri
            FK:
              type: string
              format: uri
            FO:
              type: string
              format: uri
            FJ:
              type: string
              format: uri
            FI:
              type: string
              format: uri
            FR:
              type: string
              format: uri
            GF:
              type: string
              format: uri
            PF:
              type: string
              format: uri
            TF:
              type: string
              format: uri
            GA:
              type: string
              format: uri
            GM:
              type: string
              format: uri
            GE:
              type: string
              format: uri
            DE:
              type: string
              format: uri
            GH:
              type: string
              format: uri
            GI:
              type: string
              format: uri
            GR:
              type: string
              format: uri
            GL:
              type: string
              format: uri
            GD:
              type: string
              format: uri
            GP:
              type: string
              format: uri
            GU:
              type: string
              format: uri
            GT:
              type: string
              format: uri
            GN:
              type: string
              format: uri
            GW:
              type: string
              format: uri
            GY:
              type: string
              format: uri
            HT:
              type: string
              format: uri
            HM:
              type: string
              format: uri
            VA:
              type: string
              format: uri
            HN:
              type: string
              format: uri
            HK:
              type: string
              format: uri
            HU:
              type: string
              format: uri
            IS:
              type: string
              format: uri
            IN:
              type: string
              format: uri
            ID:
              type: string
              format: uri
            IR:
              type: string
              format: uri
            IQ:
              type: string
              format: uri
            IE:
              type: string
              format: uri
            IL:
              type: string
              format: uri
            IT:
              type: string
              format: uri
            JM:
              type: string
              format: uri
            JP:
              type: string
              format: uri
            JO:
              type: string
              format: uri
            KZ:
              type: string
              format: uri
            KE:
              type: string
              format: uri
            KI:
              type: string
              format: uri
            KP:
              type: string
              format: uri
            KR:
              type: string
              format: uri
            KW:
              type: string
              format: uri
            KG:
              type: string
              format: uri
            LA:
              type: string
              format: uri
            LV:
              type: string
              format: uri
            LB:
              type: string
              format: uri
            LS:
              type: string
              format: uri
            LR:
              type: string
              format: uri
            LY:
              type: string
              format: uri
            LI:
              type: string
              format: uri
            LT:
              type: string
              format: uri
            LU:
              type: string
              format: uri
            MO:
              type: string
              format: uri
            MG:
              type: string
              format: uri
            MW:
              type: string
              format: uri
            MY:
              type: string
              format: uri
            MV:
              type: string
              format: uri
            ML:
              type: string
              format: uri
            MT:
              type: string
              format: uri
            MH:
              type: string
              format: uri
            MQ:
              type: string
              format: uri
            MR:
              type: string
              format: uri
            MU:
              type: string
              format: uri
            YT:
              type: string
              format: uri
            MX:
              type: string
              format: uri
            FM:
              type: string
              format: uri
            MD:
              type: string
              format: uri
            MC:
              type: string
              format: uri
            MN:
              type: string
              format: uri
            MS:
              type: string
              format: uri
            MA:
              type: string
              format: uri
            MZ:
              type: string
              format: uri
            MM:
              type: string
              format: uri
            NA:
              type: string
              format: uri
            NR:
              type: string
              format: uri
            NP:
              type: string
              format: uri
            NL:
              type: string
              format: uri
            NC:
              type: string
              format: uri
            NZ:
              type: string
              format: uri
            NI:
              type: string
              format: uri
            NE:
              type: string
              format: uri
            NG:
              type: string
              format: uri
            NU:
              type: string
              format: uri
            NF:
              type: string
              format: uri
            MK:
              type: string
              format: uri
            MP:
              type: string
              format: uri
            'NO':
              type: string
              format: uri
            OM:
              type: string
              format: uri
            PK:
              type: string
              format: uri
            PW:
              type: string
              format: uri
            PS:
              type: string
              format: uri
            PA:
              type: string
              format: uri
            PG:
              type: string
              format: uri
            PY:
              type: string
              format: uri
            PE:
              type: string
              format: uri
            PH:
              type: string
              format: uri
            PN:
              type: string
              format: uri
            PL:
              type: string
              format: uri
            PT:
              type: string
              format: uri
            PR:
              type: string
              format: uri
            QA:
              type: string
              format: uri
            RE:
              type: string
              format: uri
            RO:
              type: string
              format: uri
            RU:
              type: string
              format: uri
            RW:
              type: string
              format: uri
            SH:
              type: string
              format: uri
            KN:
              type: string
              format: uri
            LC:
              type: string
              format: uri
            PM:
              type: string
              format: uri
            VC:
              type: string
              format: uri
            WS:
              type: string
              format: uri
            SM:
              type: string
              format: uri
            ST:
              type: string
              format: uri
            SA:
              type: string
              format: uri
            SN:
              type: string
              format: uri
            SC:
              type: string
              format: uri
            SL:
              type: string
              format: uri
            SG:
              type: string
              format: uri
            SK:
              type: string
              format: uri
            SI:
              type: string
              format: uri
            SB:
              type: string
              format: uri
            SO:
              type: string
              format: uri
            ZA:
              type: string
              format: uri
            GS:
              type: string
              format: uri
            ES:
              type: string
              format: uri
            LK:
              type: string
              format: uri
            SD:
              type: string
              format: uri
            SR:
              type: string
              format: uri
            SJ:
              type: string
              format: uri
            SZ:
              type: string
              format: uri
            SE:
              type: string
              format: uri
            CH:
              type: string
              format: uri
            SY:
              type: string
              format: uri
            TW:
              type: string
              format: uri
            TJ:
              type: string
              format: uri
            TZ:
              type: string
              format: uri
            TH:
              type: string
              format: uri
            TL:
              type: string
              format: uri
            TG:
              type: string
              format: uri
            TK:
              type: string
              format: uri
            TO:
              type: string
              format: uri
            TT:
              type: string
              format: uri
            TN:
              type: string
              format: uri
            TR:
              type: string
              format: uri
            TM:
              type: string
              format: uri
            TC:
              type: string
              format: uri
            TV:
              type: string
              format: uri
            UG:
              type: string
              format: uri
            UA:
              type: string
              format: uri
            AE:
              type: string
              format: uri
            GB:
              type: string
              format: uri
            US:
              type: string
              format: uri
            UM:
              type: string
              format: uri
            UY:
              type: string
              format: uri
            UZ:
              type: string
              format: uri
            VU:
              type: string
              format: uri
            VE:
              type: string
              format: uri
            VN:
              type: string
              format: uri
            VG:
              type: string
              format: uri
            VI:
              type: string
              format: uri
            WF:
              type: string
              format: uri
            EH:
              type: string
              format: uri
            YE:
              type: string
              format: uri
            ZM:
              type: string
              format: uri
            ZW:
              type: string
              format: uri
            AX:
              type: string
              format: uri
            BQ:
              type: string
              format: uri
            CW:
              type: string
              format: uri
            GG:
              type: string
              format: uri
            IM:
              type: string
              format: uri
            JE:
              type: string
              format: uri
            ME:
              type: string
              format: uri
            BL:
              type: string
              format: uri
            MF:
              type: string
              format: uri
            RS:
              type: string
              format: uri
            SX:
              type: string
              format: uri
            SS:
              type: string
              format: uri
            XK:
              type: string
              format: uri
          additionalProperties: false
          description: 'Geo targeting information for the short link in JSON format `{[COUNTRY]: https://example.com }`. Learn more: https://d.to/geo'
        publicStats:
          type: boolean
          default: false
          description: Whether the short link's stats are publicly accessible.
        tagId:
          type: string
          nullable: true
          description: The unique ID of the tag assigned to the short link. This field is deprecated – use `tags` instead.
          deprecated: true
        tags:
          type: array
          nullable: true
          items:
            $ref: '#/components/schemas/TagSchema'
          description: The tags assigned to the short link.
        webhookIds:
          type: array
          items:
            type: string
          description: The IDs of the webhooks that the short link is associated with.
        comments:
          type: string
          nullable: true
          description: The comments for the short link.
        shortLink:
          type: string
          format: uri
          description: The full URL of the short link, including the https protocol (e.g. `https://dub.sh/try`).
        qrCode:
          type: string
          format: uri
          description: The full URL of the QR code for the short link (e.g. `https://api.dub.co/qr?url=https://dub.sh/try`).
        utm_source:
          type: string
          nullable: true
          description: The UTM source of the short link.
        utm_medium:
          type: string
          nullable: true
          description: The UTM medium of the short link.
        utm_campaign:
          type: string
          nullable: true
          description: The UTM campaign of the short link.
        utm_term:
          type: string
          nullable: true
          description: The UTM term of the short link.
        utm_content:
          type: string
          nullable: true
          description: The UTM content of the short link.
        userId:
          type: string
          nullable: true
          description: The user ID of the creator of the short link.
        workspaceId:
          type: string
          description: The workspace ID of the short link.
        clicks:
          type: number
          default: 0
          description: The number of clicks on the short link.
        lastClicked:
          type: string
          nullable: true
          description: The date and time when the short link was last clicked.
        leads:
          type: number
          default: 0
          description: '[BETA]: The number of leads the short links has generated.'
        sales:
          type: number
          default: 0
          description: '[BETA]: The number of sales the short links has generated.'
        saleAmount:
          type: number
          default: 0
          description: '[BETA]: The total dollar amount of sales the short links has generated (in cents).'
        createdAt:
          type: string
          description: The date and time when the short link was created.
        updatedAt:
          type: string
          description: The date and time when the short link was last updated.
        projectId:
          type: string
          description: The project ID of the short link. This field is deprecated – use `workspaceId` instead.
          deprecated: true
        programId:
          type: string
          nullable: true
          description: The ID of the program the short link is associated with.
      required:
        - id
        - domain
        - key
        - url
        - trackConversion
        - externalId
        - archived
        - expiresAt
        - expiredUrl
        - password
        - proxy
        - title
        - description
        - image
        - video
        - rewrite
        - doIndex
        - ios
        - android
        - geo
        - publicStats
        - tagId
        - tags
        - webhookIds
        - comments
        - shortLink
        - qrCode
        - utm_source
        - utm_medium
        - utm_campaign
        - utm_term
        - utm_content
        - userId
        - workspaceId
        - clicks
        - lastClicked
        - leads
        - sales
        - saleAmount
        - createdAt
        - updatedAt
        - projectId
        - programId
      title: Link
    TagSchema:
      type: object
      properties:
        id:
          type: string
          description: The unique ID of the tag.
        name:
          type: string
          description: The name of the tag.
        color:
          type: string
          enum:
            - red
            - yellow
            - green
            - blue
            - purple
            - pink
            - brown
          description: The color of the tag.
      required:
        - id
        - name
        - color
      title: Tag

---
To implement the `GET /links` route in the `ExampleClient` class, we will create a new method called `getLinks`. This method will handle the request to retrieve a list of links, including the necessary parameters and error handling.

### Step-by-Step Reasoning:

1. **Method Declaration**: We will declare the method `getLinks` in the `ExampleClient` class. This method will be asynchronous and return a promise that resolves to an array of `Link` objects.

2. **Route Path and Method**: The method will be annotated with a comment indicating the route path (`/links`), the HTTP method (`GET`), and the tags (`Links`).

3. **Parameters**: The method will accept optional parameters that correspond to the query parameters defined in the OpenAPI schema. These include `domain`, `tagId`, `tagIds`, `tagNames`, `search`, `userId`, `showArchived`, `sort`, `page`, and `pageSize`.

4. **Fetch Call**: We will use the existing `fetch` method to make the API call, passing the appropriate parameters.

5. **Error Handling**: We will handle potential errors by checking the response status and throwing an `ExampleError` if the response is not successful.

6. **Return Type**: The method will return a promise that resolves to an array of `Link` objects.

### Code Snippet for Editing `./client.ts`:

```typescript:client.ts
  // ... existing code ...

  /**
   * GET /links
   * Retrieve a list of links
   * Tags: Links
   */
  async getLinks({
    domain,
    tagId,
    tagIds,
    tagNames,
    search,
    userId,
    showArchived = false,
    sort = 'createdAt',
    page = 1,
    pageSize = 100,
  }: {
    domain?: string;
    tagId?: string;
    tagIds?: string | string[];
    tagNames?: string | string[];
    search?: string;
    userId?: string;
    showArchived?: boolean;
    sort?: 'createdAt' | 'clicks' | 'lastClicked';
    page?: number;
    pageSize?: number;
  }): Promise<Link[]> {
    const response = await this.fetch<Link[]>({
      method: 'GET',
      path: '/links',
      query: {
        domain,
        tagId,
        tagIds,
        tagNames,
        search,
        userId,
        showArchived,
        sort,
        page,
        pageSize,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ExampleError(errorData.error.message, { status: response.status, data: errorData });
    }

    return response.json();
  }

  // ... existing code ...
```

This code snippet adds the `getLinks` method to the `ExampleClient` class, allowing users to retrieve a list of links with the specified query parameters while ensuring proper error handling and type safety.