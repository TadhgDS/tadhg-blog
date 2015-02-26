/*	TO-DO LIST

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
        res.writeHead(200, {'Content-Type': 'text/' + type});
        res.end(data);
    });
});


//==============================================================
//==============================================================
//==============================================================



app.get('/squat.csv',function(req,res){
	// read the html file
    // and spit them into the response
    fs.readFile(currentDirectory + 'datafiles/squat.csv', 'utf8', function (err,data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('Ooops ' + 'squat.csv' + ' couldnt be found!');
            return console.log(err);
        }
        
        var type =  getFileExtension('datafiles/squat.csv');
        
        res.writeHead(200, {'Content-Type': 'text/csv' + type});
        res.end(data);
    });
});
app.get('/bench.csv',function(req,res){
	// read the html file
    // and spit them into the response
    fs.readFile(currentDirectory + 'datafiles/bench.csv', 'utf8', function (err,data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('Ooops ' + 'bench.csv' + ' couldnt be found!');
            return console.log(err);
        }
        
        var type =  getFileExtension('datafiles/bench.csv');
        
        res.writeHead(200, {'Content-Type': 'text/csv' + type});
        res.end(data);
    });
});
app.get('/dead.csv',function(req,res){
    fs.readFile(currentDirectory + 'datafiles/dead.csv', 'utf8', function (err,data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('Ooops ' + 'dead.csv' + ' couldnt be found!');
            return console.log(err);
        }
        
        var type =  getFileExtension('datafiles/dead.csv');
        
        res.writeHead(200, {'Content-Type': 'text/csv' + type});
        res.end(data);
    });
});
app.get('/bbrow.csv',function(req,res){
	// read the html file
    // and spit them into the response
    fs.readFile(currentDirectory + 'datafiles/bbrow.csv', 'utf8', function (err,data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('Ooops ' + 'bbrow.csv' + ' couldnt be found!');
            return console.log(err);
        }
        
        var type =  getFileExtension('datafiles/bbrow.csv');
        
        res.writeHead(200, {'Content-Type': 'text/csv' + type});
        res.end(data);
    });
});
app.get('/ohpress.csv',function(req,res){
	// read the html file
    // and spit them into the response
    fs.readFile(currentDirectory + 'datafiles/ohpress.csv', 'utf8', function (err,data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('Ooops ' + 'ohpress.csv' + ' couldnt be found!');
            return console.log(err);
        }
        
        var type =  getFileExtension('datafiles/ohpress.csv');
        
        res.writeHead(200, {'Content-Type': 'text/csv' + type});
        res.end(data);
    });
});




//==============================================================
//==============================================================
//==============================================================





app.get('/post*',function(req,res)	{
    fs.readFile(currentDirectory + 'templates/entry', 'utf8', function(err, template) {
        if (err) console.log(err);
        var blogFileName = currentDirectory + 'blog-posts/' + getFileName(req.url);
        fs.readFile(blogFileName, 'utf8', function(err, postMarkUp) {            
            var jsonString = JSON.parse(postMarkUp);
            var post = markdown.toHTML(jsonString.mainText);
    

            var html = '';
    
            html = template.replace('{{Contents}}', post);
            html = html.replace('{{Title}}', jsonString.title);
            

            html = html.replace('{{Date}}', getDateString(jsonString.submitDate));
            
           
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

			var str = graphTemplate.replace('data.csv', 'squat.csv');  
			//squat = squat.replace('data.csv', 'squat.csv');  
			var find = 'data.csv';
			var re = new RegExp(find, 'g');

			squat = str.replace(re, 'squat.csv');

			//squat = squat.replace('d3.select("body")','d3.select("squat")');
			var bench = graphTemplate.replace('/data.csv/g', 'bench.csv');  
			bench = bench.replace(re,'bench.csv');
			//bench = bench.replace('d3.select("body")','d3.select("bench")');
			var dead = graphTemplate.replace('/data.csv/g', 'dead.csv');  
			dead = dead.replace(re,'dead.csv');
			var bbrow = graphTemplate.replace('/data.csv/g', 'bbrow.csv');  
			bbrow = bbrow.replace(re,'bbrow.csv');
			var ohpress = graphTemplate.replace('/data.csv/g', 'ohpress.csv');  
			ohpress = ohpress.replace(re,'ohpress.csv');

			gymTemplate = gymTemplate.replace('{{SQUAT}}', squat);
			gymTemplate = gymTemplate.replace('{{BENCH}}', bench);
			gymTemplate = gymTemplate.replace('{{DEADLIFT}}', dead);
			gymTemplate = gymTemplate.replace('{{BARBELLROW}}', bbrow);
			gymTemplate = gymTemplate.replace('{{OVERHEADPRESS}}', ohpress);


	  	    res.writeHead(200, {'Content-Type': 'text/html'});
	        res.end(gymTemplate);
	    });
    });
});


app.get('/gym/squat',function(req,res){

	var title = getFileName(req.url);
	var namedotcsv = title + '.csv';

	var chart;
	fs.readFile(currentDirectory + 'templates/linechart', 'utf8', function(err, graphTemplate) {
	    if (err) console.log(err);

		chart = graphTemplate.replace('data.csv', namedotcsv);  
	});

	res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(chart);
            
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



function getDateString(UNIX_timestamp){
    var dateObj = new Date(UNIX_timestamp);
    date = dateObj.toUTCString();
    var n = date.indexOf(dateObj.getFullYear());
    var date = date.substring(0,n+4);
    return date;
}