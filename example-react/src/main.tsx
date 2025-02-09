import { Spiceflow } from "spiceflow";
import { IndexPage } from "./app/index";
import { Layout } from "./app/layout";

const app = new Spiceflow()
	.page("/", async ({ request }) => {
		const url = new URL(request.url);
		return (
			<Layout>
				<IndexPage url={url} />
			</Layout>
		);
	})
	.page("/:id", async ({ request, params }) => {
		const url = new URL(request.url);
		return (
			<Layout>
				<IndexPage url={url} />
			</Layout>
		);
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
}

export default app;
