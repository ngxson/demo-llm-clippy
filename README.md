# wllama clippy demo

How to add wllama into your frontend project (Example here: `vite` + `react` + `typescript`)

## Install wllama

As simple as:

```sh
npm i @wllama/wllama
```

## (Optional) Configure headers to enable multithread support

> [!IMPORTANT]  
> In case you use `nginx`, `apache` or something else on your server, you may need to follow another method. These headers are required:
> - `Cross-Origin-Opener-Policy: same-origin`
> - `Cross-Origin-Embedder-Policy: require-corp`

Because we're using vite dev server, we need to add this plugin to `vite.config.ts`:

```js
  plugins: [
    react(),
    {
      name: 'isolation',
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
          next();
        });
      },
    },
  ],
```

## Initialize wllama

Add to global scope:

```ts
import { Wllama } from '@wllama/wllama';
import wllamaSingle from '@wllama/wllama/src/single-thread/wllama.wasm?url';
import wllamaMulti from '@wllama/wllama/src/multi-thread/wllama.wasm?url';

const wllama = new Wllama({
  'single-thread/wllama.wasm': wllamaSingle,
  'multi-thread/wllama.wasm': wllamaMulti,
});

// let's use llama 3.2 1B model
const HF_REPO = 'bartowski/Llama-3.2-1B-Instruct-GGUF';
const HF_FILE = 'Llama-3.2-1B-Instruct-IQ3_M.gguf';
```

Then, in the main component, check if the model is loaded. If not, load it:

```ts
  useEffect(() => {
    if (!wllama.isModelLoaded()) {
      wllama.loadModelFromHF(HF_REPO, HF_FILE, {
        n_ctx: 2048,
      }).then(() => {
        setReady(true);
        setResponse('How can I help you?');
      });
    }
  }, []);
```

## Implement the inference function

Whenever user send a new message, run the inference and stream the result in real-time:

```ts
  const onSubmit = async (text: string) => {
    setReady(false);
    setResponse('Thinking...');
    await wllama.createChatCompletion([
      { role: 'system', content: 'You are Clippy, the Office Assistant was an intelligent user interface for Windows 98. Acts like the time is 1998 and you are on an old computer. Answer with short, concise responses.' },
      { role: 'user', content: text },
    ], {
      onNewToken(token, piece, currentText) {
        setResponse(currentText);
      },
    });
    setReady(true);
  };
```
