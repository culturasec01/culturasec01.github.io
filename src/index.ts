export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// Usa o binding ASSETS para servir arquivos estáticos
		const asset = await env.ASSETS.fetch(request);

		// Se encontrou o arquivo, retorna
		if (asset.status !== 404) {
			return asset;
		}

		// Se não encontrou e é uma rota, tenta servir index.html
		const url = new URL(request.url);
		if (!url.pathname.includes('.')) {
			return env.ASSETS.fetch(new Request(new URL('/index.html', url), request));
		}

		return asset;
	},
} satisfies ExportedHandler<Env>;

interface Env {
	ASSETS: any;
	[key: string]: unknown;
}
