# frozen_string_literal: true

module Quilt
  module Performance
    module Reportable
      def process_report(&block)
        params.transform_keys! { |key| key.underscore.to_sym }
        Client.send!(Report.from_params(params), &block)
      end
    end
  end
end
