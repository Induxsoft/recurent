var view=
{
	ref_tipo:null,ref_cliente:null,divisa:null,edivisa:null,lbltotal:null,
	finicio:null,ffin:null,dataCliente:null,pagar:null,dataVencidos:null,datavigentes:null,
	init:function()
	{
		view.ref_tipo=document.querySelector("#ref_tipo");
		view.ref_cliente=document.querySelector("#ref_cliente");
		view.edivisa=document.querySelector("#divisa");


		if(view.divisa && view.divisa!=null && view.divisa!="")
		{
			view.edivisa.value=view.divisa;
		}
		view.txtfiltro=document.querySelector("#txtfiltro");
		if(view.txtfiltro)view.txtfiltro.addEventListener("keyup",function(e){
			if(event.which===13)
            {
                view.filtroCliente()
            }
		});
		view.txtfiltro_refclient=document.querySelector("#ref_cliente_text");
		if(view.txtfiltro_refclient)view.txtfiltro_refclient.addEventListener("click",function(){
			view.showModal('#modalclientes');
		});

		view.finicio=document.querySelector("#inicio");
		if(view.finicio)view.finicio.addEventListener("change",function(){
			if(!op.meses)return;
				view.calFechaFin(Number(op.meses.value));
		});

	},

	loadDataTipoPlan:function(data,onlykeyup=true,desdebd=false)
	{
		var divisa=data.divisa ?? "";
		var dest=document.querySelector("#fields-adic");
		if(dest && onlykeyup)dest.innerHTML="";
		
		let text_frecuency=document.getElementById("text_frecuency");
		if(text_frecuency)text_frecuency.innerText=data.frecuencia??"";

		for(var key in data)
		{
			var elem=document.querySelector(`#${key}`);
			if((key=="sys_pk" || key=="sys_recver") && elem)continue;
			if(elem)
			{
				if(elem)
				{
					if(elem.type=="checkbox"){
						if(data[key])elem.checked=data[key];
						else elem.checked=data[key];
					}
					else
						elem.value=data[key];
				}
				if(key=="comision")
					op.keyup(elem,'#dv-cuota_apertura',divisa);
				else if(key=="anticipo")
					op.keyup(elem,'#dv-anticipo',divisa);
				else if(key=="cantidad_pagos")
					op.keyup(elem,'#dv-meses',divisa);
				else if(key=="pago_recurrente")
					op.keyup(elem,'#dv-mensualidad',divisa);
				else if(key=="monto")
					op.keyup(elem,'#dv-monto',divisa);
			}
			if(!onlykeyup)continue;

			if(key=="cantidad_pagos" && !desdebd)
			{
				view.calFechaFin(data[key]);
			}

			var attr="";
			var fields={}
			var fieldshidden={}
			fields[key.replace("txt_","")]=data[key];
			fieldshidden[key]=data[key];
			if(key=="txt_clave1")
			{
				if(data.req_clave1)attr="required='true'";
				view.createFieldsAditionals(fields,dest,attr);
				attr="type='hidden'"
				view.createFieldsAditionals(fieldshidden,dest,attr,false,true);
			}
			if(key=="txt_clave2")
			{
				if(data.req_clave2)attr="required='true'";
				view.createFieldsAditionals(fields,dest,attr);
				attr="type='hidden'"
				view.createFieldsAditionals(fieldshidden,dest,attr,false,true);
			}
			if(key=="txt_clave3")
			{
				if(data.req_clave3)attr="required='true'"
				view.createFieldsAditionals(fields,dest,attr);
				attr="type='hidden'"
				view.createFieldsAditionals(fieldshidden,dest,attr,false,true);
			}
			if(key=="txt_clave4")
			{
				if(data.req_clave4)attr="required='true'";
				view.createFieldsAditionals(fields,dest,attr);
				attr="type='hidden'"
				view.createFieldsAditionals(fieldshidden,dest,attr,false,true);
			}
			if(key=="txt_clave5")
			{
				if(data.req_clave5)attr="required='true'";
				view.createFieldsAditionals(fields,dest,attr);
				attr="type='hidden'"
				view.createFieldsAditionals(fieldshidden,dest,attr,false,true);
			}
		}
	},
	getLocalDateString:function(date_str)
    {
        let date = new Date(date_str);
        date.setDate(date.getDate()+1);

        return date.toLocaleDateString();
    },
	calFechaFin:function(meses)
	{
		if(!view.finicio)view.finicio=document.querySelector("#inicio");
		if(!view.ffin)view.ffin=document.querySelector("#fin");
		let cantidad_pagos=document.getElementById("cantidad_pagos");
		
		if(view.finicio)
		{
			if(view.finicio.value=="")return;
			var mes=meses-1;
			
			model.GetLastVencimiento(view.finicio.value,cantidad_pagos.value,0,view.ref_tipo.value,
			(data)=>
			{
				if(data && data.last_vencimiento)view.ffin.value=data.last_vencimiento;
				else if(view.ffin)view.ffin.value=moment(view.finicio.value).add(mes, 'month').format('yyyy-MM-DD');
			});
		}
	},
	_calFechaFin_:function(meses,objinicio,objfin)
	{
		if(!objinicio)return;
		if(objinicio.value=="")return;
		
		meses=meses - 1;
		// var dt=new Date(objinicio.value)
		// dt.setMonth(dt.getMonth() + meses);
		// let dateFormated = dt.toISOString().slice(0,10);
		if(objfin)objfin.value=moment(objinicio.value).add(meses, 'month').format('yyyy-MM-DD');
	},
	createFieldsAditionals:function(data,destino,attributes="",omitempty=false,valinput=false)
	{
		if(data==null)return;

		var html="";
		var dest=destino;//document.querySelector(iddestino);
		
		for(var key in data)
		{

			if(key.trim()=="" || data[key].trim()=="" && !omitempty)continue;
			var valuelbl=!valinput ? data[key] :"";
			if(data.caption)valuelbl=data.caption;
			var valueinput=valinput ? data[key] :"";

			if(valuelbl.replace(/\s+/g,"")==valueinput.replace(/\s+/g,""))continue;

			html+=`<div class="col-lg-4 mb-2" style="gap:10px">
					<label class="d-flex" form="${key}">${valuelbl}</label>
					<input class="form-control form-control-sm" ${attributes} name="${key}" maxlength="50" id="${key}" value="${valueinput}">
					</div>`;
		}
		if(dest)dest.innerHTML+=html;
	},
	createFieldsAditionalsList:function(datalist,destino,attributes="",omitempty=false,valinput=false)
	{
		if(datalist==null)return;

		var html="";
		var dest=destino;//document.querySelector(iddestino);
		
		for(var i=0;i<datalist.length;i++)
		{
			var data=datalist[i];

			for(var key in data)
			{

				// if(key.trim()=="" || data[key].trim()=="" && !omitempty)continue;
				if(key=="attributes"){continue;}

				var valuelbl=!valinput ? data[key] :"";
				if(data.caption)valuelbl=data.caption;
				var valueinput=valinput ? data[key] :"";

				if(valuelbl.replace(/\s+/g,"")==valueinput.replace(/\s+/g,""))continue;

				html+=`<div class="col-lg-4 mb-2" style="gap:10px">
						<label class="d-flex" form="${key}">${valuelbl}</label>
						<input class="form-control form-control-sm" ${attributes} ${data.attributes??""} name="${key}" maxlength="50" id="${key}" value="${valueinput}">
						</div>`;
			}
		}
		if(dest)dest.innerHTML+=html;
	},
	filtroCliente:function()
	{
		var filtro=document.querySelector("#txtfiltro");
		if(filtro)
		{
			if(filtro.value=="")
			{
				filtro.focus();
				util.messageBox("Campo de busqueda vacío");
				return;
			}
			model.filtroCliente(filtro.value);
		}
	},
	showModal:function(idmodal)
	{
		$(idmodal).modal("show");
	},
	hideModal:function(idmodal)
	{
		$(idmodal).modal("hide");
	},
	loadTable:function(data,idtable)
	{
		var table=document.querySelector(idtable);
		if(!table)return;

		var html="";
		view.dataCliente=data;

		for(var i=0;i<data.length;i++)
        {
        	var rfc=data[i].rfc==null ? "":data[i].rfc;
        	var curp=data[i].curp==null ? "":data[i].curp;
        	var email=data[i].email==null ? "":data[i].email;
            html+=`<tr class='row_case' onclick='view.selectRowCliente(`+data[i].sys_pk+`)' ><td>`+data[i].codigo+`</td>
                <td>`+data[i].nombre+`</td>
                <td>`+rfc+`</td>
                <td>`+curp+`</td>
                <td>`+email+`</td>
                </tr>
            `;
        }
        table.innerHTML=html;
	},
	selectRowCliente:function(sys_pk)
	{
		var cliente=document.querySelector("#ref_cliente");
		var ctext=document.querySelector("#ref_cliente_text");
		if(cliente)
		{
			if(view.dataCliente==null)return;

			for (var i =0; i <view.dataCliente.length; i++) 
			{
				var itm=view.dataCliente[i];
				if(itm.sys_pk===sys_pk)
				{
					ctext.value="["+itm.codigo+"] "+itm.nombre;
					cliente.value=itm.sys_pk;
					view.hideModal("#modalclientes");
					break;
				}
			}
		}
	},
	validate:function()
	{
		if(view.ref_tipo)
		{
			if(view.ref_tipo.value=="")
			{
				util.messageBox("El campo tipo plan es requerido.");
				return false;
			}
		}
		if(view.ref_cliente)
		{
			if(view.ref_cliente.value=="")
			{
				util.messageBox("El campo cliente es requerido.");
				return false;
			}
		}
		return op.validate();
	},
	formatDiv:function(number,dec,decsep,simb)
	{
		return op.format(number,dec,decsep)+` ${simb} `;
	},
	disabledAll:function(disabled=false)
	{
		var elements=document.querySelectorAll("#frm-plan input,select,textarea,button");
		for (var i = 0; i< elements.length; i++)
		{
			var elm=elements[i];
			if(elm)
			{
				if(elm.hasAttribute("nodisabled"))continue;
				if(disabled){
					elm.setAttribute("disabled",true);
				}
				else{elm.removeAttribute("disabled");}
			}
		}
	},
	EditClient:function(edit)
	{
		if(!edit)return;

		 view.c=document.querySelector("#ref_cliente_text");
		view.sc=document.querySelector("#btn-search-client");
		view.btnace=document.querySelector("#btnaceptarform");
		var btnfter=document.querySelector("#filtroclient");
		view.ref_cliente=document.querySelector("#ref_cliente");

		if(view.ref_cliente)view.ref_cliente.removeAttribute("disabled");
		if(btnfter)btnfter.removeAttribute("disabled");
		if(view.c)view.c.removeAttribute("disabled");
		if(view.sc)view.sc.removeAttribute("disabled");
		if(view.btnace){
			view.btnace.setAttribute("onclick","view.saveClient()");
			view.btnace.removeAttribute("disabled");
		}
		view.pkc=document.querySelector("#sys_pk");
		view.sysrecver=document.querySelector("#sys_recver");

		if(view.pkc)view.pkc.removeAttribute("disabled");
		if(view.sysrecver)view.sysrecver.removeAttribute("disabled");
	},
	saveClient:function()
	{
		let form = document.createElement('form');
		form.action = './?aviso=1&client=1';
		form.method = 'POST';

		var html=`${view.ref_cliente.outerHTML}`+view.sysrecver.outerHTML+view.pkc.outerHTML;
		form.innerHTML = html;
		// el formulario debe estar en el document para poder enviarlo
		document.body.append(form);
		
		form.submit();
	},
	statusPlanes:function(status)
	{
		var st="";
		switch(status)
		{
			case 0:st="Borrador"; break;
			case 1:st="Vigente"; break;
			case 2:st="Cancelado"; break;
			case 3:st="Cumplido"; break;
		}
		return st;
	},
	showhidecontrols:function(id,status)
	{
		var play=document.querySelector("#play_"+id);
		var edit=document.querySelector("#edit_"+id);
		var delet=document.querySelector("#delete_"+id);
		var view=document.querySelector("#view_"+id);
		var cancel=document.querySelector("#cancel_"+id);
		var lblstatus=document.querySelector("#lbl_status_"+id)
		
		if(status!=1 && status!=2)return;
		if(lblstatus)lblstatus.innerHTML=this.statusPlanes(status);
		switch(status)
		{
			case 2:
				if(cancel)cancel.remove();
				break;
			default:
				if(play)play.remove();
				if(edit)edit.remove();
				if(delet)delet.remove();
				if(view)view.style.display="block";
				if(cancel)cancel.style.display="block";
				break;
		}
	},
	redirec:function(url)
	{
		window.location.href=url;
	},
	disabledAviso:function(disabled=false)
	{
		var email=document.querySelector("#email");
		var email1=document.querySelector("#email1");
		var tel=document.querySelector("#telefono");
		var tel1=document.querySelector("#telefono1");

		var bntsave=document.querySelector("#btnsaveaviso");
		var cancel=document.querySelector("#btncancelaviso");
		var btnedit=document.querySelector("#btneditaviso");

		// console.log(email.outerHTML);
		if(!disabled)
		{
			if(email)email.removeAttribute("disabled");
			if(email1)email1.removeAttribute("disabled");
			if(tel)tel.removeAttribute("disabled");
			if(tel1)tel1.removeAttribute("disabled");
			if(bntsave){
				bntsave.setAttribute("onclick","view.saveAviso();")
				bntsave.style.display="";
			}
			if(cancel){
				cancel.setAttribute("onclick","view.disabledAviso(true);");
				cancel.style.display="";
			}
			if(btnedit)btnedit.style.display="none";
		}
		else
		{
			if(btnedit)btnedit.style.display="block";
			if(cancel)cancel.style.display="none";
			if(bntsave)bntsave.style.display="none";

			if(email)email.setAttribute("disabled",true);
			if(email1)email1.setAttribute("disabled",true);
			if(tel)tel.setAttribute("disabled",true);
			if(tel1)tel1.setAttribute("disabled",true);
		}
	},
	saveAviso:function()
	{
		var email=document.querySelector("#email");
		var email1=document.querySelector("#email1");
		var tel=document.querySelector("#telefono");
		var tel1=document.querySelector("#telefono1");
		var sys_pk=document.querySelector("#sys_pk");
		var sys_recver=document.querySelector("#sys_recver");

		if(sys_pk)sys_pk.removeAttribute("disabled");
		if(sys_recver)sys_recver.removeAttribute("disabled");

		let form = document.createElement('form');
		form.action = './?aviso=1';
		form.method = 'POST';

		var html=`<input type="email" class="form-control form-control-sm" name="email" id="email" value="${email.value}">
		<input type="email1" class="form-control form-control-sm" name="email1" id="email1" value="${email1.value}">
		<input type="telefono" class="form-control form-control-sm" name="telefono" id="telefono" value="${tel.value}">
		<input type="telefono1" class="form-control form-control-sm" name="telefono1" id="telefono1" value="${tel1.value}">`+sys_pk.outerHTML+ sys_recver.outerHTML;
		form.innerHTML = html;
		// el formulario debe estar en el document para poder enviarlo
		document.body.append(form);

		form.submit();
	},
	iniPagar:function()
	{
		view.lbltotal=document.querySelector("#lbltotal");
		view.pagar=document.querySelector("#pagar");
		view.metodopago=document.querySelector("#formapago");
		view.referencia=document.querySelector("#referencia");
		view.importe=document.querySelector("#importe");
		view.fecha=document.querySelector("#fecha");
		view.divisa=document.querySelector("#moneda");
		view.notas=document.querySelector("#notas");
		view.ref_plan=document.querySelector("#ref_plan");
		view.lblcambio=document.querySelector("#lblcambio");
		view.total=0;

		//***********************modales*********************
		view.modalcobrar=document.querySelector("#modalcobrar");
		view.modalquita=document.querySelector("#modalquita");
		view.modalrenovacion=document.querySelector("#modalrenovacion");
		view.modalcargo=document.querySelector("#modalcargo");
		//************************************************

		view.oppagar="";
		view.formap="";

		//********************attributes quita**************
		view.metodopago_quita=document.querySelector("#formapago_quita");
		view.importe_quita=document.querySelector("#importe_quita");
		view.fecha_quita=document.querySelector("#fecha_quita");
		view.notas_quita=document.querySelector("#notas_quita");
		view.isquita=false;
		// *****************************************************

		//eventos de modal quita*****
		if(view.modalquita)
		{
			view.filequita=document.querySelector("#file_name_quita");
			view.lblfilequita=document.querySelector("#lblnamefile_quita");
			if(view.filequita)view.filequita.addEventListener("change",function(){
				view.ShowNameFile(this.files,view.lblfilequita);
			});
			view.modalquita.addEventListener("shown.bs.modal",function(){
				view.isquita=true;
				view.lblfilequita.innerHTML="";
				view.filequita.value="";
			});
			view.modalquita.addEventListener("hide.bs.modal",function(){
				view.isquita=false;
			});
		}
		//****************attibutes renovacion*******************
		view.meses_renovacion=document.querySelector("#meses_renovacion");
		view.mensualidad_renovacion=document.querySelector("#mensualidad_renovacion");
		view.cuota_renovacion_modal=document.querySelector("#cuota_renovacion_modal");
		view.finicio_renovacion=document.querySelector("#inicio_renovacion");
		view.ffin_renovacion=document.querySelector("#fin_renovacion");
		view.importe_renovacion=document.querySelector("#importe_renovacion");
		op.meses=view.meses_renovacion;
		op.mensualidad=view.mensualidad_renovacion;
		op.monto=view.importe_renovacion;
		view.isrenovacion=false;
		///evento
		if(view.modalrenovacion)
		{
			view.modalrenovacion.addEventListener("shown.bs.modal",function(){view.isrenovacion=true;});
			view.modalrenovacion.addEventListener("hide.bs.modal",function(){view.isrenovacion=false;});
		}

		//*********************attributes cargo**************************
		view.importe_cargo=document.querySelector("#importe_cargo");
		view.tipomovimiento_cargo=document.querySelector("#tipomovimiento_cargo");
		view.concepto_cargo=document.querySelector("#concepto_cargo");
		view.notas_cargo=document.querySelector("#notas_cargo");
		view.vencimiento_cargo=document.querySelector("#vencimiento_cargo");
		view.iscargo=false;

		//eventos
		if(view.modalcargo)
		{
			view.modalcargo.addEventListener("shown.bs.modal",function(){view.iscargo=true});
			view.modalcargo.addEventListener("hide.bs.modal",function(){view.iscargo=false});
		}
		///***********************************************************
		if(view.finicio_renovacion && view.ffin_renovacion)
		{
			view._calFechaFin_(view.meses_renovacion.value,view.finicio_renovacion,view.ffin_renovacion)
		}
		if(view.meses_renovacion)view.meses_renovacion.addEventListener("keyup",function(){
			op.cal_monto();
		});
		if(view.mensualidad_renovacion)view.mensualidad_renovacion.addEventListener("keyup",function(){
			op.cal_monto();
		});
		//*********************************************
		view.filecobrar=document.querySelector("#file_name_cobrar");
		view.lblfilef=document.querySelector("#lblnamefile_cobrar");
		if(view.filecobrar)view.filecobrar.addEventListener("change",function(){
			view.ShowNameFile(this.files,view.lblfilef);
		});
		if(view.modalcobrar)view.modalcobrar.addEventListener("shown.bs.modal",function(){
			view.resetControlsCobrar();
			model.trigger(view.pagar,"change");
			model.trigger(view.metodopago,"change");
			if(view.lblfilef)view.lblfilef.innerHTML="";
			view.lblfilef.value="";
		});
		if(view.pagar)view.pagar.addEventListener("change",function(){
			view.oppagar=this.value;
			view.optionPagar(this.value);
			view.formaPagoPagar();
		});
		view.isefectivo=false;
		if(view.metodopago)view.metodopago.addEventListener("change",function(){
			view.formap=this.value;
			if(this.value!="01")
			{
				view.isefectivo=false;
				view.enabledElement("#referencia",true);
				if(view.referencia)view.referencia.value="";view.referencia.focus();
				view.enabledElement("#fecha",false);
			}else
			{
				view.isefectivo=true;
				view.enabledElement("#referencia",false);
				if(view.referencia)view.referencia.value="NA";
				if(view.oppagar=="a")view.enabledElement("#fecha",true);
			}
			view.formaPagoPagar();

		});

			model.trigger(view.pagar,"change");
			model.trigger(view.metodopago,"change");
			view.formaPagoPagar();

		//****************modal edit monto**********************
			view.modaleditmonto=document.getElementById("modaleditmonto");
			view.newimporte=document.getElementById("monto_edit");
			view.modoafectacion=document.getElementById("smodoafect");
			view.apartirde=document.getElementById("sapartitmensualidad");
			view.notasedit=document.getElementById("txtnotaseditmonto");
			view.dvapartirde=document.getElementById("div-apartirde");
			//*******************eventos***********
			if(view.modaleditmonto)
			{
				view.modaleditmonto.addEventListener("shown.bs.modal",function(){
					if(view.modoafectacion)view.modoafectacion.value="01";
					model.trigger(view.modoafectacion,"change");
					if(view.newimporte)view.newimporte.value=view.montoplan;
					if(view.notasedit)view.notasedit.value="";
					if(view.apartirde)view.apartirde.selectedIndex=0;
				});

				view.modaleditmonto.addEventListener("shown.bs.modal",function(){
					
				});
			}
			if(view.modoafectacion)view.modoafectacion.addEventListener("change",function(){
				if(this.value=="02")
				{
					// if(view.apartirde)view.apartirde.removeAttribute("disabled");
					if(view.dvapartirde)view.dvapartirde.classList.remove("d-none");
				}else{if(view.dvapartirde)view.dvapartirde.classList.add("d-none");}//if(view.apartirde)view.apartirde.setAttribute("disabled",true);
			});
				view.montoupdated=0;
		//******************************************************
	},
	ShowNameFile:function(files,lblfilef=null)
	{
		if(lblfilef==null)
			var lblfilef=document.querySelector("#lblnamefile");
		if(lblfilef)lblfilef.innerHTML=files[0].name;
	},
	optionPagar:function(option)
	{
		// var total=0;
		if(!view.lbltotal)return;
		view.lbltotal.innerHTML="";
		view.enabledElement("#fecha",false);
		switch(option)
		{
			case "a":
				if(view.importe)
				{
					view.importe.value="";
					view.importe.removeAttribute("disabled");
					view.importe.focus();
				}
				view.enabledElement("#fecha",true);
				break;
			case "b":
				view.total=view.totalvencidos;
				view.lbltotal.innerHTML=`Total a pagar:<b> ${view.formatDiv(view.totalvencidos,op.defmt,".",view.moneda)}</b>`;
				if(view.importe){
					view.importe.value=view.totalvencidos;
				}
				break;
			case "c":
				view.total=view.nextmensualidad;
				view.lbltotal.innerHTML=`Total a pagar:<b> ${view.formatDiv(view.nextmensualidad,op.defmt,".",view.moneda)}</b>`;
				if(view.importe)view.importe.value=view.nextmensualidad;
				break;
			case "d":
				view.total=view.totalvencidos + view.nextmensualidad;
				view.lbltotal.innerHTML=`Total a pagar:<b> ${view.formatDiv(view.totalvencidos + view.nextmensualidad,op.defmt,".",view.moneda)}</b>`;
				if(view.importe){
					view.importe.value=view.totalvencidos + view.nextmensualidad;
				}
				break;
		}
	},
	enabledElement:function(idelement,enabled=true)
	{
		var elem=document.querySelector(idelement);
		if(enabled)
		{
			if(elem)elem.removeAttribute("disabled");
		}
		else
		{
			if(elem)elem.setAttribute("disabled",true);
		}
	},
	formaPagoPagar:function()
	{
		view.lblcambio.innerHTML="";
		if( view.pagar.value!="" && view.pagar.value!="a")//view.formap!="01" && view.formap!="" &&
		{
			view.enabledElement("#importe",false);
		}
		else if(view.pagar.value=="a" || view.formap=="01"){view.enabledElement("#importe",true);}
	},
	validateCobrar:function()
	{
		if(view.referencia.value=="")
		{
			view.referencia.focus();
			util.messageBox("El campo referencia es requerido.");
			return false;
		}
		if(view.isquita)
		{
			if(Number(view.importe_quita.value)<=0)
			{
				util.messageBox("Coloque el monto a pagar.");
				view.importe_quita.focus();
				return false;
			}
		}
		if(view.iscargo)
		{
			if(Number(view.importe_cargo.value)<=0)
			{
				util.messageBox("Coloque un importe.");
				view.importe_cargo.focus();
				return false;
			}
			if(view.concepto_cargo.value=="")
			{
				util.messageBox("Coloque un concepto.");
				view.concepto_cargo.focus();
				return false;
			}
		}
		else
		{
			if(Number(view.importe.value)<=0)
			{
				util.messageBox("Coloque el monto a pagar.");
				view.importe.focus();
				return false;
			}
		}
		
		return true;
	},
	resetControlsCobrar:function()
	{
		// view.lbltotal
		// view.pagar
		// view.metodopago
		if(view.referencia)
		{
			if(view.referencia.value!="")view.referencia.value="NA";
		}
		if(view.importe)
		{
			if(view.importe.value!="")view.importe.value="";
		}
		if(view.notas)
		{
			if(view.notas.value!="")view.notas.value="";
		}
		// view.fecha
		// view.divisa
		
		// view.ref_plan
	},
	cambio:function()
	{
		if(view.pagar.value=="a")return;
		
		if(Number(view.importe.value)>view.total)
		{
			var cambio=Number(view.importe.value)-view.total;
			view.lblcambio.innerHTML=`Cambio: $ ${op.format(cambio,op.defmt,".",",") }`;
		}
		else
		{
			view.lblcambio.innerHTML="";
		}
	},
	editConceptos:function(id,desc)
	{
		var concepto=document.querySelector("#const");
		if(!concepto)return;

		var btnaddc=document.querySelector("#btnaddconceptos_");
		concepto.value=desc;
		btnaddc.setAttribute("onclick","model.saveConcepto("+id+")");
		view.showModal('#modalconceptos');
	},
	detailCardex:function(data)
	{
		for(var key in data)
		{
			var elem=document.querySelector(`#div-detail-cardex #${key}`);
			if(elem && key!="concepto")elem.innerHTML=" $ "+op.format(data[key],op.defmt,".");
			else if (elem) {elem.innerHTML=data[key];}
			if(key=="detallespagos")
			{
				var detail=document.querySelector("#detail-pagos");

				var pagos=data[key];
				var html="";
				for(var j=0;j<pagos.length;j++)
				{
					var pg=pagos[j];
					html+=`<small class="d-flex">${pg.fecha_formad} <b style="padding-left: 10px;padding-right: 10px;">$ ${op.format(pg.importe,op.defmt,".")} </b> ${pg.formapago} </small>`;
				}
				if(detail)detail.innerHTML=html;
			}
		}
		view.showModal('#modaldetallecardex')
	},
	filterIngresos:function()
	{
		var finicio=document.querySelector("#fechainicial");
		var ffin=document.querySelector("#fechafin");

		var url=`./?_finicio=${finicio.value}&_ffin=${ffin.value}`;

		view.redirec(url);
	},
	calMonto:function()
	{
		var mensualidad=view.newimporte.value;
		var anticipo=view.anticipoactual;
		var meses=view.mesesactual;
		
		var monto=(Number(mensualidad)* Number(meses))+Number(anticipo);
		view.montoupdated=monto;
		document.getElementById("montoactual").innerHTML="$ "+op.format(monto,op.defmt,".",",");
	},
	initFile:function()
	{
		view.fileplan=document.querySelector("#file_name_plan");
		if(view.fileplan)view.fileplan.addEventListener("change",function(){
			model.uploadFile();
		});

	}
}