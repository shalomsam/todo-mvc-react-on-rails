import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TodoItem from './TodoItem';

export default class TodoMvc extends React.Component {
  static propTypes = {
    todos: PropTypes.arrayOf(PropTypes.shape(
        {task: PropTypes.string, completed: PropTypes.bool}
      )),
  }

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

  submitHandler = (e) => {
    e.preventDefault();
  }

  handleEditing = (todo) => {
    this.setState({editingTask: todo.task, editing: todo.id});
  }

  handleSave = (e) => {
    this.setState({editing: null});
  }

  handleCancel = (e) => {
    this.setState({editing: null});
  }

  //
  makeEditable = (e, item) => {
    console.log(e);
    this.setState({editing: item.id, editingTask: item.task});
  }

  filterClick = (e, filter) => {
    this.setState({todosFilter: filter});
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

    listItems = listItems.map((todo) => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={this.handleEditing.bind(this, todo)}
          editing={this.state.editing === todo.id}
          onSave={this.handleSave.bind(this, todo)}
          onCancel={this.handleCancel}
        />
      );
    });

    var list = (
      <section className="main">
        <ul className="todo-list">
          {listItems}
        </ul>
      </section>
    );

    var itemsLeft = this.props.todos.filter(item => !item.completed).length;

    var filters = Object.keys(this.FILTERS);
    filters = filters.map((item,i) => {
      var filter = this.FILTERS[item];
      return (
        <li key={i}>
          <a
            href="#"
            className={classNames({selected: this.state.todosFilter === filter})}
            onClick={(e) => this.filterClick(e, filter)}
          >
            {filter}
          </a>
        </li>
      );
    });

    var footer = (
      <footer className="footer">
        <span className="todo-count">
          <strong>{itemsLeft}</strong>
          <span> </span>
          <span>item{itemsLeft > 1 ? 's' : ''}</span>
          <span> left</span>
        </span>
        <ul className="filters">
          {filters}
        </ul>
      </footer>
    );

    return (
      <div>
        {header}
        {list}
        {footer}
      </div>
    )
  }
}
