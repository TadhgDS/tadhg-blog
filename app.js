/*	TO-DO LIST

	1. Change posts to be represented as JSON allowing for multiple fields eg. {title:x, post:y, timestamp:z, graphs:w, somethingelse:u}
	2. Add session management for submission page
	3. d3 example graphs	


*/


var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var url = require('url');
var markdown = require('markdown').markdown;
var currentDirectory = __dirname + '/';



var express = require('express');


var app = express();

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: false
})); 

var multer = require('multer'); 
app.use(multer());



app.get('/blog.css',function(req,res){
	// read the html file
    // and spit them into the response
    fs.readFile(currentDirectory + 'css/blog.css', 'utf8', function (err,data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('Ooops ' + 'css/blog.css' + ' couldnt be found!');
            return console.log(err);
        }
        
        console.log('css/blog.css');
        var type =  getFileExtension('css/blog.css');
        console.log(type);
        
        res.writeHead(200, {'Content-Type': 'text/' + type});
        res.end(data);
    });
});

app.get('/normalize.css',function(req,res){
	// read the html file
    // and spit them into the response
    fs.readFile(currentDirectory + 'css/blog.css', 'utf8', function (err,data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('Ooops ' + 'css/blog.css' + ' couldnt be found!');
            return console.log(err);
        }
        
        console.log('css/blog.css');
        var type =  getFileExtension('css/blog.css');
        console.log(type);
        
        res.writeHead(200, {'Content-Type': 'text/' + type});
        res.end(data);
    });
});

app.get('/index.html',function(req,res){
	// read the html file
    // and spit them into the response
    fs.readFile(currentDirectory + 'index.html', 'utf8', function (err,data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('Ooops ' + 'index.html' + ' couldnt be found!');
            return console.log(err);
        }
        
        var type =  getFileExtension('index.html');
        console.log(type);
        
        res.writeHead(200, {'Content-Type': 'text/' + type});
        res.end(data);
    });
});


app.get('/data.csv',function(req,res){
	// read the html file
    // and spit them into the response
    fs.readFile(currentDirectory + '/templates/data.csv', 'utf8', function (err,data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('Ooops ' + 'data.csv' + ' couldnt be found!');
            return console.log(err);
        }
        
        var type =  getFileExtension('templates/data.csv');
        console.log(type);
        
        res.writeHead(200, {'Content-Type': 'text/csv' + type});
        res.end(data);
    });
});

app.get('/bench.csv',function(req,res){
	// read the html file
    // and spit them into the response
    fs.readFile(currentDirectory + '/templates/bench.csv', 'utf8', function (err,data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('Ooops ' + 'bench.csv' + ' couldnt be found!');
            return console.log(err);
        }
        
        var type =  getFileExtension('templates/bench.csv');
        console.log(type);
        
        res.writeHead(200, {'Content-Type': 'text/csv' + type});
        res.end(data);
    });
});



app.get('/post*',function(req,res)	{
    fs.readFile(currentDirectory + 'templates/entry', 'utf8', function(err, template) {
        if (err) console.log(err);
        var blogFileName = currentDirectory + 'blog-posts/' + getFileName(req.url);
        fs.readFile(blogFileName, 'utf8', function(err, postMarkUp) {            
            var jsonString = JSON.parse(postMarkUp);
            var post = markdown.toHTML(jsonString.mainText);
            var htmltest = '';
            
 

            
            // TODO: you have three strings, one called 'template' which is the template with tokens
            // and the second called 'post' which is the contents of the blog post file
            // and 'html' which is the string that will be sent back to the browser
            
            htmltest = template.replace('{{Contents}}', post);
            var title = getFileName(req.url);
            title = title.replace(/-/g," ");
           
            var html = '';
            html = htmltest.replace('{{Title}}', title);
           
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html);
        });
    });
});

app.get('/edit',function(req,res){
	fs.readFile(currentDirectory + 'templates/edit', 'utf8', function(err, template) {
        if (err) console.log(err);
           
  	    res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(template);
    });
});



app.post('/submit*',function(req,res){
    // MyVariableOne=ValueOne&MyVariableTwo=ValueTwo

    
    if (req.method == 'POST') {
        console.log("[200] " + req.method + " to " + req.url);

	    res.json(req.body.title + req.body.textarea);
	  	var title = req.body.title;
	  	title = title.replace(/ /g,"-");
	  	var textarea = req.body.textarea;


	  	//json obj
	  	var postObj = {
	  		title: req.body.title,
	  		mainText: req.body.textarea,
	  		submitDate: Date.now(),
	  		editDate: "",
	  		graphs: ""
	  	}
	  	var jsonObj = JSON.stringify(postObj);
	  
	  	var filepath = 	currentDirectory + 'blog-posts/' + title;
	  	fs.writeFile(filepath, jsonObj, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });

    } else {
        console.log("[405] " + req.method + " to " + req.url);
        res.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
        res.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
    }
 });




