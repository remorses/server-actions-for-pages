import { Spiceflow } from "spiceflow";
import { Suspense } from "react";
import { IndexPage } from "./app/index";
import { Layout } from "./app/layout";
import "./styles.css";
import { ClientComponentThrows } from "./app/client";

const app = new Spiceflow()
	.layout("/*", async ({ children, request }) => {
		return (
			<Layout>
				<Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
			</Layout>
		);
	})
	.page("/", async ({ request }) => {
		const url = new URL(request.url);
		return <IndexPage />;
	})

	.get("/hello", () => "Hello, World!")
	.page("/redirect", async () => {
		throw new Response("Redirect", {
			status: 302,
			headers: {
				location: "/",
			},
		});
	})
	.layout("/page/*", async ({ request, children }) => {
		return (
			<div className="">
				<h1>/page layout 1</h1>
				{children}
			</div>
		);
	})
	.layout("/page/*", async ({ request, children }) => {
		return (
			<div className="">
				<h1>/page layout 2</h1>
				{children}
			</div>
		);
	})
	.page("/page", async ({ request }) => {
		const url = new URL(request.url);
		return (
			<div>
				<a href="/page/1">/page/1</a>
				<IndexPage />
			</div>
		);
	})
	.page("/page/1", async ({ request }) => {
		const url = new URL(request.url);
		return (
			<div>
				<a href="/page">/page</a>
				<IndexPage />
			</div>
		);
	})
	.page("/:id", async ({ request, params }) => {
		const url = new URL(request.url);
		return (
			<div className="">
				<h1>:id page</h1>
				<IndexPage />
			</div>
		);
	})
	.page("/loader-error", async () => {
		throw new Error("test error");
	})
	.page("/rsc-error", async () => {
		return <ServerComponentThrows />;
	})
	.page("/client-error", async () => {
		return <ClientComponentThrows />;
	})
	.page("/redirect-in-rsc", async () => {
		return <Redirects />;
	})
	.post("/echo", async ({ request }) => {
		const body = await request.json();
		return { echo: body };
	});

async function Redirects() {
	throw new Response("Redirect", {
		status: 302,
		headers: {
			location: "/",
		},
	});
	return <div>Redirect</div>;
}

function ServerComponentThrows() {
	throw new Error("Server component error");
	return <div>Server component</div>;
}

export default app;
