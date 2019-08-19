# frozen_string_literal: true

module Quilt
  class UiController < ApplicationController
    include Quilt::ReactRenderable

    def index
      render_react
    end
  end
end
