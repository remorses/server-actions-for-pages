import type { IncomingMessage, ServerResponse } from "node:http";
import ReactDomServer from "react-dom/server";
import ReactClient from "spiceflow/dist/react/server-dom-client-optimized";
import type { ModuleRunner } from "vite/module-runner";
import type { ServerPayload } from "./entry.rsc.js";
import { clientReferenceManifest } from "./utils/client-reference.js";
import {
	createRequest,
	fromPipeableToWebReadable,
	fromWebToNodeReadable,
	sendResponse,
} from "./utils/fetch.js";
import {injectRSCPayload} from 'rsc-html-stream/server';





export default async function handler(
	req: IncomingMessage,
	res: ServerResponse,
) {
	const request = createRequest(req, res);
	const url = new URL(request.url);
	const rscEntry = await importRscEntry();
	const rscResult = await rscEntry.handler(url, request);

	if (rscResult instanceof Response) {
		sendResponse(rscResult, res);
		return;
	}
	

	if (url.searchParams.has("__rsc")) {
		const response = new Response(rscResult.stream, {
			headers: {
				"content-type": "text/x-component;charset=utf-8",
			},
		});
		sendResponse(response, res);
		return;
	}

	const [flightStream1, flightStream2] = rscResult.stream.tee();

	const payload = await ReactClient.createFromNodeStream<ServerPayload>(
		fromWebToNodeReadable(flightStream1),
		clientReferenceManifest,
	);

	const ssrAssets = await import("virtual:ssr-assets");

	const htmlStream = fromPipeableToWebReadable(
		ReactDomServer.renderToPipeableStream(payload.root, {
			bootstrapModules: ssrAssets.bootstrapModules,
			// @ts-ignore no type?
			formState: payload.formState,
		}),
	);

	const response = new Response(
		htmlStream
			
			.pipeThrough(injectRSCPayload(flightStream2)),
		{
			headers: {
				"content-type": "text/html;charset=utf-8",
			},
		},
	);
	sendResponse(response, res);
}

declare let __rscRunner: ModuleRunner;

async function importRscEntry(): Promise<typeof import("./entry.rsc.js")> {
	if (import.meta.env.DEV) {
		return await __rscRunner.import("spiceflow/src/react/entry.rsc.tsx");
	} else {
		return await import("virtual:build-rsc-entry" as any);
	}
}
