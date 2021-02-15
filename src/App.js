import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/Home/index";
import { StateProvider } from "./store/store";

function App() {
  return (
    <div className="App">
      <StateProvider>
        <Home />
      </StateProvider>
    </div>
  );
}

export default App;
