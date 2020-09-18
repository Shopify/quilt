# frozen_string_literal: true

module Quilt
  module Performance
    module Reportable
      def process_report(&block)
        Client.send!(Report.from_params(normalized_params), &block)
      end

      private

      def normalized_params
        return params unless request.content_type == 'text/plain'

        ActionController::Parameters.new(JSON.parse(request.body.read))
      end
    end
  end
end
