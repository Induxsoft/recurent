var model =
{
  dataTipoPlan: null,
  invoke_service_file: function (url, data) {
    $.ajax({
      type: 'POST',
      data: data,
      processData: false,
      contentType: false,
      url: url,
      success: function (data) {
        console.log(data);

      },
      error: function (error) {
        console.log(error);
      }
    });
  },
  invoke_service: function (url, params, callback_success, callback_fail, http_method, reload = true, async = true, autorizations = "", formdata = false) {
    if (!http_method) http_method = "POST";

    request = {
      type: http_method,
      url: url,
      contentType: "application/json;charset=utf-8;",
      async: async,
      crossDomain: true,

      success: function (r, textStatus, xhr) {
        if (http_method == "DELETE" && (r == null || r == "undefined")) {
          callback_success(r)
          return;
        }
        var res = JSON.parse(JSON.stringify(r));

        if (res.success) {
          if (callback_success)
            callback_success(res.data);
        }
        else if (!res.success && res.success != null && res.success != undefined) {
          if (callback_fail)
            callback_fail(res);
        }
        else {
          if (xhr.status >= 200 && xhr.status < 300) {
            if (callback_success) callback_success(r)
          }
          else {
            if (callback_fail)
              callback_fail(res);
          }


        }
      },
      error: function (r) {
        util.messageBox("Ocurrió un error al invocar el servicio.\n\r" + JSON.stringify(r));
      }
    };

    if (autorizations) {
      request.headers = { 'Authorization': autorizations };
    }

    if (formdata) {
      request.processData = false;
      request.contentType = false;
      request.data = params;
    }
    if (params && !formdata) {
      request.dataType = "json";
      request.data = JSON.stringify(params);
    }

    $.ajax(request).always(function () {
      if (reload)
        location.reload();
    });
  },
  trigger: function (element, event) {
    var e = new Event(event);
    if (element) element.dispatchEvent(e);
  },
  deleteEntity: function (sys_pk, e, ub_entity) {
    var r = util.confirmBox("¿Esta seguro de eliminar esta entidad?");
    if (!r) return;

    if (ub_entity == "") ub_entity = "/";

    model.invoke_service("." + ub_entity + sys_pk, null,
      function (data) {
        window.location.reload();
      },
      function (error) {
        util.messageBox(error.message ?? error);
      }, "DELETE", false);
  },
  getTipoPlan: function (sys_pk) {
    model.invoke_service("../../rr_tipo_plan_mensual/" + sys_pk, null,
      function (data) {
        model.dataTipoPlan = data;
        view.loadDataTipoPlan(data);
      },
      function (error) {
        util.messageBox(error.message ?? error);
      }, "GET", false);
  },
  filtroCliente: function (texto) {
    model.invoke_service("../../cliente/?text_filter=" + texto, null,
      function (data) {
        var dt = document.querySelector("#table-body-clientes");
        if ((data == null || data.length <= 0) && dt) {

          dt.innerHTML = '<tr><td colspan="11" class="col-12" style="text-align:center"><h4>No hay datos</h4></td></tr>';
          return;
        }
        view.loadTable(data, "#table-body-clientes");
      },
      function (error) {
        util.messageBox(error.message ?? error);
      }, "GET", false);
  },
  actionControl: function (sys_pk, e, ub_entity, act = "activar", reload = false) {
    if (ub_entity == "") ub_entity = "/";
    if (act == "") act = "activar";
    if (act == "cancelar") {
      var res = util.confirmBox("¿Esta seguro de realizar el proceso?");
      if (!res) return;
    }
    model.invoke_service("." + ub_entity + sys_pk + "?" + act + "=1", null,
      function (data) {
        if (data != null) {
          if (reload) {
            window.location.reload();
            return;
          }
          if (act == "activar") {
            var rl = "";
            if (ub_entity == "/") rl = "../rr_plan_mensual_cardex/?_plan=" + sys_pk + "&_cardex=1";
            else { rl = "./rr_plan_mensual_cardex/?_plan=" + sys_pk + "&_cardex=1"; }
            window.location.href = rl;
          }
          view.showhidecontrols(data.sys_pk, (data.status ?? 0));
        }
      },
      function (error) {
        util.messageBox(error.message ?? error);
      }, "GET", false);
  },
  savePago: function () {
    if (!view.validateCobrar()) return;

    var fdata = new FormData();

    if (view.isquita) {
      var adjuntos = document.querySelector("#file_name_quita");
      if (adjuntos.files.length != 0) {
        var file = adjuntos.files[0];
        fdata.append(file.name, file);
      }

      var data =
      {
        formapago: view.metodopago_quita.value,
        importe: view.importe_quita.value,
        fecha: view.fecha_quita.value,
        notas: view.notas_quita.value,
        ref_plan: view.ref_plan.value
      }
    }
    else {

      var adjuntos = document.querySelector("#file_name_cobrar");
      if (adjuntos.files.length != 0) {
        var file = adjuntos.files[0];
        fdata.append(file.name, file);
      }

      var data =
      {
        formapago: view.metodopago.value,
        importe: view.importe.value,
        divisa: view.divisa.value,
        fecha: view.fecha.value,
        referencia: view.referencia.value,
        notas: view.notas.value,
        ref_plan: view.ref_plan.value
      }

    }

    for (var key in data) {
      fdata.append(key, data[key]);
    }

    model.invoke_service("../rr_plan_mensual_pago/", fdata,
      function (data) {
        if (data != null) {
          view.hideModal("#modalcobrar");
          window.location.reload();
        }
      },
      function (error) {
        util.messageBox(error.message ?? error);
      }, "POST", false, true, "", true);
  },
  saverenovacion: function (sys_pk) {
    var data = {
      inicio: view.finicio_renovacion.value,
      fin: view.ffin_renovacion.value,
      meses: view.meses_renovacion.value,
      mensualidad: view.mensualidad_renovacion.value,
      monto: view.importe_renovacion.value,
      cuota_renovacion: view.cuota_renovacion_modal.value,
      historial: true
    }
    model.invoke_service("../rr_plan_mensual/" + sys_pk + "/?historial=1", data,
      function (data) {
        if (data != null) {
          window.location.reload();
        }
      },
      function (error) {
        util.messageBox(error.message ?? error);
      }, "PUT", false);
  },
  restablecerPagos: function (sys_pk) {
    // var res=util.confirmBox("¿Esta seguro de realizar este proceso?");
    // if(!res)return;

    model.invoke_service("./" + sys_pk + "/", null,
      function (data) {
        if (data != null) {
          window.location.reload();
        }
      },
      function (error) {
        util.messageBox(error.message ?? error);
      }, "GET", false);
  },
  saveCargo: function () {
    if (!view.validateCobrar()) return;

    var data =
    {
      ref_plan: view.ref_plan.value,
      tipo_movimiento: view.tipomovimiento_cargo.value,
      importe: view.importe_cargo.value,
      concepto: view.concepto_cargo.value,
      vencimiento: view.vencimiento_cargo.value,
      cargo: true
    }
    model.invoke_service(".", data,
      function (data) {
        if (data != null) {
          window.location.reload();
        }
      },
      function (error) {
        util.messageBox(error.message ?? error);
      }, "POST", false);
  },
  saveConcepto: function (id = "") {
    var concepto = document.querySelector("#const");
    if (!concepto) return;

    if (concepto.value == "") {
      util.messageBox("Escriba un concepto.");
      concepto.focus();
      return;
    }

    var data = {
      const: concepto.value
    }
    var method = "POST";
    var url = ".";
    if (Number(id) > 0) {
      method = "PUT";
      data["id"] = id;
      url = "./" + id
    }


    model.invoke_service(url, data,
      function (data) {
        if (data != null) {
          window.location.reload();
        }
      },
      function (error) {
        util.messageBox(error.message ?? error);
      }, method, false);
  },
  detailCardex: function (sys_pk) {
    model.invoke_service("./" + sys_pk + "/?_detail=1", null,
      function (data) {
        if (data != null) {
          view.detailCardex(data);
        }
      },
      function (error) {
        util.messageBox(error.message ?? error);
      }, "GET", false);
  },
  saveMonto: function () {
    if (Number(view.newimporte) < .01) {
      util.messageBox("El campo importe es requerido.");
      return;
    }

    var data = {
      modo: view.modoafectacion.value,
      importe: view.newimporte.value,
      apartirde: view.apartirde.value,
      notas: view.notasedit.value,
      monto: view.montoupdated
    }
    model.invoke_service(`../rr_plan_mensual/${view.ref_plan.value}/?changemonto=1`, data,
      function (data) {
        if (data != null) {
          window.location.reload();
        }
      },
      function (error) {
        util.messageBox(error.message ?? error);
      }, "PUT", false);
  },
  uploadFile: function () {
    var fdata = new FormData();
    for (var i = 0; i < view.fileplan.files.length; i++) {
      var file = view.fileplan.files[i];
      fdata.append(file.name, file);
    }
    fdata.append("ref_plan", view.ref_plan.value);
    fdata.append("files", true);

    model.invoke_service("../rr_plan_mensual_pago/", fdata,
      function (data) {
        if (data != null) {
          window.location.reload();
        }
      },
      function (error) {
        util.messageBox(error.message ?? error);
      }, "POST", false, true, "", true);
  },
  getDataWorkspace: function () {
    var data =
    {
      ids: model.ids,
      operation: "list",
      workspace: model.workspace
    }
    model.invoke_service(model.url_ws, data,
      function (data) {
        if (data != null) {
          var html = "";
          var sadmin = document.querySelector("#sadministradores");
          var sopera = document.querySelector("#soperadores");

          for (var i = 0; i < data.length; i++) {
            var itm = data[i];
            if (itm.type != "team") { continue; }
            var selected = "";
            html += `<option value="${itm.id}">${itm.name}</option>`;
          }
          var nhtml = "";
          if (sadmin) {
            // if(model.adminuuid=="")
            nhtml = "<option value='owner'>(El dueño)</option>";
            nhtml = nhtml + html;
            sadmin.innerHTML = nhtml;
            sadmin.value = model.adminuuid == "" ? "owner" : model.adminuuid;
          }
          nhtml = "";
          if (sopera) {
            // if(model.operauuid=="")
            nhtml = "<option value='all'>(Todos)</option>";
            nhtml = nhtml + html;
            sopera.innerHTML = nhtml;
            sopera.value = model.operauuid == "" ? "all" : model.operauuid;
          }


        }
      },
      function (error) {
        util.messageBox(error.message ?? error);
      }, "POST", false, true, "");
  },
  saveSetting: function () {
    var sadmin = document.querySelector("#sadministradores");
    var sopera = document.querySelector("#soperadores");
    var data =
    {
      admin: sadmin.value,
      opera: sopera.value
    }
    model.invoke_service("./_new/", data,
      function (data) {
        if (data != null) {
          window.location.reload();
        }
      },
      function (error) {
        util.messageBox(error.message ?? error);
      }, "POST", false, true, "");
  },
  uploadCSV: function (url) {
    var fdata = new FormData();
    var fcsv = document.querySelector("#inpfileupload");
    var dvlog = document.querySelector("#dv-file-log");

    if (fcsv.files.length <= 0) {
      util.messageBox("Seleccione un archivo para subir");
      return;
    }
    var spinner = document.querySelector("#dv-sppiner");
    spinner.classList.remove("d-none");
    dvlog.classList.add("d-none");
    for (var i = 0; i < fcsv.files.length; i++) {
      var file = fcsv.files[i];
      fdata.append(file.name, file);
    }

    model.invoke_service(url, fdata,
      function(data) {
        console.log(data);
        fcsv.value = "";

        spinner.classList.add("d-none");
        if (data != null && data != "") { dvlog.classList.remove("d-none"); }
      },
      function(error) {
        console.log(error);
        fcsv.value = "";
        
        spinner.classList.add("d-none");
        // dvlog.classList.remove("d-none");
        util.messageBox(error.message ?? error);
      }, "POST", false, true, "", true);
  }
}