QuiltRails::Engine.routes.draw do
  get '/*path', to: 'react#index'
  root 'react#index'
end
