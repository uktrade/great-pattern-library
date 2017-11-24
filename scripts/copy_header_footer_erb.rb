#!/usr/bin/ruby
# encoding: UTF-8

# this script copies all the header/footer files from great-pattern-library
# and adds all the necessary variables and template logic
# for erb templates used in export-opportunities

# export-opportunities directory must exist parallel to great-pattern-library

require 'fileutils'

PATTLIB_DIR = "./shared-header-footer/"
DIR_HTML = "../export-opportunities/app/views/layouts/"
DIR_IMG = "../export-opportunities/app/assets/images/logos/"
DIR_CSS = "../export-opportunities/app/assets/stylesheets/"
DIR_JS = "../export-opportunities/app/assets/javascripts/"

def build_header()
  puts "*** Building HEADER TEMPLATE ***"
  header = File.read(PATTLIB_DIR+"header.html")
  header = header.split(/(t\-links\"\>)(\s)/)
  header[2] = "\n        <% if not @current_user %>\n"
  header = header.join.split(/(.)(\" class\=\"reg)/)
  header[1] = '<%=Figaro.env.SSO_ENDPOINT_BASE_URI %>accounts/signup'
  header = header.join.split(/(.)(\" class\=\"signin)/)
  header[1] = '<%=dashboard_path%>'
  header = header.join.split(/(in\<\/a\>\s+\<\/li\>)(\s)/)
  header[2] = "\n        <% else %>\n"
  header = header.join.split(/(.)(\" class\=\"pro)/)
  header[1] = '<%=dashboard_path%>'
  header = header.join.split(/(.)(\" class\=\"signout)/)
  header[1] = '<%=destroy_user_session_path%>'
  header = header.join.split(/(out\<\/a\>\s+\<\/li\>)(\s)/)
  header[2] = "\n        <% end %>\n"
  header = replace_html(header.join)
  write_file("_dit_header.html.erb", header, DIR_HTML)
end

def build_footer()
  puts "*** Building FOOTER TEMPLATE ***"
  footer = File.read(PATTLIB_DIR+"footer.html")
  footer = replace_html(footer)
  write_file("_dit_footer.html.erb", footer, DIR_HTML)
end

def build_css()
  puts "*** Replacing image paths in CSS ***"
  css = File.read(PATTLIB_DIR+"style.css")
  css = replace_css(css)
  write_file("header-footer.css", css, DIR_CSS)
end

def write_file(filename, data, dest)
  file = File.new("#{dest}#{filename}", "w")
  if file
    file.syswrite(data)
    puts "Written #{dest}#{filename}"
  else
    puts "Unable to write to file"
  end
end

def replace_html(html)
  html.gsub!(/\/shared\-header\-footer\/DfIT\_WHITE_AW\.png/, "<%=asset_path('logos/DfIT_WHITE_AW.png')%>")
  html.gsub!(/\/shared\-header\-footer\/eig\-logo\-stacked\.svg/, "<%=asset_path('logos/EiG-logo-stacked.svg')%>")
  # services
  html.gsub!(/http\:\/\/find\-a\-buyer\.export\.great\.gov\.uk/, "<%=Figaro.env.FIND_A_BUYER_URL %>")
  html.gsub!(/http\:\/\/selling\-online\-overseas\.export\.great\.gov\.uk/, "<%=Figaro.env.SELLING_ONLINE_OVERSEAS_URL %>")
  html.gsub!(/http\:\/\/opportunities\.export\.great\.gov\.uk/, "<%=Figaro.env.EXPORT_OPPORTUNITIES_URL %>")
  html.gsub!(/http\:\/\/events\.trade\.gov\.uk/, "<%=Figaro.env.EVENTS_URL %>")
  # info
  html.gsub!(/http\:\/\/contactus\.trade\.gov\.uk/, "<%=Figaro.env.CONTACT_US_FORM %>")
  html.gsub!(/http\:\/\/great\.gov\.uk/, "<%=Figaro.env.GREAT_GOV_URL %>")
  # export home
  html.gsub!(/http\:\/\/export\.great\.gov\.uk/, "<%=Figaro.env.EXPORT_READINESS_URL %>")
  return html
end

def replace_css(css)
  css.gsub!(/shared\-header\-footer/, "assets/logos")
  return css
end

def copy_images()
  puts "*** Copying IMAGES ***"
  src = Dir.glob("#{PATTLIB_DIR}*.{svg,png,gif}")
  src.each do |file|
    filename = File.basename file
    FileUtils.cp(file, DIR_IMG+filename)
    puts "Copied #{filename} to #{DIR_IMG+filename}"
  end
end

def copy_js()
  puts "*** Copying JS ***"
  script = "#{PATTLIB_DIR}script.js"
  FileUtils.cp(script, "#{DIR_JS}header-footer.js")
  puts "Copied #{script} to #{DIR_JS}header-footer.js"
  third_party = "#{PATTLIB_DIR}third-party.js"
  FileUtils.cp(third_party, "#{DIR_JS}jquery3.2.0.js")
end

build_footer()
build_header()
build_css()
copy_images()
copy_js()
