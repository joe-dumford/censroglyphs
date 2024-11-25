import './App.css';
import './text.transformer';
import TextTransformer from './text.transformer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Transform your captions into censor-guarded text.
        </p>
      <TextTransformer />
      </header>
    </div>
  );
}

export default App;