app.post('/preview/',function(req,res){

	var jsonString = req.body;
    var theObject =	{ "title":req.body.title , "textarea":req.body.textarea };
    theObject.title = markdown.toHTML(theObject.title);
    theObject.textarea = markdown.toHTML(theObject.textarea);
    

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(theObject));

});

app.get('/gym',function(req,res){
	fs.readFile(currentDirectory + 'templates/gym', 'utf8', function(err, gymTemplate) {
		if (err) console.log(err);
		fs.readFile(currentDirectory + 'templates/linechart', 'utf8', function(err, graphTemplate) {
	        if (err) console.log(err);
	       // graphtemplate = graphtemplate.replace('')
	           

	        var html = '';
	        var temp = '';
	        temp = gymTemplate.replace('{{OVERHEADPRESS}}', graphTemplate);
	        html = temp.replace('d3.select("body")','d3.select("#ohpress")');
	        var atemp ='';
	        var ahtml ='';
	        atemp = html.replace('{{BENCH}}', graphTemplate);   
	        ahtml = atemp.replace('d3.select("body")','d3.select("#bench")');


	        var aatemp ='';
	        var aahtml ='';
	        aatemp = ahtml.replace('{{DEADLIFT}}', graphTemplate);   
	        aahtml = aatemp.replace('d3.select("body")','d3.select("#dead")');

	        var test = aahtml.replace('data.csv', 'bench.csv');  
	        
	  	    res.writeHead(200, {'Content-Type': 'text/html'});
	        res.end(test);
	    });
    });
});


/*============================

			HOME 	

==============================*/

app.get('/', function (req, res){



        console.log(currentDirectory + 'css' + req.path);
    if (req.path.indexOf('.css') !== -1)
    {
    
        
    }
    else
    {
	 	var blogPostsFolder = currentDirectory + 'blog-posts/';
        
        fs.readdir(blogPostsFolder, function(err, files) {
            if (err) {
                console.log(err);
            }
            
            // files is an array of blog posts titles / filenames
            
            console.log(files);
            
            // read in our home template
            fs.readFile(currentDirectory + 'templates/home', 'utf8', function(err, templateString) {
                if (err) {
                    console.log(err);
                }
                
                templateString = '' + templateString;
                var htmlForPosts = templateString.getTextBetweenTokens("{{REPEAT}}", "{{ENDREPEAT}}");
                var blogPosts = '';
                
                files.forEach(function(blogPost) {
                    blogPosts += htmlForPosts.replace('{{Post1.Link}}', '/post/' + blogPost)
                                             .replace('{{Post1.Title}}', blogPost);
                });
                
                var html = templateString.replace('{{Title}}', 'Latest blog posts')
                                         .replaceContents("{{REPEAT}}", "{{ENDREPEAT}}", blogPosts);
                
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(html);
            });
        });
	}
});






var server = app.listen(3000, function () {

	var host = server.address().address;
  	var port = server.address().port;

 	console.log('Example app listening at http://%s:%s', host, port)

});


var getFileExtension = function(url) {
    var indexOfDot = url.lastIndexOf('.');
    return url.substring(indexOfDot + 1);
};

var getFileName = function(url) {
    var indexOfSlash = url.lastIndexOf('/');
    return url.substring(indexOfSlash + 1);
};

String.prototype.startsWith = function(str) {
    return this.indexOf(str) === 0;
};

String.prototype.replaceContents = function(token1, token2, newContents) {
    var startTokenPos = this.indexOf(token1);
    var endTokenPos = this.indexOf(token2) + token2.length;
    
    var strToReplace = this.substring(startTokenPos, endTokenPos);
    
    return this.replace(strToReplace, newContents);
};

String.prototype.getTextBetweenTokens = function(token1, token2) {
    var startTokenPos = this.indexOf(token1) + token1.length;
    var endTokenPos = this.indexOf(token2);
    
    return this.substring(startTokenPos, endTokenPos);
};

var postObject = function(url, obj, callback) {
                var xmlhttp = new XMLHttpRequest();

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState === 4) {
                       if(xmlhttp.status === 200){
                           callback(null, xmlhttp.responseText);
                       }
                       else {
                            callback(xmlhttp, null);
                       }
                    }
                };

                xmlhttp.open('POST', url, true)
                xmlhttp.setRequestHeader('Content-type','application/json');
                xmlhttp.send(JSON.stringify(obj));
            };
