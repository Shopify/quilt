# frozen_string_literal: true

Quilt::Engine.routes.draw do
  get '/*path', to: 'react#index'
  root 'react#index'
end
