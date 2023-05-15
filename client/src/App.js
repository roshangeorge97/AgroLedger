import './App.css';
import AssignRoles from './AssignRoles';
import Home from './Home';
import AddMed from './AddMed';
import Supply from './Supply'
import Track from './Track'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Dashboard from './Dashboard';
import HomePage from './HomePage';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/home" exact component={Home} />
          <Route path="/roles" component={AssignRoles} />
          <Route path="/add" component={AddMed} />
          <Route path="/supply" component={Supply} />
          <Route path="/track" component={Track} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/" component={HomePage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
