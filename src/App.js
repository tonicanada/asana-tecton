import React, { Component } from "react";
import asana from "asana";
import "./App.css";
import TaskList from "./components/TaskList/TaskList.component";


const client = asana.Client.create().useAccessToken(
  "0/de3066f1832547c89a2117b5516bcc9c"
);

class App extends Component {
  constructor() {
    super();

    this.state = {
      employee: []
    };
  }

  componentDidMount() {
    client.users
      .me()
      .then(user =>
        client.users.findAll({
          workspace: user.workspaces[1].gid
        })
      )
      .then(users =>
        this.setState({
          employee: users.data.filter(
            user =>
              user.name !== "Luis Izquierdo" &&
              user.name !== "Héctor Riquelme" &&
              user.name !== "mquinteros" &&
              user.name !== "pedro"
          )
        })
      );
  }

  render() {
    return (
      <div>
        <h1>Tareas en curso oficina central</h1>
        {this.state.employee.map(employee => (
          <div key={employee.gid}>
            <h2>{employee.name}</h2>
            <TaskList gid={employee.gid}></TaskList>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
