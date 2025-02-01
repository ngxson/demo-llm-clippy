import { useState } from "react";

export default function Dialog({ onSubmit, disabled }: { onSubmit(text: string): void, disabled: boolean }) {
  const [text, setText] = useState('');

  return (
    <div className="window" style={{ width: '20em', marginTop: '2em' }}>
      <div className="title-bar">
        <div className="title-bar-text">Your message</div>
      </div>
      <div className="window-body">
        <div className="field-row-stacked" style={{ marginBottom: '1em' }}>
          <label htmlFor="text20">Message</label>
          <textarea id="text20" rows={3} value={text} onChange={e => setText(e.target.value)} disabled={disabled}></textarea>
        </div>
        <button onClick={() => {
          onSubmit(text);
          setText('');
        }} disabled={disabled}>Submit</button>
      </div>
    </div>
  );
}
