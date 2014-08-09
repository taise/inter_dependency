require 'sinatra'
require 'sinatra/reloader'

get '/' do
  File.read(File.join('public', 'index.html'))
end
