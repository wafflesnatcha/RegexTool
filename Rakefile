CONFIG = {
	'root' => File.dirname(__FILE__),
	'compass_project' => 'assets/scss',
	'images_dir'      => 'assets/img',
	'index_file' => 'index.html',
	'manifest_file' => 'cache.manifest',
	'offline_file' => 'offline.html',
}

task :default do
	exec("rake --rakefile '#{__FILE__}' --tasks")
end

def htmlManifest(remove = false)
	# add or remove the 'manifest' attribute on the opening <html> tag
	path = File.join(CONFIG['root'], CONFIG['index_file'])
	text = File.read(path)
	text.sub!(/(<html.*?)\s*(manifest\=(["'])([^\3]*?)(\3))(>)/i, '\1\6')
	text.sub!(/(<html[^>]*?)\s*(>)/i, '\1 manifest="' + CONFIG['manifest_file'] + '"\2') if (!remove)
	f = File.open(path, "w")
	f.write(text)
	f.close()
end

desc "Switch to production environment"
task :production => ["compass:production", "manifest", "compass:cache"] do
	htmlManifest(false)
end

desc "Switch to development environment"
task :development => ["compass:clean", "compass:development"] do
	htmlManifest(true)
end

desc "Update the application cache manifest '#{CONFIG['manifest_file']}'"
task :manifest do
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

namespace :compass do

	desc 'Remove sass cache'
	task :cache do
		system("find '#{CONFIG['root']}' -type d -name '.sass-cache' -prune -exec echo \"Removing {}\" \\; -exec rm -r \\{\\} \\;")
	end

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

=begin
desc "Package and compress JavaScripts into a single file"
task :compress do
	compiledjs_file = File.join(CONFIG['root'], CONFIG['compiledjs_file'])
	text = File.read(File.join(CONFIG['root'], CONFIG['index_file']))
	text = text.gsub(/<\!--([\s\S]*?)-->/i, "")
	scripts = text.scan(/<script [^>]*src=(["'])((?!\1).+?)(\1)[^>]*>\s*<\/script>/i)
	yuicompressor = `bash -lc "type -p yuicompressor.jar"`
	puts "yuicompressor.jar: #{yuicompressor}"
	if (!yuicompressor)
		f = File.open(compiledjs_file, "w")
	end
	scripts.each do |script|
		s = File.join(CONFIG['root'], script[1])
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
