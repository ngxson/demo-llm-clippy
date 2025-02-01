import { useState } from 'react';
import './App.scss';
import { Clippy } from './components/Clippy';
import Dialog from './components/Dialog';
function App() {
  // @ts-ignore
  const [ready, setReady] = useState(true);
  const [response, setResponse] = useState('Loading...');

  const onSubmit = async (text: string) => {
    setResponse('Thinking...');
    setResponse(text);
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
