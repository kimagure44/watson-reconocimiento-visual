var WATSON = WATSON || {};

WATSON = {
    showLoading: function(status) {
        document.querySelector(".loader").style.display = status ? "block" : "none";
    },
    ajax: function(url, evt) {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open('POST', url, true);
            request.onreadystatechange = function(aEvt) {
                if (request.readyState == 4) {
                    var html = "";
                    if (request.status == 200) {
                        var responseJSON = JSON.parse(request.responseText);
                        html += "<h3>Imagenes procesadas: " + responseJSON.images_processed + "</h3>";
                        var clasi = responseJSON.images[0]["classifiers"][0]["classes"];
                        clasi.sort(function(a, b) {
                            return b.score - a.score;
                        });
                        for (var propiedad in clasi) {
                            if (clasi.hasOwnProperty(propiedad)) {
                                html += "<ul>";
                                typeof clasi[propiedad].class !== "undefined" ? html += "<li><b>" + clasi[propiedad].class + "</b></li>" : html += "";
                                typeof clasi[propiedad].score !== "undefined" ? html += "<li><progress value='" + (clasi[propiedad].score * 100) + "' max='100'></progress> <b>" + clasi[propiedad].score + "</b></li>" : html += "";
                                //typeof clasi[propiedad].type_hierarchy !== "undefined" ? html += "<b>" + clasi[propiedad].type_hierarchy + "</b><br>" : html += "<br>";
                                html += "</ul>";
                            }
                        }
                        resolve(html);
                    } else {
                        html += "Error loading page";
                        reject(html);

                    }
                }
            };
            request.send(new FormData(evt.target));
        });
    }
};
window.onload = function() {
    var form = document.querySelector('form');
    var submit = document.querySelector("input[type='file']");
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        WATSON.showLoading(true);
        WATSON.ajax('http://localhost:3000/uploadImage', e).then(function(success) {
            WATSON.showLoading(false);
            document.querySelector(".clasificacion").innerHTML = success;
        }).catch(function(err) {
            WATSON.showLoading(false);
            document.querySelector(".clasificacion").innerHTML = err;
        });
    });

    submit.addEventListener("change", function(evt) {
        var files = evt.target.files;
        for (var data in files) {
            if (files.hasOwnProperty(data) && files[data].type.match("image.*")) {
                var reader = new FileReader();
                reader.onload = (function(theFile) {
                    return function(e) {
                        var img = document.querySelector("img");
                        img.src = e.target.result;
                        img.title = escape(theFile.name);
                        img.classList.add("show");
                        document.querySelector("input[type='submit']").removeAttribute("disabled");
                    };
                })(files[data]);
                reader.readAsDataURL(files[data]);
            }
        }
    }, false);
};