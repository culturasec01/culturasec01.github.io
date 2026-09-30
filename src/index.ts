export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// Redireciona para artigos.pages.dev
		url.hostname = 'artigos.pages.dev';

		return fetch(new Request(url, request));
	},
} satisfies ExportedHandler<Env>;

interface Env {
	[key: string]: unknown;
}
