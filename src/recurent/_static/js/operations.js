var op=
{	
	nombre:null,defmt:2,
	anticipo:null,meses:null,mensualidad:null,monto:null,renovable:null,cuota_renovacion:null,autorenovable:null,ref_tipo:null,
	init:function()
	{
		op.nombre=document.querySelector("#nombre");
		op.anticipo=document.querySelector("#anticipo");
		op.meses=document.querySelector("#cantidad_pagos");
		op.mensualidad=document.querySelector("#pago_recurrente");
		op.monto=document.querySelector("#monto");
		op.renovable=document.querySelector("#renovable");
		op.cuota_renovacion=document.querySelector("#cuota_renovacion");
		op.autorenovable=document.querySelector("#autorenovable");
        this.form_tipo_plan=document.getElementById("form_tipo_plan");
        this.frecuency=document.getElementById("ref_rr_frecuencia");

        op.ref_tipo=document.querySelector("#ref_tipo");
		if(op.renovable)
		{
			op.renovable.addEventListener("change",function(){
				var checked=this.checked;
				if(checked){
					if(op.cuota_renovacion)op.cuota_renovacion.removeAttribute("readonly");
					if(op.autorenovable)op.autorenovable.removeAttribute("disabled");
				}
				else {
					if(op.cuota_renovacion)
					{
						op.cuota_renovacion.value=0;
						op.cuota_renovacion.setAttribute("readonly",true);
						op.autorenovable.setAttribute("disabled",true);
					}
				}
			});
		}
        if(op.ref_tipo)
        {
            op.ref_tipo.addEventListener("change",function(){
                if(this.value=="@" || this.value=="")return;
                model.getTipoPlan(this.value);
            });
            if(op.isnull)model.trigger(op.ref_tipo,"change");
        }
	},
	filterFloat:function(evt,input)
    {
        // Backspace = 8, Enter = 13, ‘0′ = 48, ‘9′ = 57, ‘.’ = 46, ‘-’ = 43
        var key = window.Event ? evt.which : evt.keyCode;    
        var chark = String.fromCharCode(key);
        var tempValue = input.value+chark;
        if(key >= 48 && key <= 57){
            if(op.filter(tempValue)=== false){
                return false;
            }else{       
                return true;
            }
        }else{
              if(key == 8 || key == 13 || key == 0) {     
                  return true;              
              }else if(key == 46){
                    if(op.filter(tempValue)=== false){
                        return false;
                    }else{       
                        return true;
                    }
              }else{
                  return false;
              }
        }
    },
    filter:function(__val__)
    {
        var preg = /^([0-9]+\.?[0-9]{0,4})$/; 
        if(preg.test(__val__) === true){
            return true;
        }else{
           return false;
        }
        
    },
    filterInt:function(evt,input)
    {
        // Backspace = 8, Enter = 13, ‘0′ = 48, ‘9′ = 57, ‘.’ = 46, ‘-’ = 43
        var key = window.Event ? evt.which : evt.keyCode;    
        var chark = String.fromCharCode(key);
        var tempValue = input.value+chark;
        if(key >= 48 && key <= 57){
            if(op.filterI(tempValue)=== false){
                return false;
            }else{       
                return true;
            }
        }else{
              if(key == 8 || key == 13 || key == 0) {     
                  return true;              
              }else if(key == 46){
                    if(op.filterI(tempValue)=== false){
                        return false;
                    }else{       
                        return true;
                    }
              }else{
                  return false;
              }
        }
    },
    filterI:function(__val__)
    {
        var preg = /^([0-9]+?[0-9]{0,6})$/; 
        if(preg.test(__val__) === true){
            return true;
        }else{
           return false;
        }
        
    },
    cal_monto:function()
    {
    	var anticipo=0;
    	var meses=0;
    	var mensualidad=0;
    	if(op.anticipo){anticipo=Number(op.anticipo.value);}
    	if(op.meses){meses=Number(op.meses.value);}
    	if(op.mensualidad){mensualidad=Number(op.mensualidad.value);}

    	var monto=(mensualidad * meses) + anticipo;

    	if(op.monto)
        {
            op.monto.value=op.round(monto,op.defmt);
            op.keyup(op.monto,"#dv-monto","",true);
        }
    },
    validate:function()
    {
        if(op.frecuency && op.frecuency.value.trim()=="")
        {
            op.frecuency.focus();
            util.messageBox("El campo frecuencia es requerido.");
            return false;
        }
    	if(op.nombre)
    	{
    		if(op.nombre.value=="")
    		{
    			op.nombre.focus();
    			util.messageBox("El campo nombre es requerido.");
    			return false;
    		}
    	}
    	if(op.meses)
    	{
    		if(Number(op.meses.value)<=0)
    		{
    			op.meses.focus();
    			util.messageBox("El campo cantidad de pagos debe ser mayor a 0");
    			return false;
    		}
    	}
    	if(op.mensualidad)
    	{
    		if(Number(op.mensualidad.value)<=0)
    		{
    			op.mensualidad.focus();
    			util.messageBox("El campo pago recurrente debe ser mayor a 0");
    			return false;
    		}
    	}
    	if(op.monto)
    	{
    		if(Number(op.monto.value)<=0)
    		{
    			op.monto.focus();
    			util.messageBox("El campo monto debe ser mayor a 0");
    			return false;
    		}
    	}
        

        return true;
    },
    keyup:function(ths,iddestino,simb="",ismonto=false)
    {
        var dest=document.querySelector(iddestino);
        var divisa=document.querySelector("#divisa");
        
        if(ths)
        {
            if(Number(ths.value)<=0)
            {
                if(dest)dest.innerHTML="";
                return;
            }
            
            var html="";
            if(divisa && simb=="")simb=divisa.value;
            var value=view.formatDiv(Number(ths.value),op.defmt,".",simb);
            switch(iddestino.replace("#",""))
            {
                case "dv-cuota_apertura":html=`<td id="${iddestino.replace("dv-","lbl-")}">Cuota de apertura </td><td  style="text-align: end;"> <b>${value}</b></td>`; break;
                case "dv-anticipo":html=`<td id="${iddestino.replace("dv-","lbl-")}">Anticipo </td><td style="text-align: end;"> <b>${value}</b></td>`; break;
                case "dv-meses":
                    let frecuency=model.dataTipoPlan? model.dataTipoPlan.frecuencia:"Meses";
                    html=`<td id="${iddestino.replace("dv-","lbl-")}">${frecuency}</td><td style="text-align: end;"> <b>${ths.value}</b></td>`; 
                    if(!view.desdebd)view.calFechaFin(Number(ths.value));
                    break;
                case "dv-mensualidad":html=`<td id="${iddestino.replace("dv-","lbl-")}">Pago recurrente ${view.htmlmensualidad ?? ""}</td><td style="text-align: end;"> <b>${value}</b></td>`; break;
                case "dv-monto":html=`<td id="${iddestino.replace("dv-","lbl-")}">Monto ${view.htmlmonto??""}</td><td style="text-align: end;"> <b>${value}</b></td>`; break;
            }
            if(dest)dest.innerHTML=`${html}`;
        }
        if(!ismonto)op.cal_monto();
    },
    format:function(number, decPlaces, decSep, thouSep)
    {
        decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
      decSep = typeof decSep === "undefined" ? "." : decSep;
      thouSep = typeof thouSep === "undefined" ? "," : thouSep;
      var sign = number < 0 ? "-" : "";
      var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
      var j = (j = i.length) > 3 ? j % 3 : 0;

      return sign +
          (j ? i.substr(0, j) + thouSep : "") +
          i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
          (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
    },
    formatDate:function(date) {
        console.log(date)
      return [
        date.getFullYear(),
        op.padTo2Digits(date.getMonth()+1),
        op.padTo2Digits(date.getDate()),
      ].join('-');
    },
    padTo2Digits:function(num) {
      return num.toString().padStart(2, '0');
    },
    round:function(num, decimales = 2) {
    var signo = (num >= 0 ? 1 : -1);
    num = num * signo;
    if (decimales === 0) //con 0 decimales
        return signo * Math.round(num);
    // round(x * 10 ^ decimales)
    num = num.toString().split('e');
    num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimales) : decimales)));
    // x * 10 ^ (-decimales)
    num = num.toString().split('e');
    return signo * (num[0] + 'e' + (num[1] ? (+num[1] - decimales) : -decimales));
}
}

