import '@fontsource/roboto';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './ChatRoom/Home';
import Login from './Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/login" >
            <Login />
          </Route>
          <Route exact path="/" >
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
