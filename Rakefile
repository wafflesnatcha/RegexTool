require "rake"
require "compass"

CONFIG = {
	'root'            => File.dirname(__FILE__),
	'compass_project' => 'assets/scss',
	'index_file'      => 'index.html',
	'manifest_file'   => 'cache.manifest',
	'offline_file'    => 'offline.html',
}

task :default do
	exec "rake -sT"
end

desc "Switch to the production environment"
task :production => ["compass:clean", "compass:production", "optipng", "manifest:update", "manifest:add"]

desc "Switch to the development environment"
task :development => ["compass:clean", "compass:development", "manifest:remove"]

desc "Optimize PNG images"
task :optipng do
	if dir = compassConfig('images_dir') then
		path = File.expand_path(dir, File.join(CONFIG['root'], CONFIG['compass_project']))
		system("find '#{path}' -type f -name '*.png' | xargs optipng -quiet -preserve")
	end
end

def htmlManifest(add)
	path = File.join(CONFIG['root'], CONFIG['index_file'])
	text = File.read(path)
	text.sub!(/(<html.*?)\s*(manifest\=(["'])([^\3]*?)(\3))(>)/i, '\1\6')
	text.sub!(/(<html[^>]*?)\s*(>)/i, '\1 manifest="' + CONFIG['manifest_file'] + '"\2') if (add)
	f = File.open(path, "w")
	f.write(text)
	f.close()
end

namespace :manifest do

	desc "Add the 'manifest' attribute to the opening <html> tag in '#{CONFIG['index_file']}'"
	task :add do
		htmlManifest(true)
	end

	desc "Remove the 'manifest' attribute to the opening <html> tag in '#{CONFIG['index_file']}'"
	task :remove do
		htmlManifest(false)
	end

	desc "Update the application cache manifest '#{CONFIG['manifest_file']}'"
	task :update do
		def scan_html(filename, root_dir)
			files = []
			text = File.read(File.join(root_dir, filename))
			match = text.scan(/<(?:script [^>]*?src|link [^>]*?href)=["']((?!["']).+?)["'][^>]*\/?>/i) { |m|
				files.push(m[0])
				if (m[0].match(/^(?!http).*.css$/i))
					files += scan_css(m[0], root_dir)
				end
			}
			return files
		end

		def scan_css(filename, root_dir)
			files = []
			path = File.expand_path(filename, root_dir)
			text = File.read(path)
			match = text.scan(/url\(['"]?([^\)]+?)['"]?\)/i) { |m|
				name = File.expand_path(File.join(File.dirname(path), m[0]), root_dir)
				files.push(name.sub(File.expand_path(root_dir) + "/", ""))
			}
			return files
		end

		puts "Updating cache.manifest..."
		resources = scan_html(CONFIG['index_file'], CONFIG['root'])
		f = File.open(File.join(CONFIG['root'], CONFIG['manifest_file']), "w")
		f.write("CACHE MANIFEST\n# #{`date "+%Y-%m-%d %H:%M:%S"`.chomp}\n\nCACHE:\n#{resources.uniq.sort.join("\n")}\n\nFALLBACK:\n#{CONFIG['offline_file']}\n\nNETWORK:\n*")
		f.close()
	end

end

def compassConfig(param)
	Compass.configuration_for(File.join(CONFIG['root'], CONFIG['compass_project'], 'config.rb')).instance_variable_get('@' + param)
end

namespace :compass do

	desc "Remove generated files and the sass cache"
	task :clean do
		Dir.chdir(File.join(CONFIG['root'], CONFIG['compass_project']))
		system "compass clean"
	end

	desc "Compass compile with '--environment development'"
	task :development do
		Dir.chdir(File.join(CONFIG['root'], CONFIG['compass_project']))
		system "compass compile --environment development"
	end

	desc "Compass compile with '--environment production --force'"
	task :production do
		Dir.chdir(File.join(CONFIG['root'], CONFIG['compass_project']))
		system "compass compile --environment production --force"
	end

	desc "Watch the compass project for changes and recompile when they occur"
	task :watch do
		Dir.chdir(File.join(CONFIG['root'], CONFIG['compass_project']))
		exec "compass watch --environment development"
	end

end