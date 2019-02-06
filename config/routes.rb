Rails.application.routes.draw do
  resources :todos
  get 'hello_world', to: 'hello_world#index'

  root 'todos#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
