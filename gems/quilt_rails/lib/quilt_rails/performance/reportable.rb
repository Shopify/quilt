# frozen_string_literal: true

module Quilt
  module Performance
    module Reportable
      def process_report(&block)
        if request.content_type == 'text/plain'
          self.params = ActionController::Parameters.new(JSON.parse(request.body.read))
        end
        Client.send!(Report.from_params(params), &block)
      end
    end
  end
end
