import type { ReactFormState } from "react-dom/client";
import React from "react";
import ReactServer from "spiceflow/dist/react/server-dom-optimized";

import type {
	ClientReferenceMetadataManifest,
	ServerReferenceManifest,
} from "./types/index.js";
import app from 'virtual:app-entry'
import { fromPipeableToWebReadable } from "./utils/fetch.js";

export interface RscHandlerResult {
	stream: ReadableStream<Uint8Array>;
}

export interface ServerPayload {
	root: React.ReactNode;
	formState?: ReactFormState;
	returnValue?: unknown;
}


export async function handler(
	url: URL,
	request: Request,
) {
	// handle action
	let returnValue: unknown | undefined;
	let formState: ReactFormState | undefined;
	if (request.method === "POST") {
		const actionId = url.searchParams.get("__rsc");
		if (actionId) {
			// client stream request
			const contentType = request.headers.get("content-type");
			const body = contentType?.startsWith("multipart/form-data")
				? await request.formData()
				: await request.text();
			const args = await ReactServer.decodeReply(body);
			const reference =
				serverReferenceManifest.resolveServerReference(actionId);
			await reference.preload();
			const action = await reference.get();
			returnValue = await (action as any).apply(null, args);
		} else {
			// progressive enhancement
			const formData = await request.formData();
			const decodedAction = await ReactServer.decodeAction(
				formData,
				serverReferenceManifest,
			);
			formState = await ReactServer.decodeFormState(
				await decodedAction(),
				formData,
				serverReferenceManifest,
			);
		}
	}

	const root = await app.handle(request)
	
	if (root instanceof Response) {
		return root
	}

	// render flight stream
	const stream = fromPipeableToWebReadable(
		ReactServer.renderToPipeableStream<ServerPayload>(
			{
				root,
				returnValue,
				formState,
			},
			clientReferenceMetadataManifest,
			{},
		),
	);

	let r : RscHandlerResult = {
		stream,
	};
	return r
}

const serverReferenceManifest: ServerReferenceManifest = {
	resolveServerReference(reference: string) {
		const [id, name] = reference.split("#");
		let resolved: unknown;
		return {
			async preload() {
				let mod: Record<string, unknown>;
				if (import.meta.env.DEV) {
					mod = await import(/* @vite-ignore */ id);
				} else {
					const references = await import("virtual:build-server-references");
					mod = await references.default[id]();
				}
				resolved = mod[name];
			},
			get() {
				return resolved;
			},
		};
	},
};

const clientReferenceMetadataManifest: ClientReferenceMetadataManifest = {
	resolveClientReferenceMetadata(metadata) {
		// console.log("[debug:resolveClientReferenceMetadata]", { metadata }, Object.getOwnPropertyDescriptors(metadata));
		return metadata.$$id;
	},
};
