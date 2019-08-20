# frozen_string_literal: true

require 'test_helper'

module Quilt
  class UiControllerTest < ActionController::TestCase
    setup do
      @routes = Quilt::Engine.routes
    end
end
