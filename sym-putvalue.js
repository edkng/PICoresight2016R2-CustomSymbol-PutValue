(function (PV) {  
    var userName = PV.IdentityContext.FriendlyUserName.toUpperCase();  
    var index = userName.indexOf("\\",0);  
    var userNamewithoutDomain = userName.substr(index + 1);  
    function symbolVis() { }  
    PV.deriveVisualizationFromBase(symbolVis);  
  
    symbolVis.prototype.init = function (scope) {  
     this.onDataUpdate = dataUpdate; 
     //default value for timestamp
     scope.config.TimeBox = '*';
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
            var piwebapiaddress = "khashimotoe6440";    
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
            var valueboxval = new String(scope.config.ValueBox, { "type" : "text/plain" });
            var timeboxval = new String(scope.config.TimeBox, { "type" : "text/plain" });    
            //Create value contents as json    
            var jsonval = '"{Timestamp : \'' + timeboxval + '\', Value:\'' + valueboxval + '\'}"';
            //var jsonval = '"{Value:' + valueboxval + '}"';    
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
        iconUrl:'/Scripts/app/editor/symbols/ext/Icons/pen.svg',  
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,  
        visObjectType: symbolVis,  
        getDefaultConfig: function() {  
            return {  
                DataShape: 'Value',  
                Height: 170,  
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
      
    if (userNamewithoutDomain == 'KHASHIMOTO')  
    {  
        PV.symbolCatalog.register(definition);  
    }  
})(window.PIVisualization);  