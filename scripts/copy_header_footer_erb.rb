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
  header = replace(header.join)
  write_file('header', header)
end

def build_footer()
  puts "*** Building FOOTER TEMPLATE ***"
  footer = File.read(PATTLIB_DIR+"footer.html")
  footer = replace(footer)
  write_file('footer', footer)
end

def write_file(filename, data)
  file = File.new("#{DIR_HTML}_dit_#{filename}.html.erb", "r+")
  if file
    file.syswrite(data)
    puts "Written #{DIR_HTML}_dit_#{filename}.html.erb"
  else
    puts "Unable to write to file"
  end
end

def replace(html)
  html.gsub!(/\/shared\-header\-footer\/DfIT\_WHITE_AW\.png/, "<%=asset_path('logos/DfIT_WHITE_AW.png')%>")
  html.gsub!(/\/shared\-header\-footer\/eig\-logo\-stacked\.svg/, "<%=asset_path('logos/eig-logo-stacked.svg')%>")
  # services
  html.gsub!(/http\:\/\/find\-a\-buyer\.export\.great\.gov\.uk/, "<%=Figaro.env.FIND_A_BUYER_URL %>")
  html.gsub!(/http\:\/\/selling\-online\-overseas\.export\.great\.gov\.uk/, "<%=Figaro.env.SELLING_ONLINE_OVERSEAS_URL %>")
  html.gsub!(/http\:\/\/opportunities\.export\.great\.gov\.uk/, "/")
  html.gsub!(/http\:\/\/events\.trade\.gov\.uk/, "<%=Figaro.env.EVENTS_URL %>")
  # info
  html.gsub!(/http\:\/\/contactus\.trade\.gov\.uk/, "<%=Figaro.env.CONTACT_US_FORM %>")
  html.gsub!(/http\:\/\/great\.gov\.uk/, "<%=Figaro.env.GREAT_GOV_URL %>")
  # export home
  html.gsub!(/http\:\/\/export\.great\.gov\.uk/, "<%=Figaro.env.EXPORT_READINESS_URL %>")
  return html
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

def copy_css()
  puts "*** Copying CSS ***"
  file = "#{PATTLIB_DIR}style.css"
  filename = File.basename file
  FileUtils.cp(file, "#{DIR_CSS}header-footer.css")
  puts "Copied #{filename} to #{DIR_CSS}header-footer.css"
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
copy_images()
copy_css()
copy_js()
