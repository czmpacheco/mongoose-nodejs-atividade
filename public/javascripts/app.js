$(function () {
    /*$("#fetchdata").on('click', function () {
        $.get("/fetchdata", function (data) {
            var registro = data['data'];
            $("#trdata").html('');
            $("#message").hide();
            var string = '';
            $.each(registro, function (index, registro) {
                string += '<tr><td>' + (index + 1) + '</td><td>' + registro['fabricante'] + '</td><td>' + registro['ano'] + '</td><td>' + registro['preco'] + '</td><td>' + registro['cor'] + '</td><td>' + registro['condicao'] +
                    '</td><td>';
            });
            $("#trdata").html(string);
        });
    });*/

    $("#importdata").on('click', function () {
        $.get("/import", function (data) {
            $("#message").show().html(data['success']);
        });
    });
});