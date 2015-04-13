# **NODEFONY FRAMEWORK**

###  **Framework Node.js Symfony Like** 


__Table of content__

- [Install](#install)
- [Start](#start) 
- [Configurations](#configurations) 
- [Command line Interface](#cli) 
- [Bundles](#bundles) 
- [Requirements](#requirements) 
- [References / Thanks](#references--thanks)
- [Authors](#authors)
- [License](#license)

## <a name="install"></a>Install

**Node.js** :

```bash
$ git clone git@github.com:ccamensuli/nodefony.git

$ cd nodefony

$ make
```

## <a name="start"></a>start

Add host name "nodefony.com" in your /etc/hosts  :
```bash
$ sudo vim /etc/hosts

##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1       localhost nodefony.com 

```

Start the server :
```bash
$ ./nodefony_dev
```

Access to App with URL : http://nodefony.com:5151

[![nodefony](https://raw.githubusercontent.com/ccamensuli/nodefony/master/src/nodefony/doc/login.png)](https://github.com/ccamensuli/nodefony)

## <a name="configurations"></a>Configurations Kernel
Open [./config/config.yml](https://github.com/ccamensuli/nodefony/blob/master/src/nodefony/config/config.yml)  to change httpPort  domain server ...
```bash
	#
	#  NODEFONY FRAMEWORK 
	#
	#       KERNEL CONFIG
	#
	#
	name:                         "NODEFONY"
	system:                         
  		version:                      "1.0"
  		domain:                       nodefony.com
  		httpPort:                     5151
  		httpsPort:                    5152
  		statics:                      true
  		security:                     true
  		realtime:                     true
  		monitoring:                   true

  		locale:                       "fr_fr"   

  		log:
    		active:                     true
    		messages:                   "/tmp/nodefony.log"
    		error:                      "/tmp/errorNodefony.log"
    		services:                   "/tmp/servicesNodefony.log"
    		rotate:                     false

```

## <a name="cli"></a>Command Line Interface
```bash
$./console -h
              _   _    ___    ____    _____   _____    ___    _   _  __   __
             | \ | |  / _ \  |  _ \  | ____| |  ___|  / _ \  | \ | | \ \ / /
             |  \| | | | | | | | | | |  _|   | |_    | | | | |  \| |  \ V / 
             | |\  | | |_| | | |_| | | |___  |  _|   | |_| | | |\  |   | |  
             |_| \_|  \___/  |____/  |_____| |_|      \___/  |_| \_|   |_|  
                                                                            

		      CONSOLE Version : 1.0 PLATFORM : darwin  PROCESS PID : 21553

Usage: node console

  -h, --help     
  -v, --version  show version

Commands : [arguments]
framework
	generate:bundle nameBundle path                                  Generate a Bundle directory in path directory
	generate:controller  nameController path                         Generate a controller js file in bundle path
	generate:command nameCommand path                                Generate a command js file in bundle path
	generate:service nameService path                                Generate a service js file in bundle path
	npm:list                                                         List all installed packages 
	npm:install                                                      install all framework packages
	router:generate:routes                                           Generate all routes
	router:generate:route routeName                                  Generate one route
	router:match:url url                                             Get route who match url 
assetic
	assets:install                                                   Installs bundles web assets under a public web directory 
	less:render                                                      Less CSS compilateur 
	less:compile                                                     Less CSS compilateur 
	minification:compile [compilateur]                               Minificaton javascript compilateur : google / yahoo
security
	encoders:Digest firewall login password [realm]                  Generate encoding keys digest MD5
orm2
	ORM2:fixtures:load                                               Load data fixtures to your database
	ORM2:fixture:load bundleName:fixtureName                         Load a specific data fixture to your database
	ORM2:generate:entity connectionName entityName                   Generate an Entity
	ORM2:generate:bundleEntity bundleName:entityName                 Generate Bundle Entity
	ORM2:generate:entities                                           Generate All Entities
	ORM2:database:create                                             Create a database
	ORM2:entity:show                                                 show  Entities
	ORM2:connections:state                                           view  connections states
App
	server:run                                                       Run Application

```

## <a name="bundles"></a>Bundles
Generate new bundle :    generate:bundle nameBundle path
       
```bash
$ ./console generate:bundle helloBundle src/bundles
              _   _    ___    ____    _____   _____    ___    _   _  __   __
             | \ | |  / _ \  |  _ \  | ____| |  ___|  / _ \  | \ | | \ \ / /
             |  \| | | | | | | | | | |  _|   | |_    | | | | |  \| |  \ V / 
             | |\  | | |_| | | |_| | | |___  |  _|   | |_| | | |\  |   | |  
             |_| \_|  \___/  |____/  |_____| |_|      \___/  |_| \_|   |_|  
                                                                            

		      CONSOLE Version : 1.0 PLATFORM : darwin  PROCESS PID : 1069

GENERATE bundle : helloBundle LOCATION : src/bundles
Create Directory :helloBundle
Create Directory :Command
Create Directory :controller
Create File      :defaultController.js
Create Directory :manager
Create Directory :tests
Create Directory :Resources
Create Directory :config
Create File      :config.yml
Create File      :routing.yml
Create Directory :public
Create Directory :js
Create Directory :css
Create Directory :images
Create Directory :translations
Create Directory :views
Create File      :index.html.twig
Create Directory :core
Create Directory :Entity
Create File      :helloBundle.js
```
More informations [wiki](https://github.com/ccamensuli/nodefony/wiki#bundles) 
	 

## <a name="requirements"></a>Requirements
#### System : *You must install*  
- LINUX (checked)  : GNU Make / Node.js / npm 
- MACOS (checked)  : GNU Make / Node.js' / npm 
- ~~WINDOWS (no check)~~
#### NPM : *Install auto by Makefile*
```bash
	.----------------------------------------------------------------------------------------------------------------------------------------.
	|                                                         NPM NODEFONY PACKAGES                                                          |
	|----------------------------------------------------------------------------------------------------------------------------------------|
	|    NAME     | VERSION |                                                  DESCRIPTION                                                   |
	|-------------|---------|----------------------------------------------------------------------------------------------------------------|
	| npm         | 2.7.6   | a package manager for JavaScript                                                                               |
	| asciify     | 1.3.5   | Plain text awesomizer. A hybrid npm module and CLI for turning plain text into ascii art.                      |
	| websocket   | 1.0.18  | Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.                |
	| js-yaml     | 3.2.7   | YAML 1.2 parser and serializer                                                                                 |
	| node-getopt | 0.2.3   | featured command line args parser                                                                              |
	| shortid     | 2.2.2   | Amazingly short non-sequential url-friendly unique id generator.                                               |
	| mkdirp      | 0.5.0   | Recursively mkdir, like `mkdir -p`                                                                             |
	| xml2js      | 0.4.6   | Simple XML to JavaScript object converter.                                                                     |
	| twig        | 0.8.2   | JS port of the Twig templating language.                                                                       |
	| connect     | 2.29.1  | High performance middleware framework                                                                          |
	| orm         | 2.1.13  | NodeJS Object-relational mapping                                                                               |
	| sqlite3     | 3.0.5   | Asynchronous, non-blocking SQLite3 bindings                                                                    |
	| mysql       | 2.6.1   | A node.js driver for mysql. It is written in JavaScript, does not require compiling, and is 100% MIT licensed. |
	| less        | 2.5.0   | Leaner CSS                                                                                                     |
	| ascii-table | 0.0.8   | Easy tables for your console data                                                                              |
	| mime        | 1.3.4   | A comprehensive library for mime-type mapping                                                                  |
	| markdown-it | 4.1.0   | Markdown-it - modern pluggable markdown parser.                                                                |
	'----------------------------------------------------------------------------------------------------------------------------------------'
```
## <a name="references--thanks"></a>References / Thanks
Big thanks 

**Related Links:**
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Framework Symfony](http://symfony.com/)
- [Twig.js](https://github.com/justjohn/twig.js/wiki)

## <a name="authors"></a>Authors

- Christophe CAMENSULI  [github/ccamensuli](https://github.com/ccamensuli)

##  <a name="license"></a>License

[CeCILL-B](https://github.com/ccamensuli/nodefony/blob/master/LICENSE)


