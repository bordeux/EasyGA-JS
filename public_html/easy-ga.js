/**
 * Copyright 2014 Krzysztof "Bordeux" Bednarczyk
 * MIT License 
 */

EasyGA = function(gCode, gClientId){
    var self = this;
    self.opitons = {
        "code" : "",
        "apiUrl" : "http://www.google-analytics.com/collect",
        "clientId"  : "",
        "domain"    : "",
        "version"   : 1
        
    };
    
    self.init = function(){
        self.opitons.code = gCode;
        self.opitons.clientId = gClientId;
    };
    
    self.set = function(key, value){
        self.opitons[key] = value;
    };
    
    self.pageTrack = function(page, title){
            var data = {
                "t" : "pageview",
                "dp" : page
            };
            title && (data['dt'] = title);
        return self.execute(data);
    };
    
    self.eventTrack = function(category, action, label, value){
            var data = {
               "t" : "event",
               "ec" : category,
               "ea" : action
            };
            label && (data['el'] = label);
            value && (data['ev'] = value);
        return self.execute(data);
    };
    
    self.execute = function(data){
        data['tid'] = self.opitons.code;
        self.opitons.clientId && (data['cid'] = self.opitons.clientId);
        self.opitons.domain && (data['dh'] = self.opitons.domain);
        data['payload_data'] = "true";
        data["v"] = self.opitons.version;
        data["z"] = Math.random();
        return self.send(data);
    };
    
    self.build_query  = function (obj, num_prefix, temp_key) {
      var output_string = []

      Object.keys(obj).forEach(function (val) {

        var key = val;

        num_prefix && !isNaN(key) ? key = num_prefix + key : '';

        var key = encodeURIComponent(key.replace(/[!'()*]/g, escape));
        temp_key ? key = temp_key + '[' + key + ']' : '';

        if (typeof obj[val] === 'object') {
          var query = self.build_query(obj[val], null, key);
          output_string.push(query);
        } else {
          var value = encodeURIComponent((obj[val]+"").replace(/[!'()*]/g, escape));
          output_string.push(key + '=' + value);
        };

      });
      return output_string.join('&')
    };
    
    
    self.send = function(data, success, error){
        var dataString = self.build_query(data);
        var imgUrl = self.opitons.apiUrl+'?'+dataString;
        var image =  new Image();
        image.onload = function(){
            success && success();
        };
        
        image.onerror = function(){
            error && error();
        };
        
        image.src = imgUrl; 
    };
    
    self.init();
};
