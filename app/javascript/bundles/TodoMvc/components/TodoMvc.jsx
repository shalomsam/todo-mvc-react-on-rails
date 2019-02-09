import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TodoItem from './TodoItem';
import Utils from '../Utils';

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

  /**
   * Constructor
   *
   * @param {object} props - Comes from your rails view.
   */
  constructor(props) {
    super(props);
    this.state.todos = props.todos;
  }

  /**
   * Global Error handling method.
   *
   * @param {object} error - The error object.
   */
  handleError = (error) => {
    console.log("error => ", error);
    var errorEl = `
      <div className="alert">
        ${error.message || "an error occurred"}
      </div>
    `;

    this.refs.errors.style.color = 'red';
    this.refs.errors.innerHTML = errorEl;
  }

  /**
   * The method to toggle all TodoItem to completed or active.
   *
   * @param {object} e - The event object.
   */
  toggleAll = (e) => {
    var checked = e.target.checked;
    var todos = this.state.todos.map(function (todo) {
			return Object.assign({}, todo, {completed: checked});
		});

    Utils.put('/todos', {update: {completed: checked}})
      .then(response => {
        if (response.status === 'success') {
          this.setState({todos: todos});
        }
      })
      .catch(error => this.handleError(error))
  }

  /**
   * Method to handle toggling Todo as completed or active
   *
   * @param {TodoItem} todo - The todo object.
   */
  handleToggle = (todo) => {
    var todos = this.state.todos.map((item) => {
      return todo === item ? Object.assign({}, item, {completed: item.completed}) : item;
    });
    this.setState({todos: todos});
  }

  /**
   * Method to set state to enable editing.
   *
   * @param {TodoItem} todo - The todo object.
   */
  handleEditing = (todo) => {
    this.setState({editingTask: todo.task, editing: todo.id});
  }

  /**
   * Method to reset state to stop editing.
   */
  handleSave = () => {
    this.setState({editing: null, editingTask: ''});
  }

  /**
   * Method to reset state to stop editing.
   */
  handleCancel = () => {
    this.setState({editing: null, editingTask: ''});
  }

  /**
   * Method to handle deletion of TodoItem from the todos array.
   *
   * @param {TodoItem} todo - The todo object.
   */
  handleDelete = (todo) => {
    var todos = this.state.todos.filter((item) => {
      return todo !== item;
    });
    this.setState({todos: todos});
  }

  /**
   * Method to set state for filtering todos based on status.
   *
   * @param {string} filter - The filter type.
   */
  filterClick = (e, filter) => {
    this.setState({todosFilter: filter});
  }

  /**
   * Method to handle addition of TodoItem to todos array.
   *
   * @param {object} e - The key down event object.
   */
  handleAddTodo = (e) => {
    var target = e.target;
    if (e.keyCode === 13) {
      var todo = {task: target.value};
      var todos = this.state.todos;
      Utils.post('/todos', todo)
        .then(response => {
          todos.push(response.todo);
          this.setState({todos: todos});
          target.value = "";
        })
        .catch(error => this.handleError(error));
    }
  }

  render() {
    var header = (
      <header className="header">
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={this.handleAddTodo}
          autoFocus={true}
        />
      </header>
    );
    var listItems = this.state.todos || [];
    var itemsLeft = this.state.todos.filter(item => !item.completed).length;

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
          onToggle={this.handleToggle.bind(this, todo)}
          onEdit={this.handleEditing.bind(this, todo)}
          editing={this.state.editing === todo.id}
          onSave={this.handleSave}
          onCancel={this.handleCancel}
          onDestroy={this.handleDelete.bind(this, todo)}
          onError={this.handleError}
        />
      );
    });

    var list = (
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={this.toggleAll}
          checked={itemsLeft === 0}
        />
        <label
          htmlFor="toggle-all"
        />
        <ul className="todo-list">
          {listItems}
        </ul>
      </section>
    );

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
        <div>
          {header}
          {list}
          {footer}
        </div>
        <div ref="errors"></div>
      </div>
    )
  }
}
