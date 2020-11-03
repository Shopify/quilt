# frozen_string_literal: true

module Quilt
  class UiController < ApplicationController
    include Quilt::ReactRenderable
    layout(false)

    def index
      render_react
    rescue Quilt::ReactRenderable::ReactServerNoResponseError
      sleep(1)
      retry if execution_count < 10
      raise
    end

    def execution_count
      @times ||= 0
      @times = @times.next
    end
  end
end
