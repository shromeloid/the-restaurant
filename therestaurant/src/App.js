import './App.css';
import { Restaurant } from './components/restaurant';
import {Home} from './components/home'

function App() {
  return (
    <div className="App">
      <Home/>
        <Restaurant />
    </div>
  );
}

export default App;
