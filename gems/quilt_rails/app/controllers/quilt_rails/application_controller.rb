module QuiltRails
  class ReactController < ApplicationController
    include Quilt::ReactRenderable

    def index
      render_react
    end
  end
end
