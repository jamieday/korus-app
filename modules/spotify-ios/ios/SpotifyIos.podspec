require 'json'

package = JSON.parse(File.read(File.join(__dir__, '../modules/spotify-ios/package.json')))

Pod::Spec.new do |s|
  s.name         = "SpotifyIos"
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']
  s.homepage     = package['homepage']
  s.platform     = :ios, "13.0"
  s.author       = package['author']
  s.source       = { :git => package['repository']['url'], :tag => "#{s.version}" }
  s.source_files = "ios/**/*.{h,m,swift}"
  s.dependency "ExpoModulesCore"
  s.dependency "SpotifyiOS", "~> 1.2.3"
end 