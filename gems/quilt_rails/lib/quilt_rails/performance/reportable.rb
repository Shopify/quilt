# frozen_string_literal: true

module Quilt
  module Performance
    module Reportable
      def process_report(&block)
        report_params = if request.content_type == 'text/plain'
          ActionController::Parameters.new(JSON.parse(request.body.read))
        else
          params
        end
        Client.send!(Report.from_params(report_params), &block)
      end
    end
  end
end
