function addAuxMenu() {
  const par = document.createElement("div");
  const url = "http://ucentral.mrooms.net/";
  par.innerHTML = `
<div class="help">
<a href="${url}admin/search.php" >Administrador</a>
<br>
<a href="${url}course/management.php#coursesearch" >Buscar cursos</a>
<br>
<a href="${url}admin/user.php" >Buscar usuarios</a>
<br>
<a href="${url}backup/restorefile.php?contextid=1" >Backups</a>
<br>
<a href="${url}admin/tool/uploaduser/index.php">Subir usuarios</a>
</div>`;
  if (/mrooms/.test(window.location.href)) {
    document.body.prepend(par);
  }
}

addAuxMenu();
