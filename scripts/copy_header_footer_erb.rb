#!/usr/bin/ruby
# encoding: UTF-8

# this script copies the header/footer html files from great-pattern-library
# and adds all the necessary variables and template logic
# for erb templates used in export-opportunities

# export-opportunities directory must exist parallel to great-pattern-library

PATTLIB_DIR = "./shared-header-footer/"
DIR_HEADER_FOOTER = "../export-opportunities/app/views/layouts/"

def build_header()
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
  footer = File.read(PATTLIB_DIR+"footer.html")
  footer = replace(footer)
  write_file('footer', footer)
end

def write_file(filename, data)
  file = File.new("#{DIR_HEADER_FOOTER}_dit_#{filename}.html.erb", "r+")
  if file
    file.syswrite(data)
    puts "Written #{DIR_HEADER_FOOTER}_dit_#{filename}.html.erb"
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

build_footer()
build_header()
