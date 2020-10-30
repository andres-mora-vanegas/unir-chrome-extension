// var baseImage = "";
// var loading = `<img src="https://ingenieroandresmora.com/personal/loader.gif" style="display:block;margin:auto" />`;

// /**
//  * función que retorna el modal
//  * */
// function modal() {
//   return `
//     <div class='blackx'>
//         <div id='master-modal' class='whitex overflow white-responsive'>
//             <button type='button' class='close' data-dismiss='modal'>×</button>
//             <div class='secondWhite'>${loading}</div>
//             <div class='thirdWhite' id='thirdWhite' style='display:none'></div>
//         </div>
//     </div>
//     <div class='backdrop'></div>`;
// }

// /**
//  * esta funcion se encarga de abrir el modal
//  */
// function openModal(content) {
//   debugger;
//   if (content != null || content != "") {
//     //$(".secondWhite").css("display", "none");
//     $(".thirdWhite")
//       .fadeIn()
//       .html(content);
//   }
//   $(".blackx,.whitex,.backdrop").fadeIn();
//   $("body").css("overflow", "hidden");
// }

// /**
//  * esta funcion se encarga de cerrar el modal
//  */
// function closeModal() {
//   $(".thirdWhite").html("");
//   $(".blackx,.whitex,.backdrop").fadeOut();
// }

// /**
//  * método que se encarga de poner en fullscreen la pantalla cuando se da click en el ícono izquierdo del modal.
//  */
// $(document).on("click", "#full", function(e) {
//   e.preventDefault();
//   let el = document.getElementById("MainPopupIframe");
//   var local = false;
//   if (el == null) {
//     local = true;
//     el = document.getElementById("thirdWhite");
//     el_ = $("#thirdWhite");
//     el_.css("overflow", "auto");
//   }
//   if (screenfull.enabled) {
//     screenfull.request(el);
//     screenfull.on("change", () => {
//       if (local && !screenfull.isFullscreen) {
//         el_.css("overflow", "none");
//       }
//       // console.log('Am I fullscreen?', screenfull.isFullscreen ? 'Yes' : 'No');
//     });
//   }
// });

// /**
//  * esta función se encarga de cerrar el menú modal de componentes
//  */
// $(document).on("click", ".whitex .close,.backdrop", function(e) {
//   e.preventDefault();
//   closeModal();
//   $("body").css("overflow", "auto");
// });

// /**
//  * función que envia una página url a cargar con el modal
//  */
// $(document).on("click", ".toModal,.tinyModalOpen", function(event) {
//   event.preventDefault();
//   var ifr = null;
//   try {
//     var uri = window.location.href;
//     var m = $(this).attr("tomodal");

//     if ($(".blackx").length > 0) {
//       $(".blackx").remove();
//       $(".backdrop").remove();
//     }
//     ifr = `
//     <div class='blackx'>
//         <div id='master-modal' class='whitex overflow white-responsive'>
//             <button type='button' class='find' onclick="find()" >find</button>
//             <button type='button' class='close' data-dismiss='modal'>×</button>
//             <div class='secondWhite'>${loading}</div>
//             <div class='thirdWhite' id='thirdWhite' style='display:none'>
//                 <iframe src="${uri}" id="nexti" scrolling="no" style="width:100%; border:none;height:90vh" onload="fini('cargado')"></iframe>
//             </div>
//         </div>
//     </div>
//     <div class='backdrop'></div>
//     <script>
//     var auto=0;
//     var uri_="";
//     function fini(){
//         if(auto>0){
//             $(".thirdWhite").fadeIn();
//             $(".secondWhite").fadeOut();
//         }
//         else{
//           goCurso();
//             auto++;
//         }
//     }
//     $("body,.whitex").css("overflow", "hidden");
//       $(".secondWhite").fadeIn();
//       $(".blackx,.whitex,.backdrop").fadeIn();
//       $("body").css("overflow", "hidden");
//     function goCurso() {
//       var $f = $("#nexti");
//       $f[0].contentWindow.irCurso(${m});
//     };
//     function find(){
//       debugger;
//       console.log(window.frames)
//       var n=$("[name=Frame3]").contentWindow;
//       console.log(n);
//       uri_=window.frames.location.href;
//       var if_='<iframe src="'+uri_+'" id="videoteca" scrolling="no" style="width:100%; border:none;height:90vh" ></iframe>';
//       $("body").append(if_);
//     }
//     </script>`;
//     $("body").append(ifr);
//   } catch (error) {
//     console.log(error);
//   }
// });

// window.cambia = function(args) {
//   //doStuff();
//   $("body").html();
// };

// function cambia() {
//   $("body").html();

// }

// function find(){
//   var uri=window.frames.location.href;
//   var if_=`<iframe src="${uri}" id="videoteca" scrolling="no" style="width:100%; border:none;height:90vh" ></iframe>`;
//   $("body").append(if_);
// }

// if ($("#myModal1").length < 1) {
//   /*le agrega al body todos los elementos html y hojas de estilo que haya*/
//   //$("body").append(modal());
// }

// /**
//  * función que se encarga de eliminar el doble modal cuando se carga una página dentro del modal
//  */
// function removeMultipleModal() {
//   setTimeout(function() {
//     $(".blackx")
//       .not(":first")
//       .remove();
//     $(".whitex")
//       .not(":first")
//       .remove();
//     $(".backdrop")
//       .not(":first")
//       .remove();
//     $(".modal.fade")
//       .not(":first")
//       .remove();
//   }, 2000);
// }

// /**
//  * function que elimina el
//  */

// function replaceToModal() {
//   $(".texto a").each(function() {
//     var hiper = $(this)
//       .attr("onclick")
//       .toString();
//     $(this).removeAttr("onclick");
//     hiper = hiper.replace("function onclick(event) {", "");
//     hiper = hiper.replace("irCurso(", "");
//     hiper = hiper.replace(")", "");
//     hiper = hiper.replace(";", "");
//     hiper = hiper.replace("}", "");
//     $(this).addClass("toModal");
//     $(this).attr("toModal", hiper);
//     $(this).attr("href", "#");
//     $(this)
//       .parent()
//       .append(
//         '<span class="toModal" tomodal="' +
//           hiper +
//           '">' +
//           $(this).html() +
//           "</span>"
//       );
//     $(this).hide();
//   });
// }

// /* function replaceToModal(){
//     var ifr=`

//     <iframe src="https://mastereduonline.unir.net/cursos" id="nexti" scrolling="no" style="width:100%; border:none;height:100vh"></iframe>
//     <script>
//     setTimeout(() => {
//       var m = $(this).attr("tomodal");
//       var $f = $("#nexti");
//       $f[0].contentWindow.irCurso(m);
//     }, 3000);
//     </script>
//     `
//     $("body").append(`
//     <iframe src="https://mastereduonline.unir.net/cursos" id="nexti" scrolling="no" style="width:100%; border:none;height:100vh"></iframe>
//     <script>
//     setTimeout(() => {
//       //var m = $(this).attr("tomodal");
//       var $f = $("#nexti");
//       $f[0].contentWindow.irCurso("LIFEFID", 0);
//     }, 3000);
//     </script>
//     `);
// } */

// function irCurso(a, b) {
//   console.log(a);
//   console.log(b);
// }

// $(document).ready(function() {
//   console.log("hola");
//   replaceToModal();
// });
