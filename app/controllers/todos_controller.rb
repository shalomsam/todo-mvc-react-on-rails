class TodosController < ApplicationController
  layout "todo_mvc"
  skip_before_action :verify_authenticity_token
  before_action :set_todo, only: [:edit, :update, :destroy]

  # GET /todos
  # GET /todos.json
  def index
    @todos = Todo.all
    # @todos = nil if @todos.empty?
    @todos = @todos.as_json
    @list = { todos: @todos }
  end

  # POST /todos
  # POST /todos.json
  def create
    @todo = Todo.new(todo_params)

    respond_to do |format|
      if @todo.save
        # format.html { redirect_to root_url, notice: 'Todo was successfully created.' }
        format.json { render json: {status: 'success', todo: @todo}, status: :created, location: @root_url }
      else
        # format.html { render :index }
        format.json { render json: @todo.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /todos
  def massUpdate
    @todos = Todo.all
    respond_to do |format|
      params.permit(:update);
      @todos.update_all(update_params);
      format.json { render json: {status: 'success', todos: @todo.as_json}, status: :ok }
    end
  end

  # PATCH/PUT /todos/1
  # PATCH/PUT /todos/1.json
  def update
    respond_to do |format|
      if @todo.update(todo_params)
        format.json { render json: {status: 'success'}, status: :ok, location: @root_url }
      else
        format.json { render json: @todo.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /todos/1
  # DELETE /todos/1.json
  def destroy
    @todo.destroy
    respond_to do |format|
      format.json { render json: {status: 'success'}, status: :ok, location: @root_url }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_todo
      @todo = Todo.find(params[:id])
    end

    def update_params
      # params.permit(:update, :completed);
      update = params[:update].permit!;
      return update.as_json;
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def todo_params
      # params.require(:todo).permit(:task, :completed)
      task = params.require(:task);
      complete = params[:completed] || false;
      return { task: task, completed: complete };
    end
end
