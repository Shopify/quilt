# frozen_string_literal: true
require 'rails'

# The default ActiveSupport::Reloader memoizes `@should_reload` for the
# lifetime of each request. This is a problem for quilt_rails apps because:
# - QuiltRails::ReactRenderable#render holds an exclusive lock until the Node
#   server returns a result
# - Any controller calls during Node rendering (e.g., GraphQL fetches) will
#   hang if they try to obtain a lock
# - Class unloading needs a lock, and so nested controller calls risk
#   deadlocking whenever @should_reload is true
#
# Forcing `@should_reload` evaluation at the start of each thread prevents
# nested controller calls from attempting class unloading.  This eliminates
# one source of lock contention.
#
# The affected flow is:
# - A developer saves a change to a Ruby file
# - The developer refreshes their browser
#
# Rails processes the request:
# - Thread0 - ActiveSupport::Reloader is called by middleware
# - Thread0 - An exclusive class unloader lock is obtained, classes are
#             unloaded, and the lock is released
# - Thread0 - `Quilt::ReactRenderable#render_react` calls `reverse_proxy`,
#             which grabs a general exclusive lock
# - Node    - starts rendering, and calls out to a Rails controller for data
# - Thread1 - ActiveSupport::Reloader is called by the second controller's
#             middleware
# - Thread1 - `@should_reload` is still true, so an attempt is made to grab an
#              exclusive class unloader lock
# - Thread1 - waits for Thread0 to release its lock; Thread0 never unlocks
#             because it needs Thread1's result
#
module ActiveSupport
  class Reloader
    def self.check! # :nodoc:
      @should_reload = check.call
    end
  end
end
