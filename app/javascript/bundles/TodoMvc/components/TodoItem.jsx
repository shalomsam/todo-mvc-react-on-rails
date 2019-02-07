import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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

  handleEdit = (e) => {
    this.props.onEdit(e, this.props.todo);
    this.setState({editingText: this.props.todo.task});
  }

  handelSubmit = (e) => {
    e.preventDefault();
  }

  handleChange = (e) => {
    if (this.props.editing) {
      const target = e.target;
      target.focus();
      this.setState({editingText: target.value});
    }
  }

  handleUpdate = (e) => {
    const target = e.target;
    const value = this.state.editingText.trim();
    const todo = this.props.todo;
    if (value && value !== todo.task) {
      this.props.onSave(value)
      this.setState({editingText: value});
      todo.task = value;
      target.form.task.value = value;
      target.form._method.value = 'put';
      target.form.submit();
    } else if (value === "") {
      this.props.onDestroy(e);
    }
  }

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

  completeTask = (e) => {
    const target = e.target;
    target.form.elements.namedItem('_method').value = 'put';
    target.value = target.checked ? true : false;
    target.form.submit();
  }

  deleteTask = (e) => {
    e.preventDefault();
    var target = e.target;
    target.form.elements.namedItem('_method').value = "delete";
    target.form.submit();
  }

  render() {
    var item = this.props.todo;
    var liClass = {editing: this.props.editing, completed: item.completed}

    return (
      <li className={classNames(liClass)}>
        <form onSubmit={this.handelSubmit} method="POST" action={"/todos/" + item.id}>
          <div className="view">
              <input type="hidden" name="_method" value="" />
              <input type="hidden" name="task" value={item.task} />
              <input type="checkbox" name="completed" className="toggle" onChange={this.completeTask} checked={item.completed} />
              <label onClick={this.handleEdit}>{item.task}</label>
              <button type="button" onClick={this.deleteTask} className="destroy"></button>
          </div>
          <input
            className="edit"
            value={this.state.editingText}
            onBlur={this.handleUpdate}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
        </form>
      </li>
    );
  }
}
