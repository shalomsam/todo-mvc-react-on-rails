import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Utils from '../Utils';

const todoShape = {id: PropTypes.number, task: PropTypes.string, completed: PropTypes.bool};

export default class TodoItem extends React.Component {
  static propTypes = {
    todo: PropTypes.shape(todoShape),
    editing: PropTypes.bool,
    onEdit: PropTypes.func,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
  }

  state = {editingText: this.props.todo.task}

  /**
   * Method to handle toggle to editable state for TodoItem.
   *
   * @param {object} e - The toggle event.
   */
  toggleEdit = (e) => {
    var target = e.target;
    setTimeout(() => {
      target.parentElement.nextElementSibling.focus();
    }, 0);
    this.props.onEdit(this.props.todo);
    this.setState({editingText: this.props.todo.task});
  }

  /**
   * Method to handle change on editable Input element.
   *
   * @param {object} e - The key down event object.
   */
  handleChange = (e) => {
    if (this.props.editing) {
      const target = e.target;
      this.setState({editingText: target.value});
    }
  }

  /**
   * Method to handle update of TodoItem.
   */
  handleUpdate = () => {
    const task = this.state.editingText.trim();
    const todo = this.props.todo;
    if (task) {
      this.setState({editingText: task});
      todo.task = task;
      Utils.put('/todos/' + todo.id, todo)
        .then(response => {
          this.props.onSave(todo)
        })
        .catch(error => this.props.onError(error));
    } else if (task === "") {
      this.deleteTask();
    }
  }

  /**
   * Method to handle Keydown event for editable Input.
   *
   * @param {object} e - The keydown event object.
   */
  handleKeyDown = (e) => {
    const target = e.target;
    const todo = this.props.todo;
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleUpdate(e);
    } else if (e.keyCode === 27) {
      e.preventDefault();
      target.value = todo.task;
      this.setState({editingText: todo.task});
      this.props.onCancel(e);
    }
  }

  /**
   * Method to handle completion toggle on TodoItem
   *
   * @param {object} e - The onchange event object.
   */
  completeTask = (e) => {
    const todo = this.props.todo;
    todo.completed = !todo.completed;
    Utils.put('/todos/' + todo.id, todo)
      .then(response => {
        this.props.onToggle(todo);
      })
      .catch(error => this.props.onError(error));
  }

  /**
   * Method the handle deletion of TodoItem.
   */
  deleteTask = () => {
    var todo = this.props.todo;
    Utils.delete('/todos/' + todo.id)
      .then(response => {
        this.props.onDestroy(todo);
      })
      .catch(error => this.props.onError(error));
  }

  /**
   * React Render.
   */
  render() {
    var item = this.props.todo;
    var liClass = {editing: this.props.editing, completed: item.completed}

    return (
      <li className={classNames(liClass)}>
          <div className="view">
              <input type="checkbox" className="toggle" onChange={this.completeTask} checked={item.completed} />
              <label onDoubleClick={this.toggleEdit} >{item.task}</label>
              <button type="button" onClick={this.deleteTask} className="destroy"></button>
          </div>
          <input
            ref="myInput"
            className="edit"
            value={this.state.editingText}
            onBlur={this.handleUpdate}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
      </li>
    );
  }
}
