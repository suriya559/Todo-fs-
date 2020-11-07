
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Login from './components/login/login';
import Todo from './components/todo/todo';

function App() {
  return (
    <div>
      <Router>
      <Switch>
        <Route exact path="/" render={() => <Login />} />
        <Route exact path="/todo" render={() => <Todo />} />
      </Switch>
      </Router>
    </div>
  );
}

export default App;
