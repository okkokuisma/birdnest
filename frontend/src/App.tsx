import './App.css';
import PilotList from './components/PilotList';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="App">
      <h1>Naughty pilots in the NDZ</h1>
      <PilotList/>
      <Footer />
    </div>
  );
};

export default App;
