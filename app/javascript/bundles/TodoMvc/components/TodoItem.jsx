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

  // constructor(props) {
  //   super(props);
  //   this.editingInput = React.createRef();
  //   this.focus = this.focus.bind(this);
  // }

  // focus() {
  //   // this.editingInput.current.focus();
  // }

  componentDidUpdate(prevProps) {
    if(!prevProps.show && this.props.show){
       // We transitioned from hidden to shown. Focus the text box.
       this.refs.myInput.getDOMNode().focus();
    }
  }

  toggleEdit = (e) => {
    var target = e.target;
    setTimeout(() => {
      target.parentElement.nextElementSibling.focus();
      // this.refs.editField.focus();
    }, 0);
    // target.parentElement.nextElementSibling.focus();
    // $(target).parent().siblings().focus();
    // console.log($(target).parent().siblings());
    this.props.onEdit(this.props.todo);
    this.setState({editingText: this.props.todo.task});
  }

  handelSubmit = (e) => {
    e.preventDefault();
  }

  handleChange = (e) => {
    if (this.props.editing) {
      const target = e.target;
      // target.focus();
      this.setState({editingText: target.value});
    }
  }

  handleUpdate = (e) => {
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
    var todo = this.props.todo;
    todo.completed = !todo.completed;
    Utils.put('/todos/' + todo.id, todo)
      .then(response => {
        this.props.onToggle(todo);
      })
      .catch(error => this.props.onError(error));
  }

  deleteTask = (e) => {
    var todo = this.props.todo;
    Utils.delete('/todos/' + todo.id)
      .then(response => {
        this.props.onDestroy(todo);
      })
      .catch(error => this.props.onError(error));
  }

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
            // tabIndex="-1"
            // ref={this.editingInput}
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
