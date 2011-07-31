/*
	script: modalbox.js
	Author: Holger
	description: Handels the display of the dialog content.
*/

var X3D = X3D ? X3D : new Object();
X3D.dia = function() {
    //var x = 'something to check';
    return{
        pageWidth:function () {
            return window.innerWidth != null ? window.innerWidth
                    : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth
                            : document.body != null ? document.body.clientWidth : null;
        },
        pageHeight:function () {
            return window.innerHeight != null ? window.innerHeight
                    : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight
                            : document.body != null ? document.body.clientHeight : null;
        },
        posLeft:function () {
            return typeof window.pageXOffset != 'undefined' ? window.pageXOffset
                    : document.documentElement && document.documentElement.scrollLeft ? document.documentElement.scrollLeft
                            : document.body.scrollLeft ? document.body.scrollLeft : 0;
        },
        posTop:function () {
            return typeof window.pageYOffset != 'undefined' ? window.pageYOffset
                    : document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop
                            : document.body.scrollTop ? document.body.scrollTop : 0;
        },
        getElement:function (x) {
            return document.getElementById(x);
        },
        scrollFix:function () {
            var obol = this.getElement('ol');
            obol.style.top = this.posTop() + 'px';
            obol.style.left = this.posLeft() + 'px'
        },
        sizeFix:function () {
            var obol = this.getElement('ol');
            obol.style.height = this.pageHeight() + 'px';
            obol.style.width = this.pageWidth() + 'px';
        },
        kp:function (e) {
            ky = e ? e.which : event.keyCode;
            if (ky == 88 || ky == 120)
                this.hm();
            return false
        },
        inf:function (h) {
            tag = document.getElementsByTagName('select');
            for (i = tag.length - 1; i >= 0; i--)
                tag[i].style.visibility = h;
            tag = document.getElementsByTagName('iframe');
            for (i = tag.length - 1; i >= 0; i--)
                tag[i].style.visibility = h;
            tag = document.getElementsByTagName('object');
            for (i = tag.length - 1; i >= 0; i--)
                tag[i].style.visibility = h;
        },
        clearDia : function(){
            var obbxd = this.getElement('mbd');
            X3D.util.deleteAllChilds(obbxd);
            var button = document.getElementById('submitButton');
            button.setAttribute('onclick','X3D.dia.hm("box");');
            
        },
        sm: function (obl, wd, ht) {
            var h = 'hidden';
            var b = 'block';
            var p = 'px';
            var obol = this.getElement('ol');
            var obbxd = this.getElement('mbd');
            obbxd.innerHTML = this.getElement(obl).innerHTML;
            obol.style.height = this.pageHeight() + p;
            obol.style.width = this.pageWidth() + p;
            obol.style.top = this.posTop() + p;
            obol.style.left = this.posLeft() + p;
			
            obol.style.display = b;
            var tp = this.posTop() + ((this.pageHeight() - ht) / 2) - 12;
            var lt = this.posLeft() + ((this.pageWidth() - wd) / 2) - 12;
            var obbx = this.getElement('mbox');
            obbx.style.top = (tp < 0 ? 0 : tp) + p;
            obbx.style.left = (lt < 0 ? 0 : lt) + p;
            obbx.style.width = wd + p;
            obbx.style.height = ht + p;
			obbx.style.overflow = "auto";
            this.inf(h);
            obbx.style.display = b;
            return false;
        },
        hm:function () {
            var v = 'visible';
            var n = 'none';
            this.getElement('ol').style.display = n;
            this.getElement('mbox').style.display = n;
            this.inf(v);
            document.onkeypress = ''
            this.clearDia();
			this.active=false;
        },
        initmb:function () {
            var ab = 'absolute';
            var n = 'none';
            var obody = document.getElementsByTagName('body')[0];
            var frag = document.createDocumentFragment();
            var obol = document.createElement('div');
            obol.setAttribute('id', 'ol');
            obol.style.display = n;
            obol.style.position = ab;
            obol.style.top = 0;
            obol.style.left = 0;
            obol.style.zIndex = 998;
            obol.style.width = '100%';
            frag.appendChild(obol);
            var obbx = document.createElement('div');
            obbx.setAttribute('id', 'mbox');
            obbx.style.display = n;
            obbx.style.position = ab;
            obbx.style.zIndex = 999;
            var obl = document.createElement('span');
            obbx.appendChild(obl);
            var obbxd = document.createElement('div');
            obbxd.setAttribute('id', 'mbd');
            obl.appendChild(obbxd);
            frag.insertBefore(obbx, obol.nextSibling);
            obody.insertBefore(frag, obody.firstChild);
            //window.onscroll = this.scrollFix;
            //window.onresize = this.sizeFix;
			
        },
        getPreferredHeight : function(){
            var items = this.getElement('items');
            var count =0;
            if(items != null)count =items.childNodes.length;
            items = this.getElement('dialogContent');
            if(items != null)count = count + (items.childNodes.length/3+1);
            if(count != null && count >2){
                count = count*45;
				count=count+20;
                if(count >300) return 300; else return count;
            } else return 100;
        },
        showDialog:function (){
            //this.getElement('txt').innerHTML = content;
			this.active=true;
			this.active=true;
            this.sm('box',350,this.getPreferredHeight());
        },
		showConnectionDialog:function (){
            this.sm('box2',350,this.getPreferredHeight());
        },
		showEmptyDialog:function (){
            this.sm('box3',350,this.getPreferredHeight());
        },
        okSelected:function(){
            
        }
    }
}();
X3D.dia.active=false;
//window.onload = X3D.dia.initmb;

