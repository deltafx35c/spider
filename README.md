# spider
爬虫专用服务器

## install
cnpm i pm2 -g
cnpm i

## scripts
``` 启动本地服务
npm run dev
``` 
``` 启动生产环境服务
npm run start
```
``` 查看当前pm2服务运行状况
pm2 list 
```
``` 重启[单个(某个pid)/全部]服务
pm2 restart pid/all
```  
``` 停止[单个(某个pid)/全部]服务
pm2 stop pid/all
```  
``` 删除[单个(某个pid)/全部]服务
pm2 delete pid/all
```  
``` 查看pm2运行日志
pm2 logs
```

## Q&A
Q : 安装puppeteer时无法下载对应的chrome
A : 删除node_modules文件后反复尝试重新安装

Q : 无法下载安装phantomJS
A : 删除node_modules文件后反复尝试重新安装

Q : 无法生成缓存文件
A : 确认src目录下cache文件夹是否存在

Q : centos7下puppeteer无法运行
A : 1.centos下需安装相关依赖包和字体，具体安装命令如下：
    yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 -y
    yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y
    2.使用root用户启动服务

Q : 使用该爬虫服务器对入口nginx配置有何要求
A : 需要在入口nginx中过滤出爬虫请求，并转发到该服务器，并且必须将http header中的host设置为原请求的host内容，$http_user_agent的匹配可以根据需要拦截的爬虫种类进行修改，具体配置可以参考如下内容：
    location / {
        proxy_set_header Host $http_host;
        if ($http_user_agent ~* "qihoobot|Baiduspider|Googlebot|Googlebot-Mobile|Googlebot-Image|Mediapartners-Google|Adsbot-Google|Feedfetcher-Google|Yahoo! Slurp|Yahoo! Slurp China|YoudaoBot|Sosospider|Sogou spider|Sogou web spider|MSNBot|ia_archiver|Tomato Bot") { 
            proxy_pass http://spider_server;
        } 
        # 原有业务服务器配置
        # root   /www/vue/vue-webpack/dist;
        # try_files $uri $uri/ /index.html;
    }

Q : 如何[清除/更新]页面缓存文件
A : 删除src/cache目录下[所有/对应]文件即可，爬虫下次访问页面时会自动生成新的缓存文件
    特别提醒：`cache文件夹本身不可删除！`