# frozen_string_literal: true

Quilt::Engine.routes.draw do
  get '/*path', to: 'ui#index'
  root 'ui#index'
end
