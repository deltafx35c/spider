# spider
爬虫专用服务器

## install
cnpm i pm2 -g
cnpm i

## scripts
- npm run dev  _启动本地服务_
- npm run start _启动生产环境服务_
- pm2 list _查看当前pm2服务运行状况_
- pm2 restart pid/all _重启[单个(某个pid)/全部]服务_
- pm2 stop pid/all _停止[单个(某个pid)/全部]服务_
- pm2 delete pid/all _删除[单个(某个pid)/全部]服务_
- pm2 logs _查看pm2运行日志_

## Q&A
Q : 安装puppeteer时无法下载对应的chrome  
A : 删除node_modules文件后反复尝试重新安装  

Q : 无法下载安装phantomJS  
A : 删除node_modules文件后反复尝试重新安装  

Q : 为何同时使用puppeteer(dealpage.js)和phantomJS(dealpage2.js)  
A : 因phantomJS已停止维护更新，其使用的webkit内核版本也较旧，故优先使用chrome官方团队维护的puppeteer作为首选方案，但因为puppeteer在linux上部署时可能存在问题，故使用phantomJS同时开发了相同功能作为备用方案  

Q : 无法生成缓存文件  
A : 确认src目录下cache文件夹是否存在  

Q : centos7下puppeteer无法运行  
A : 1.centos下需安装相关依赖包和字体，具体安装命令如下：  
    yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 -y
    yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y  
    2.使用root用户启动服务

Q : 使用该爬虫服务器对入口nginx配置有何要求  
A : 需要在入口nginx中过滤出爬虫请求，并转发到该服务器，并且必须将http header中的host设置为原请求的host内容，$http_user_agent的匹配可以根据需要拦截的爬虫种类进行修改，具体配置可以参考如下内容：  
> location / {  
>   proxy_set_header Host $http_host;  
>   if ($http_user_agent ~* "qihoobot|Baiduspider|Googlebot|Googlebot-Mobile|Googlebot-Image|Mediapartners-Google|Adsbot-Google|Feedfetcher-Google|Yahoo! Slurp|Yahoo! Slurp China|YoudaoBot|Sosospider|Sogou spider|Sogou web spider|MSNBot|ia_archiver|Tomato Bot") {   
>       proxy_pass http://spider_server;  
>   }   
>   `# 原有业务服务器配置`  
>   `# root   /www/vue/vue-webpack/dist;`  
>   `# try_files $uri $uri/ /index.html;`  
>}  

Q : 如何[清除/更新]页面缓存文件  
A : 删除src/cache目录下[所有/对应]文件即可，爬虫下次访问页面时会自动生成新的缓存文件，重要提醒：**cache文件夹本身不可删除！**  

Q : 如何快速测试爬虫服务器是否正常运行  
A : 使用curl命令模拟爬虫请求并查看返回结果(状态码是否为200)，并查看服务端src/cache是否生成正确的缓存文件，curl命令可参考如下内容：  
    `curl -I -A "Baiduspider" http://www.hostname.com/path/to`  
    