require 'sinatra/base'
require 'sinatra/reloader'

class InterDependency < Sinatra::Base
  get '/' do
    File.read(File.join('public', 'index.html'))
  end
end
