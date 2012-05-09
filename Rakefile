ROOT = File.dirname(__FILE__)
CONFIG = {
	'path_root' => ROOT,
	'path_scss' => File.join(ROOT, 'resources', 'scss'),
	'index_file' => 'index.html',
	'manifest_file' => 'cache.manifest',
	'offline_file' => 'offline.html',
	'compiledjs_file' => 'lib/script.js'
}

task :default do
	exec("rake --rakefile '#{__FILE__}' --tasks")
end

desc "Switch to production environment"
task :production => ["compass:production", "manifest", "compass:cache"] do
	# add 'manifest' attribute to the opening html tag
	path = File.join(CONFIG['path_root'], CONFIG['index_file'])
	text = File.read(path)
	f = File.open(path, "w")
	f.write(text.sub(/(<html.*?)\s*(manifest\=(["'])([^\3]*?)(\3))(>)/i, '\1\6').sub(/(<html[^>]*?)\s*(>)/i, '\1 manifest="' + CONFIG['manifest_file'] + '"\2'));
	f.close()
end

desc "Switch to development environment"
task :dev do
	# strip <html manifest=... to bypass the application cache
	path = File.join(CONFIG['path_root'], CONFIG['index_file'])
	text = File.read(path)
	f = File.open(path, "w")
	f.write(text.sub(/(<html.*?)\s*(manifest\=(["'])([^\3]*?)(\3))(>)/i, '\1\6'));
	f.close()
end

desc "Update #{CONFIG['manifest_file']}"
task :manifest do
	puts "Updating cache.manifest..."
	
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

	files = []
	files += scan_html("index.html", CONFIG['path_root'])
	cache = files.uniq.sort.join("\n")
	f = File.open(File.join(CONFIG['path_root'], CONFIG['manifest_file']), "w")
	f.write(<<-EOF)
CACHE MANIFEST
# #{`date "+%Y-%m-%d %H:%M:%S"`.chomp}

CACHE:
#{files.uniq.sort.join("\n")}

FALLBACK:
#{CONFIG['offline_file']}

NETWORK:
*
EOF
	f.close()
end

namespace :compass do
	desc "Compass compile -e development"
	task :development do
		system("cd '#{CONFIG['path_scss']}' &>/dev/null && compass compile --time -e development")
	end
	
	desc "Compass compile -e production --force"
	task :production do
		system("cd '#{CONFIG['path_scss']}' &>/dev/null && compass compile --time -e production --force")
	end
	
	desc "Remove all .sass-cache"
	task :cache do
		system("find '#{CONFIG['path_root']}' -type d -name '.sass-cache' -prune -print -exec rm -r \\{\\} \\;")
	end
end

=begin
desc "Package and compress JavaScripts into a single file"
task :compress do
	compiledjs_file = File.join(ROOT, CONFIG['compiledjs_file'])
	text = File.read(File.join(CONFIG['path_root'], "index.html"))
	text = text.gsub(/<\!--([\s\S]*?)-->/i, "")
	scripts = text.scan(/<script [^>]*src=(["'])((?!\1).+?)(\1)[^>]*>\s*<\/script>/i)
	yuicompressor = `bash -lc "type -p yuicompressor.jar"`
	puts "yuicompressor.jar: #{yuicompressor}"
	if (!yuicompressor)
		f = File.open(compiledjs_file, "w")
	end
	scripts.each do |script|
		s = File.join(CONFIG['path_root'], script[1])
		puts "  #{script[1]}"
		if (!yuicompressor || !s.match(/.min.js$/i))
			f.write(File.read(s))
		else
			# puts "compressing into #{compiledjs_file}..."
			results = `bash -lc 'java -jar "#{yuicompressor}" --type=js >> "#{compiledjs_file}"'`
		end
	end
end
=end

