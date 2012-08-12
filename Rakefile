CONFIG = {
	'root'            => File.dirname(__FILE__),
	'compass_project' => 'assets/scss',
	'images_dir'      => 'assets/img',
	'index_file'      => 'index.html',
	'manifest_file'   => 'cache.manifest',
	'offline_file'    => 'offline.html',
}

task :default do
	exec("rake --rakefile '#{__FILE__}' --tasks")
end

desc 'Switch to the production environment'
task :production => ["compass:clean", "compass:production", "optipng", "manifest:update", "manifest:add"]

desc 'Switch to the development environment'
task :development => ["compass:clean", "compass:development", "manifest:remove"]

desc 'Optimize PNG files with optipng'
task :optipng do
	system("find '" + File.join(CONFIG['root'], CONFIG['images_dir']) + "' -type f -name '*.png' | xargs optipng -quiet -preserve")
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

namespace :compass do
	desc 'Remove generated files and the sass cache'
	task :clean do
		system("cd '" + File.join(CONFIG['root'], CONFIG['compass_project']) + "' &>/dev/null && compass clean")
	end
	
	desc 'Compass compile with `-e development`'
	task :development do
		system("cd '" + File.join(CONFIG['root'], CONFIG['compass_project']) + "' &>/dev/null && compass compile --time -e development")
	end
	
	desc 'Compass compile with `-e production --force`'
	task :production do
		system("cd '" + File.join(CONFIG['root'], CONFIG['compass_project']) + "' &>/dev/null && compass compile --time -e production --force")
	end
end