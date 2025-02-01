import { useEffect, useState } from 'react';
import './App.scss';
import { Clippy } from './components/Clippy';
import Dialog from './components/Dialog';

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

function App() {
  const [ready, setReady] = useState(false);
  const [response, setResponse] = useState('Loading...');

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

  return (
    <div className='main'>
      <div className='popup'>
        {response}
      </div>
      <Clippy anim='CheckingSomething' />
      <Dialog onSubmit={onSubmit} disabled={!ready} />
    </div>
  )
}

export default App;
