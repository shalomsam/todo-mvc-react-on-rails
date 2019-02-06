import React from 'react';
import PropTypes from 'prop-types';

export default class TodoMvc extends React.Component {
  static propTypes = {
    todos: PropTypes.arrayOf(PropTypes.shape(
        {task: PropTypes.string, completed: PropTypes.bool}
      )),
  }

  STATUSES = {
    ACTIVE: 'active',
    DONE: 'completed'
  };

  FILTERS = {
    ALL: 'all',
    ACTIVE: 'active',
    DONE: 'completed'
  };

  state = {
    todosFilter: this.FILTERS.ALL,
    editing: null,
    editingTask: ''
  }

  handleKeyDown = (e, item) => {
    console.log(e.keyCode);
    const target = e.target;
    if (e.keyCode === 13) {
      e.preventDefault();
      this.updateHandler(e, item);
    } else if (e.keyCode === 27) {
      e.preventDefault();
      target.value = item.task;
      this.setState({editing: null, editingTask: item.task});
    }
  }

  updateHandler = (e, item) => {
    const target = e.target;
    const value = target.value.trim();
    if (value && value !== item.task) {
      item.task = value;
      target.form.task.value = value;
      target.form._method.value = 'put';
      this.setState({editingTask: value, editing: null});
      target.form.submit();
    } else if (value === "") {
      this.deleteItem(e);
    }
  }

  submitHandler = (e) => {
    e.preventDefault();
  }

  handleEditing = (e) => {
    const target = e.target;
    target.focus();
    this.setState({editingTask: target.value});
  }

  makeEditable = (e, item) => {
    console.log(e);
    this.setState({editing: item.id, editingTask: item.task});
  }

  completeTask = (e) => {
    window.target = e.target;
    target.form.elements.namedItem('_method').value = 'put';
    target.value = target.checked ? true : false;
    target.form.submit();
  }

  deleteItem = (e) => {
    e.preventDefault();
    var target = e.target;
    target.form.elements.namedItem('_method').value = "delete";
    target.form.submit();
  }

  render() {
    var header = (
      <header className="header">
        <form method="POST" action="/todos">
          <input
            name="task"
            className="new-todo"
            placeholder="What needs to be done?"
          />
          <button type="submit"></button>
        </form>

      </header>
    );

    var listItems = this.props.todos || [];

    listItems = listItems.filter((item) => {
      switch (this.state.todosFilter) {
        case this.FILTERS.ACTIVE:
          return !item.completed;

        case this.FILTERS.DONE:
          return item.completed;

        default:
          return true;
      }
    });

    listItems = listItems.map((item) => {
      var liClass = "";
      if (this.state.editing === item.id) {
        liClass = "editing";
      }
      if (item.completed) {
        liClass += " completed"
      }
      return (
        <li className={liClass} key={item.id}>
          <form onSubmit={this.submitHandler} method="POST" action={"/todos/" + item.id}>
            <div className="view">
                <input type="hidden" name="_method" value="" />
                <input type="hidden" name="task" value={item.task} />
                <input type="checkbox" name="completed" className="toggle" onChange={this.completeTask} checked={item.completed} />
                <label onClick={(e) => this.makeEditable(e, item)}>{item.task}</label>
                <button type="button" onClick={this.deleteItem} className="destroy"></button>
            </div>
            <input
              className="edit"
              value={this.state.editingTask}
              onChange={this.handleEditing}
              onBlur={(e) => this.updateHandler(e, item)}
              onKeyDown={(e) => this.handleKeyDown(e, item)}
            />
          </form>
        </li>
      )
    });

    var list = (
      <section className="main">
        <ul className="todo-list">
          {listItems}
        </ul>
      </section>
    );

    return (
      <div>
        {header}
        {list}
      </div>
    )
  }
}
