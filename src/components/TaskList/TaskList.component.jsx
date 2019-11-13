import React, { Component } from "react";
import asana from "asana";

const client = asana.Client.create().useAccessToken(
  process.env.REACT_APP_ASANA_API_KEY
);

class TaskList extends Component {
  constructor() {
    super();

    this.state = {
      tasks: []
    };
  }

  componentDidMount() {
    client.users
      .me()
      .then(user => {
        // The user's "default" workspace is the first one in the list, though
        // any user can have multiple workspaces so you can't always assume this
        // is the one you want to work with.
        const workspaceId = user.workspaces[1].gid;
        return client.tasks.findAll({
          assignee: this.props.gid,
          workspace: workspaceId,
          completed_since: "now",
          opt_fields: "id,name,assignee_status,completed"
        });
      })
      .then(response => {
        // There may be more pages of data, we could stream or return a promise
        // to request those here - for now, let's just return the first page
        // of items.
        this.setState({ tasks: response.data });
      })
      // .filter(task => {
      //   return task.assignee_status === 'today' ||
      //     task.assignee_status === 'new';
      // })
      //   .then(list => {
      //     console.log(
      //       util.inspect(list, {
      //         colors: true,
      //         depth: null
      //       })
      //     );
      //   })
      .catch(e => {
        console.log(e);
      });
  }
  render() {
    return (
      <div>
        {this.state.tasks.length > 0 ?
            this.state.tasks.map(task => (
          <li key={task.gid}>{task.name}</li>
        )): <p>No hay tareas incompletas para mostrar...</p>}
      </div>
    );
  }
}

export default TaskList;
