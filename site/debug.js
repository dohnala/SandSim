var $ = require( "jquery" );

$('#pause').click(e => alert('paused'));
$('#nextFrame').click(e => alert('nextFrame'));

$('#velocity').change(() => $('#velocity').is(":checked") ? alert('checked') : alert('unchecked'));
$('#forceX').click(() => $('#forceX').is(":checked") ? alert('checked') : alert('unchecked'));
$('#forceY').click(() => $('#forceY').is(":checked") ? alert('checked') : alert('unchecked'));