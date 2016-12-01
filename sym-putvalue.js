(function (CS) {
    function symbolVis() { }
    CS.deriveVisualizationFromBase(symbolVis);

    symbolVis.prototype.init = function (scope) {
	    this.onDataUpdate = dataUpdate;
	    function dataUpdate(data) {
		    if(data) {
		        scope.value = data.Value;
		        scope.time = data.Time;
		        if(data.Path){
		        	scope.path = data.Path;
		        }
		        if(data.Label) {
		            scope.label = data.Label;
		        }
		    }
	    }
	    scope.putvalue = function() {  
            var piwebapiaddress = "ServerName";  
            //scope.path contains pi:\\servername\tagname or af:\\servername\databasename\element...|attribute  
            var ini = scope.path.substr(0,3);  
            var orgpath = scope.path.substr(3,10000);  
            //To double the backslash -  \\\\servername\\tagname  
            var path = orgpath.replace(/\\|\\/g,"\\\\");  
            if(ini=="pi:"){  
                var urladdress = "\"https://" + piwebapiaddress + "/piwebapi/points?path="+path+"\"";  
            }  
            else if(ini=="af:"){  
                var urladdress = "\"https://" + piwebapiaddress + "/piwebapi/attributes?path="+path+"\"";  
            }  
            //Get text box value  
            var boxval = new String(scope.config.Box, { "type" : "text/plain" });  
            //Create value contents as json  
            var jsonval = '"{Value:' + boxval + '}"';  
            // Create contents of PI Web API batch request  
            var contents = '{"GetWebID":{"Method": "GET","Resource": '+ urladdress + '},"WriteValuetoPI":{"Method":"POST","Resource": "{0}","Content":' + jsonval + ',"Parameters": ["$.GetWebID.Content.Links.Value"],"ParentIds": ["GetWebID"]}}';  
  
            //PI Web API Request  
            var batchurl = "https://" + piwebapiaddress + "/piwebapi/batch";  
            var xhr= new XMLHttpRequest();  
            //true = Async call  
            xhr.open("POST",batchurl,true);  
            //Set credential for Kerberos  
            xhr.withCredentials = true;  
            xhr.setRequestHeader('Content-Type','application/json');  
            //Send request  
            xhr.send(contents);  
            
        };  
	};
    var definition = {
        typeName: 'putvalue',
        iconUrl:'Images/pen.svg',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
        visObjectType: symbolVis,
        getDefaultConfig: function() {
            return {
                DataShape: 'Value',
                Height: 130,
                Width: 180,
            	TextColor: 'rgb(255,255,255)',
		        ShowLabel: true,
		        ShowTime: true,
		        ShowPutValue: true
            };
        },
    	configTitle: 'Format Symbol',
    	StateVariables: [ 'MultistateColor' ]
    };
    CS.symbolCatalog.register(definition);
})(window.Coresight);
