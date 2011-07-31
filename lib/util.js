/*
 * simple logging facilities
 * author: simon
 */
var X3D = X3D ? X3D : new Object();
X3D.log = function() {
    var that = this;
    var el;

    var logger = function(name) {
        this.name = name;

        this.all = function(type, msg) {
            var date = new Date();

            /* hopefully our cpu is fast enough to handle this within milliseconds ;) */
            var days = (date.getDate() < 10 ? "0" : "")+(date.getDate());
            var month = (date.getMonth() < 10 ? "0" : "")+(date.getMonth()+1);
            var hours = (date.getHours() < 10 ? "0" : "")+date.getHours();
            var minutes = (date.getMinutes() < 10 ? "0" : "")+date.getMinutes();
            var seconds = (date.getSeconds() < 10 ? "0" : "")+date.getSeconds();
            var time = days+"/"+month+"/"+(date.getYear()+1900)
                +" "+hours+":"+minutes+":"+seconds;
            var ms = date.getMilliseconds();
+ms
            if (ms < 10) {
                ms = "000"+ms;
            } else if (ms < 100) {
                ms = "00"+ms;
            } else if (ms < 1000) {
                ms = "0"+ms;
            }

            /* patch for measurement */
            //var foo = Date.today().format("%Y%m%d%H%M%S%u");
            var foo =
            date.getYear()+1900+""+month+""+days+""+hours+""+minutes+""+seconds+""+ms;
            msg = foo+" "+type+" ("+name+"): "+msg+"\n";
            el.value += msg;
            el.scrollTop = el.scrollHeight;
        }

        this.info = function (msg) {
            this.all("INFO ", msg);
        };

        this.warn = function (msg) {
            this.all("WARN ", msg);
        };

        this.error = function (msg) {
            this.all("ERR  ", msg);
        };

        this.debug = function (msg) {
            this.all("DEBUG", msg);
        };
    };

    return {
        init: function(element) {
            el = element
        },

        get: function(name) {
            return new logger(name);
        }
    };
}();

/*
 * utility methods we use here and there
 * author: simon
 */
X3D.util = function() {
    return {
        /* deletes all child nodes recursively */
        deleteAllChilds: function(parent) {
            while (parent.hasChildNodes()) {
                parent.removeChild(parent.lastChild);
            }
        },
        /*
			This method is used to create an rotation object with the following parameters:
			x,y,z and the radian of the rotation
		*/
		createRotate : function(x,y,z,radian){
			var root = document.getElementById('MyXml3d');
            var rect = root.createXML3DVec3();
            rect.x=x;
            rect.y=y;
            rect.z=z;
            var rotate = root.createXML3DRotation();
            rotate.setAxisAngle(rect,radian);
			return rotate;
		},
        isNumeric:function (elem){
            return elem != null && elem != "" && (elem*1) == elem;
        },

		convertRgbToFloat:function(r,g,b){
			var rr = this.calculateRFGfloat(r);
			var gg = this.calculateRFGfloat(g);
			var bb = this.calculateRFGfloat(b);
			return rr+' '+gg+' '+bb;
		},
		calculateRFGfloat:function(x){
			return x/255.0;
		},

        /* strips leading and trailing whitespace (\s) */
        trimString: function (str){
            if (str.trim)
                return str.trim();
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },
    };
}();
